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
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data?method=getEventTypesStruct', false);
    xhr.send();
    var structRoot = JSON.parse(xhr.responseText).struct;

    var ignoreKeylogger = getRequestParam('ignoreKeylogger');
    if (ignoreKeylogger != undefined && ignoreKeylogger != 'false') {
        ignoreKeylogger = true;
    }
    xhr.open('GET', 'data?method=getLastEvents&count=100&ignoreKeylogger=' + ignoreKeylogger, false);
    xhr.send();
    var eventsData = JSON.parse(xhr.responseText);

    var eventLogDl = document.getElementById('event-log');

    for(var i = 0; i < eventsData.length; i++) {
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'uk-panel uk-panel-box uk-margin-small');
        var dl = document.createElement('dl');
        dl.setAttribute('class', 'uk-list uk-list-line uk-description-list-line uk-margin-remove');

        var closeBtn = document.createElement('span');
        closeBtn.setAttribute('class', 'uk-close uk-float-right uk-close-alt');
        var id = eventsData[i]._id.$oid;
        closeBtn.setAttribute('onclick', 'deleteEvent(this, "' + id + '");');

        var dt = document.createElement('dt');
        dt.setAttribute('class', 'uk-text-truncate');

        var dd = document.createElement('dd');
        dd.innerHTML = formatDate(eventsData[i].date);

        var tagsWrapper = undefined;
        if (eventsData[i].hasOwnProperty('tags') && eventsData[i].tags.length > 0) {
            tagsWrapper = document.createElement('div');
            for (var j = 0; j < eventsData[i].tags.length; j++) {
                var tag = document.createElement('span');
                tag.setAttribute('class', 'uk-badge uk-margin-small-right');
                tag.innerHTML = eventsData[i].tags[j];
                tagsWrapper.appendChild(tag);
            }
        }

        var dtContent = '';
        var currentStruct = structRoot.value[eventsData[i].chain[0]];
        dtContent += '<h3 class="uk-margin-remove">' + currentStruct.title + '</h3> ';
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

        wrapper.appendChild(closeBtn);
        dl.appendChild(dt);
        if (tagsWrapper != undefined) {
            dl.appendChild(tagsWrapper);
        }
        dl.appendChild(dd);
        wrapper.appendChild(dl);

        eventLogDl.appendChild(wrapper);
    }
}

/**
 * Called when user request deletion
 * @param element     element that represents event
 * @param id          id of the event
 */
function deleteEvent(element, id) {
    UIkit.modal.confirm("Удалить событие?", function() {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'data?method=removeEvent', false);
            xhr.send(id);
            if (xhr.status != 200) {
                UIkit.modal.alert("Ошибка при удалении: " + xhr.status + ", " + xhr.response);
            } else {
                element.parentElement.remove();
            }
        } catch (ignored) {}
    });
}

/**
 * Gets "GET" request params
 * @param name     name of the param
 * @returns {string}    value of the param
 */
function getRequestParam(name){
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}

/**
 * Formats date
 * @param timestamp     event timestamp
 * @returns {String}
 */
function formatDate(timestamp) {
    var currentTimestamp = parseInt(document.getElementById('server-timestamp').innerHTML);
    var eventTimestamp = parseInt(timestamp);
    var delta = currentTimestamp - eventTimestamp;

    var date = new Date(eventTimestamp);
    // date.getHours() + ":" + date.getSeconds() + " " + date.getDay() + "." + date.getMonth() + "." + date.getFullYear() + ', ' + 
    return smartTime(delta);
}

/**
 * Formats passed time
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
 * Noun declension function according to a number
 * @param number    number to incline
 * @param titles    array of noun cases
 **/
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

document.addEventListener('DOMContentLoaded', eventLogInit);