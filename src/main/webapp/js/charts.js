google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawCharts);

function drawCharts() {
    drawKeyloggerChart();
    drawMoodChart();
    drawStepsChart();
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
        hAxis: {
            title: 'Дата'
        },
        curveType: 'function',
        vAxis: {
            title: 'Настроение'
        },
        legend: { position: 'bottom' }
    };

    var mood_chart = new google.visualization.LineChart(document.getElementById('mood_chart'));

    mood_chart.draw(data, options);
}


function drawKeyloggerChart() {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'data?method=getEventsByType&type=4&msAgo=604800000', false);
    xhr.send();

    var keyloggerData = JSON.parse(xhr.responseText);
    debugger;
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
        hAxis: {
            title: 'Дата',
            ticks: [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()]
        },
        
        vAxis: {
            title: 'Активность'
        },
        legend: { position: 'bottom' },
        curveType: 'function'
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
        var value = parseInt(stepsData[i].chain[1]);
        dataRows.push([new Date(date), value]);
    }

    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Дата');
    data.addColumn('number', 'Количество шагов');
    data.addRows(dataRows);

    var options = {
        hAxis: {
            title: 'Дата'
        },
        vAxis: {
            title: 'Количество шагов'
        },
        legend: { position: 'none' }
    };

    var stepsChart = new google.visualization.Histogram(document.getElementById('steps_chart'));

    stepsChart.draw(data, options);
}
