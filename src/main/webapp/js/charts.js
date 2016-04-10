google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(chartsInit);

chartColors = ['#07d', '#82bb42'];

function chartsInit() {
    requestAndDraw('data?method=getEventsByType&type=4&msAgo=604800000', drawKeyloggerChart, 'comp_chart');
    requestAndDraw('data?method=getEventsByType&type=1&msAgo=604800000', drawMoodChart, 'mood_chart');
    requestAndDraw('data?method=getEventsByType&type=0,4&msAgo=604800000', drawStepsChart, 'steps_chart');
    requestAndDraw('data?method=getEventsByType&type=3&msAgo=604800000', drawSleepChart, 'sleep_chart');
}

function requestAndDraw(request, drawFunction, htmlId) {
    toggleLoading(htmlId);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', request, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            drawFunction(data);
            toggleLoading(htmlId);
        }
    }
}

function toggleLoading(htmlId) {
    var elem = document.getElementById(htmlId);
    var innerHtml = elem.innerHTML;
    innerHtml = (innerHtml.trim) ? innerHtml.trim() : innerHtml.replace(/^\s+/,'');
    if(innerHtml == '') {
        var spinner = document.createElement('div');
        spinner.setAttribute('class', 'spinner');
        elem.appendChild(spinner);
    } else {
        elem.innerHTML = '';
    }
}

function drawMoodChart(moodData) {
    var dataRows = [];
    for (var i = 0; i < moodData.length; i++) {
        var date = parseInt(moodData[i].date);
        var value = parseInt(moodData[i].chain[1]);
        dataRows.push([new Date(date), value]);
    }

    // Define the chart to be drawn.
    var data = new google.visualization.DataTable();

    data.addColumn('date', 'Дата');
    data.addColumn('number', 'Настроение');
    data.addRows(dataRows);

    var options = {
        curveType: 'function',
        vAxis: {
            title: 'Настроение',
            baselineColor: '#fff',
            gridlineColor: '#fff',
            textPosition: 'none'
        },
        legend: { position: 'bottom' },
        colors: chartColors
    };

    var mood_chart = new google.visualization.LineChart(document.getElementById('mood_chart'));

    mood_chart.draw(data, options);
}


function drawKeyloggerChart(keyloggerData) {
    var dataRows = [];
    for (var i = 0; i < keyloggerData.length; i++) {
        var date = parseInt(keyloggerData[i].date);
        var value = parseInt(keyloggerData[i].chain[1]);
        dataRows.push([new Date(date), value]);
    }

    var data = new google.visualization.DataTable();

    data.addColumn('date', 'Дата');
    data.addColumn('number', 'Нажатий клавиш');
    data.addRows(dataRows);

    var options = {
        vAxis: {
            title: 'Активность',
            baselineColor: '#fff',
            gridlineColor: '#fff',
            textPosition: 'none'
        },
        legend: { position: 'bottom' },
        colors: chartColors,
        curveType: 'function',
    };

    var comp_chart = new google.visualization.ScatterChart(document.getElementById('comp_chart'));

    comp_chart.draw(data, options);
}

function drawStepsChart(stepsData) {

    var dataRows = [];
    for (var i = 0; i < stepsData.length; i++) {
        var date = parseInt(stepsData[i].date);
        var value = parseInt(stepsData[i].chain[stepsData[i].chain.length-1]);
        dataRows.push([new Date(date), value]);
    }

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Дата');
    data.addColumn('number', 'Количество шагов');
    data.addRows(dataRows);

    var options = {
        vAxis: {
            title: 'Количество шагов',
            scaleType: 'mirrorLog'
        },

        height: 210,
        legend: { position: 'none' },
        chartArea: {
            top: 55,
            width: '98%',
            height: '87%',
        },
        colors: chartColors
    };

    var stepsChart = new google.visualization.ColumnChart(document.getElementById('steps_chart'));

    stepsChart.draw(data, options);
}

function drawSleepChart(sleepData) {
    var dataRows = [];
    
    for (var i = 0; i < sleepData.length; i++) {
        var date = parseInt(sleepData[i].date);
        // "chain":["3",["06:13","03:07"]]
        var totalTime = parseInt(sleepData[i].chain[1][0].split(":")[0]) + parseInt(sleepData[i].chain[1][0].split(":")[1])/60;
        var deepSleepTime = parseInt(sleepData[i].chain[1][1].split(":")[0]) + parseInt(sleepData[i].chain[1][1].split(":")[1])/60;
        dataRows.push([new Date(date), totalTime, deepSleepTime]);
    }

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Дата');
    data.addColumn('number', 'Продолжительность');
    data.addColumn('number', 'Глубокий сон');
    data.addRows(dataRows);

    var options = {
        vAxis: {
            title: 'Качество сна',
            scaleType: 'mirrorLog'
        },
        height: 210,
        legend: { position: 'none' },
        chartArea: {
            top: 55,
            width: '98%',
            height: '87%',
        },
        colors: chartColors
    };

    var sleepChart = new google.visualization.ColumnChart(document.getElementById('sleep_chart'));

    sleepChart.draw(data, options);
}
