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
        var wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'uk-panel uk-panel-box uk-margin-small');
        var dl = document.createElement('dl');
        dl.setAttribute('class', 'uk-list uk-list-line uk-description-list-line uk-margin-remove');

        var dt = document.createElement('dt');
        dt.setAttribute('class', 'uk-text-truncate');

        var dd = document.createElement('dd');
        dd.innerHTML = formatTime(eventsData[i].date) + ", " + formatDate(eventsData[i].date);

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
 * Format date in dd.MM.yyyy
 *
 * @param timestamp
 * @returns {string}
 */
function formatDate(timestamp) {
    var date = new Date(timestamp);

    return ("00" + date.getDate()).slice(-2) + "." +
        ("00" + (date.getMonth() + 1)).slice(-2) + "." +
        date.getFullYear();
}

/**
 * Format time in HH:mm
 *
 * @param timestamp
 * @returns {string}
 */
function formatTime(timestamp) {
    var date = new Date(timestamp);

    return ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2);
}

/**
 * Noun declense according to a number
 *
 * @param number number to incline
 * @param titles array of noun cases
 */
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

document.addEventListener('DOMContentLoaded', eventLogInit);