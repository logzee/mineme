// инициализация списка последних событий
function eventLogInit() {
    var eventsData = JSON.parse(document.getElementById('last-events').innerHTML);
    var structRoot = JSON.parse(document.getElementById('struct-data').innerHTML).struct;

    var eventLogDl = document.getElementById('event-log');

    for(var i = 0; i < eventsData.length; i++) {
        var dt = document.createElement('dt'); // событие
        var dd = document.createElement('dd'); // время с момента события

        dd.innerHTML = formatDate(eventsData[i].date);

        var dtContent = "";
        var currentStruct = structRoot.value;
        for (var j = 0; j < eventsData[i].chain.length; j++) { // тут мы берем цифры из цепочки событий
            currentStruct = currentStruct.value[eventsData[i].chain[j]];
            var title = currentStruct.title;
            dtContent += title + ", ";
        }
        dt.innerHTML = dtContent.substring(0, dtContent.length - 2);

        eventLogDl.appendChild(dt);
        eventLogDl.appendChild(dd);
    }
}


function formatDate(timestamp) {
    var currentTimestamp = parseInt(document.getElementById('server-timestamp').innerHTML);
    var eventTimestamp = parseInt(timestamp);
    var delta = currentTimestamp - eventTimestamp;
    var timePassed = smartTime(delta);
    return timePassed;
}

function smartTime(time) {
    var seconds = time / 1000;
    if (seconds < 60) {
        return 'Меньше минуты назад';
    }

    var minutes = Math.round(seconds/60);
    if (minutes < 60) {
        return minutes + " " + declOfNum(minutes, ['минута', 'минуты', 'минут']) + ' назад';
    }

    var hours = Math.round(minutes/60);
    if(hours < 24) {
        return hours + " " + declOfNum(hours, ['час', 'часа', 'часов']) + ' назад';
    }

    var days = Math.round(hours/24);
    if(days < 30) {
        return days + " " + declOfNum(days, ['день', 'дня', 'дней']) + ' назад';
    }

    var months = Math.round(days/30);
    if(months < 12) {
        return months + " " + declOfNum(months, ['месяц', 'месяца', 'месяцев']) + ' назад';
    }
    return Math.round(months/12) + " " + declOfNum(months/12, ['год', 'года', 'лет']) + ' назад';
}

function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

document.addEventListener("DOMContentLoaded", eventLogInit);