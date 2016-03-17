/**
 * OK. First of all we take data about the events structure and the last 10 events from the hidden tags on the page.
 * Now we have think I call "event chain" (array of numbers) which tells what kind of event is it. We go through it and interpret these numbers
 * into words. Also, we format date by smartTime function so now we know how much time has passed since the event.
 *
 * Event string forming algorithm detail explanation.
 * 1. It takes name of a type and then name of a subtype then name of a sub-subtype etc. as long as this "tree" exists in the structure.
 *  1.1 These type names being concatenated to a result string.
 * 2. When it gets a value that is unmatched in the structure it concatenates it as it is, because this is a value, not a type name. Range for a run, for example.
 */
function eventLogInit() {
    var eventsData = JSON.parse(document.getElementById('last-events').innerHTML);
    var structRoot = JSON.parse(document.getElementById('struct-data').innerHTML).struct;

    var eventLogDl = document.getElementById('event-log');

    for(var i = 0; i < eventsData.length; i++) {
        var dt = document.createElement('dt'); // событие
        var dd = document.createElement('dd'); // время с момента события

        dd.innerHTML = formatDate(eventsData[i].date);

        var dtContent = '';
        var currentStruct = structRoot.value[eventsData[i].chain[0]];
        dtContent += currentStruct.title + '. ';
        for (var j = 1; j < eventsData[i].chain.length; j++) { // тут мы берем цифры из цепочки событий

            var chainItem = eventsData[i].chain[j];
            if (chainItem instanceof Array) {
                for (var k = 0; k < chainItem.length; k++) {
                    dtContent += currentStruct.value[k].title + ': ' + chainItem[k] + '. ';
                }
            } else {
                // если следующий узел - массив (то есть это не конечный узел)
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
 * @returns {String}
 */
function formatDate(timestamp) {
    var currentTimestamp = parseInt(document.getElementById('server-timestamp').innerHTML);
    var eventTimestamp = parseInt(timestamp);
    var delta = currentTimestamp - eventTimestamp;
    return smartTime(delta);
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
        return minutes + ' ' + numberDeclension(minutes, ['минута', 'минуты', 'минут']) + ' назад';
    }

    var message;

    var hours = Math.round(minutes/60);
    if(hours < 24) {
        message = hours + ' ' + numberDeclension(hours, ['час', 'часа', 'часов']);
        if (minutes % 60 > 0) {
            message += ' ' + minutes % 60 + ' ' + numberDeclension(minutes % 60, ['минута', 'минуты', 'минут']);
        }
        message += ' назад';
        return message;
    }

    var days = Math.round(hours/24);
    if(days < 30) {
        message = days + ' ' + numberDeclension(days, ['день', 'дня', 'дней']);
        if (hours % 24 > 0) {
            message += ' ' + hours % 24 + ' ' + numberDeclension(hours % 24, ['час', 'часа', 'часов']);
        }
        message += ' назад';
        return message;
    }

    var months = Math.round(days/30);
    if(months < 12) {
        message = months + ' ' + numberDeclension(months, ['месяц', 'месяца', 'месяцев']);
        if (days % 30 > 0) {
            message += ' ' + days % 30 + ' ' + numberDeclension(days % 30, ['день', 'дня', 'дней']);
        }
        message += ' назад';
        return message;
    }
    message = Math.round(months/12) + ' ' + numberDeclension(months/12, ['год', 'года', 'лет']);
    if (months % 12 > 0) {
        message += ' ' + months % 12 + ' ' + numberDeclension(months % 12, ['месяц', 'месяца', 'месяцев']);
    }
    message += ' назад';
    return message;
}

/**
 * Noun declension function according to a number
 * @param number    number to incline
 * @param cases     array of noun cases
 **/
function numberDeclension(number, cases) {
    cases = [2, 0, 1, 1, 1, 2];
    return cases[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

document.addEventListener('DOMContentLoaded', eventLogInit);