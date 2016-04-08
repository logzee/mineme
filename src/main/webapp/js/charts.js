google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawCharts);

chartColors = ['#07d', '#82bb42'];

function drawCharts() {
    drawKeyloggerChart();
    drawMoodChart();
    drawStepsChart();
    drawSleepChart();
}
function drawMoodChart() {
    var xhr = new XMLHttpRequest();
    // method = getEventsByType, type=1 (настроение), msAgo = 604800000 (неделя)
    xhr.open('GET', 'data?method=getEventsByType&type=1&msAgo=604800000', false);
    xhr.send();

    var moodData = JSON.parse(xhr.responseText);
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
            title: 'Настроение'
        },
        legend: { position: 'bottom' },
        colors: chartColors
    };

    var mood_chart = new google.visualization.LineChart(document.getElementById('mood_chart'));

    mood_chart.draw(data, options);
}


function drawKeyloggerChart() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'data?method=getEventsByType&type=4&msAgo=604800000', false);
    xhr.send();

    var keyloggerData = JSON.parse(xhr.responseText);
    var dataRows = [];
    for (var i = 0; i < keyloggerData.length; i++) {
        var date = parseInt(keyloggerData[i].date);
        var value = parseInt(keyloggerData[i].chain[1]);
        dataRows.push([new Date(date), value]);
    }

    // Define the chart to be drawn.
    var data = new google.visualization.DataTable();

    data.addColumn('date', 'Дата');
    data.addColumn('number', 'Нажатий клавиш');
    data.addRows(dataRows);

    var options = {
        vAxis: {
            title: 'Активность'
        },
        legend: { position: 'bottom' },
        colors: chartColors,
        curveType: 'function',
    };

    var comp_chart = new google.visualization.LineChart(document.getElementById('comp_chart'));

    comp_chart.draw(data, options);
}

function drawStepsChart() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'data?method=getEventsByType&type=0,4&msAgo=604800000', false);
    xhr.send();

    var stepsData = JSON.parse(xhr.responseText);
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
        height: 350,
        legend: { position: 'none' },
        chartArea: {
            top: 55,
            width: '98%',
            height: '50%',
        },
        colors: chartColors
    };

    var stepsChart = new google.visualization.ColumnChart(document.getElementById('steps_chart'));

    stepsChart.draw(data, options);
}

function drawSleepChart() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'data?method=getEventsByType&type=3&msAgo=604800000', false);
    xhr.send();

    var sleepData = JSON.parse(xhr.responseText);

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
        height: 350,
        legend: { position: 'none' },
        chartArea: {
            top: 55,
            width: '98%',
            height: '50%',
        },
        colors: chartColors
    };

    var sleepChart = new google.visualization.ColumnChart(document.getElementById('sleep_chart'));

    sleepChart.draw(data, options);
}
