/*
 Объясняю что происходит.
 Сначала мы достаем из скрытых тегов на странице данные о структуре базы данных и о последних 10 событиях,
 которые представленны в виде цепочки цифр (каждая цифра соответствует названию события из структуры)
 потом мы в цикле проходимся по каждому значению этой цепочки и для каждого события добавляем на страницу запись.
 Ещё мы форматируем дату, чтобы она показывала сколько времени прошло с момента регистрации события.

 Объясню процесс формирования строчки события подробнее: достаем названия типа, подтипа и т.д. до тех пор, пока не встретися необозначенное в структуре
 поле (это мы узнаем по наличию у объекта поля "title") - это и есть значение. Если это массив, то проходимя по нему и добавляем каждое значение к результату.
 */
function eventLogInit() {
    var eventsData = JSON.parse(document.getElementById('last-events').innerHTML);
    var structRoot = JSON.parse(document.getElementById('struct-data').innerHTML).struct;

    var eventLogDl = document.getElementById('event-log');

    for(var i = 0; i < eventsData.length; i++) {
        var dt = document.createElement('dt'); // событие
        var dd = document.createElement('dd'); // время с момента события

        dd.innerHTML = formatDate(eventsData[i].date);

        var dtContent = "";
        var currentStruct = structRoot.value[eventsData[i].chain[0]];
        dtContent += currentStruct.title + ". ";
        for (var j = 1; j < eventsData[i].chain.length; j++) { // тут мы берем цифры из цепочки событий

            var chainItem = eventsData[i].chain[j];
            if (chainItem instanceof Array) {
                for (var k = 0; k < chainItem.length; k++) {
                    dtContent += currentStruct.value[k].title + ": " + chainItem[k] + ". ";
                }
            } else {
                // если следующий узел - массив (то есть это не конечный узел)
                if (currentStruct.value instanceof Array) {
                    currentStruct = currentStruct.value[chainItem];
                    var title = currentStruct.title;
                    dtContent += title + ". ";
                } else {
                    dtContent += currentStruct.value.title + ": " + chainItem.toString() + "  ";
                }
            }
        }
        dt.innerHTML = dtContent.substring(0, dtContent.length - 2);

        dt.setAttribute('class', 'uk-text-truncate');
        eventLogDl.appendChild(dt);
        eventLogDl.appendChild(dd);
    }
}


function formatDate(timestamp) {
    var currentTimestamp = parseInt(document.getElementById('server-timestamp').innerHTML);
    var eventTimestamp = parseInt(timestamp);
    var delta = currentTimestamp - eventTimestamp;
    return smartTime(delta);
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

    var message;

    var hours = Math.round(minutes/60);
    if(hours < 24) {
        message = hours + " " + declOfNum(hours, ['час', 'часа', 'часов']);
        if (minutes % 60 > 0) {
            message += + " " + minutes % 60;
        }
        message += " " + declOfNum(minutes % 60, ['минута', 'минуты', 'минут']) + ' назад';
        return message;
    }

    var days = Math.round(hours/24);
    if(days < 30) {
        message = days + " " + declOfNum(days, ['день', 'дня', 'дней']);
        if (hours % 24 > 0) {
            message += " " + hours % 24;
        }
        message +=  " " + declOfNum(hours % 24, ['час', 'часа', 'часов']) + ' назад';
        return message;
    }

    var months = Math.round(days/30);
    if(months < 12) {
        message = months + " " + declOfNum(months, ['месяц', 'месяца', 'месяцев']);
        if (days % 30 > 0) {
            message += " " + days % 30;
        }
        message += " " + declOfNum(days % 30, ['день', 'дня', 'дней']) + ' назад';
        return message;
    }
    message = Math.round(months/12) + " " + declOfNum(months/12, ['год', 'года', 'лет']);
    if (months % 12 > 0) {
        message += " " + months % 12;
    }
    message += " " + declOfNum(months % 12, ['месяц', 'месяца', 'месяцев']) + ' назад';
    return message;
}

/**
 * Функция склонения числительных
 **/
function declOfNum(number, titles) {
    cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

document.addEventListener("DOMContentLoaded", eventLogInit);