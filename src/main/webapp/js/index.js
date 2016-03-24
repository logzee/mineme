/**
 * OK. First of all we take data about the events structure and the last 10 events from the hidden tags on the page.
 * Now we have think I call "event chain" (array of numbers) which tells what kind of event is it. We go through it and interpret these numbers
 * into words. Also, we format date by smartTime function so now we know how much time has passed since the event.
 *
 * Event string forming algorithm detail explanation.
 * 1. It takes name of a type and then name of a subtype then name of a sub-subtype etc. as long as this "tree" exists in the structure.
 *  1.1 These type names being concatenated to a result string.
 * 2. When algorithm gets a value that is unmatched in the structure it concatenates it as it is, because this is a value, not a type name. Range of a run, for example.
 */
function eventLogInit() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data?method=getEventTypesStruct', false);
    xhr.send();
    var structRoot = JSON.parse(xhr.responseText).struct;

    xhr.open('GET', 'data?method=getLastEvents&count=8', false);
    xhr.send();
    var eventsData = JSON.parse(xhr.responseText);
    

    var eventLogDl = document.getElementById('event-log');

    for(var i = 0; i < eventsData.length; i++) {
        var dt = document.createElement('dt');
        var dd = document.createElement('dd');

        dd.innerHTML = formatDate(eventsData[i].date);

        var dtContent = '';
        var currentStruct = structRoot.value[eventsData[i].chain[0]];
        dtContent += currentStruct.title + '. ';
        for (var j = 1; j < eventsData[i].chain.length; j++) {

            var chainItem = eventsData[i].chain[j];
            if (chainItem instanceof Array) {
                for (var k = 0; k < chainItem.length; k++) {
                    dtContent += currentStruct.value[k].title + ': ' + chainItem[k] + '. ';
                }
            } else {
                if (currentStruct.value instanceof Array) {
                    currentStruct = currentStruct.value[chainItem];
                    var title = currentStruct.title;
                    dtContent += title + '. ';
                } else {
                    dtContent += currentStruct.value.title + ': ' + chainItem.toString() + '  ';
                }
            }
        }
        dt.innerHTML = dtContent.substring(0, dtContent.length - 2);

        dt.setAttribute('class', 'uk-text-truncate');
        eventLogDl.appendChild(dt);
        eventLogDl.appendChild(dd);
    }
}

/**
 * Gets delta from event time and current time and passes it to the smartTime function
 * @param timestamp     event time
 * @returns {String}    formatted time
 */
function formatDate(timestamp) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data?method=serverTimestamp', true);
    xhr.send();

    var formattedDate = "";
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status == 200) {
            var currentTimestamp = parseInt(xhr.responseText);
            var eventTimestamp = parseInt(timestamp);
            var delta = currentTimestamp - eventTimestamp;
            formattedDate = smartTime(delta);
        }
    };
    return formattedDate;
}

/**
 * Formats timestamp into a nice presentation
 * @param timestamp
 * @returns String
 */
function smartTime(timestamp) {
    var seconds = timestamp / 1000;
    if (seconds < 60) {
        return 'Меньше минуты назад';
    }

    var minutes = Math.round(seconds/60);
    if (minutes < 60) {
        return minutes + ' ' + declOfNum(minutes, ['минута', 'минуты', 'минут']) + ' назад';
    }

    var message;

    var hours = Math.round(minutes/60);
    if(hours < 24) {
        message = hours + ' ' + declOfNum(hours, ['час', 'часа', 'часов']);
        if (minutes % 60 > 0) {
            message += ' ' + minutes % 60 + ' ' + declOfNum(minutes % 60, ['минута', 'минуты', 'минут']);
        }
        message += ' назад';
        return message;
    }

    var days = Math.round(hours/24);
    if(days < 30) {
        message = days + ' ' + declOfNum(days, ['день', 'дня', 'дней']);
        if (hours % 24 > 0) {
            message += ' ' + hours % 24 + ' ' + declOfNum(hours % 24, ['час', 'часа', 'часов']);
        }
        message += ' назад';
        return message;
    }

    var months = Math.round(days/30);
    if(months < 12) {
        message = months + ' ' + declOfNum(months, ['месяц', 'месяца', 'месяцев']);
        if (days % 30 > 0) {
            message += ' ' + days % 30 + ' ' + declOfNum(days % 30, ['день', 'дня', 'дней']);
        }
        message += ' назад';
        return message;
    }
    message = Math.round(months/12) + ' ' + declOfNum(months/12, ['год', 'года', 'лет']);
    if (months % 12 > 0) {
        message += ' ' + months % 12 + ' ' + declOfNum(months % 12, ['месяц', 'месяца', 'месяцев']);
    }
    message += ' назад';
    return message;
}

/**
 * Calculates declension of a noun according to a number
 * @param number    number to incline
 * @param titles    array of noun cases
 **/
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

document.addEventListener('DOMContentLoaded', eventLogInit);