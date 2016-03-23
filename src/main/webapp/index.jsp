<%@ page import="classes.DBManager" %>
<%@ page import="java.util.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    DBManager dbManager = new DBManager();
%>

<!DOCTYPE HTML>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MineMe</title>
    <link rel="stylesheet" href="css/uikit.min.css">
    <link rel="stylesheet" href="css/uikit.gradient.min.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/mineme.css">
    <link rel="icon" type="image/png" href="img/favicon.ico" />
    <script src="js/jquery.js"></script>
    <script src="js/uikit.min.js"></script>
</head>
<body>
<%-- Server time in case if the client's time is incorrect --%>
<div hidden id="server-timestamp"><%= new Date().getTime() %></div>
<%--  List of last 10 events from MongoDB in JSON format --%>
<div hidden id="last-events"><%= dbManager.getLastEventsJson(10, true) %></div>
<%-- Data from MongoDB describing events structure for the JavaScript --%>
<div hidden id="struct-data"><%= dbManager.getStruct() %></div>

<nav class="uk-navbar uk-margin-large-bottom uk-navbar-attached">
    <div class="uk-container uk-container-center">
        <div class="uk-navbar-brand">MineMe</div>
        <ul class="uk-navbar-nav">
            <li><a href="add-event.jsp">Добавить событие</a></li>
        </ul>
    </div>
</nav>
<div class="uk-container uk-container-center uk-margin-top uk-margin-large-bottom">
    <div class="uk-grid" data-uk-grid-match>
        <div class="uk-width-large-1-2 uk-width-medium-1-1 uk-margin-large-bottom">
            <div class="uk-panel uk-panel-box">
                <div class="uk-display-block uk-comment-meta">
                    <img class="uk-comment-avatar uk-border-rounded" src="img/profile.png" alt="Avatar" width="59">
                    <h1 class="uk-comment-title">Малышев Михаил</h1>
                    <div class="uk-comment-meta">
                        <a href="https://github.com/logzee" class="uk-icon-button uk-icon-github"></a>
                        <a href="http://vk.com/logzee" class="uk-icon-button uk-icon-vk"></a>
                        <a href="https://twitter.com/MichaelMalyshev" class="uk-icon-button uk-icon-twitter"></a>
                        <a href="https://www.instagram.com/miwanya_vidit/" class="uk-icon-button uk-icon-instagram"></a>
                    </div>
                </div>
                <hr>
                <dl class="uk-list uk-list-line uk-description-list-line">
                    <dt>Настроение</dt><dd>не найдено</dd>
                    <dt>Физическое состояние</dt><dd>не найдено</dd>
                    <dt>Последняя физическая активность</dt><dd>не найдено</dd>
                    <dt>Последний прием пищи</dt><dd>не найдено</dd>
                </dl>
            </div>
        </div>
        <div class="uk-width-large-1-2 uk-width-medium-1-1">
            <div class="uk-panel uk-panel-box">
                <h1 class="uk-panel-title">Последние события</h1>
                <dl class="uk-list uk-list-line uk-description-list-line" id="event-log">
                </dl>
            </div>
        </div>
    </div>
    <hr>
    <h2>Биоритмы</h2>
    <p>Здесь будут графики, например</p>
    <div id="chart_div"></div>
</div>
<script src="js/index.js" language="Javascript" type="text/javascript"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript">
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

    google.charts.load('current', {packages: ['corechart', 'line']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        // Define the chart to be drawn.
        var data = new google.visualization.DataTable();

        data.addColumn('date', 'X');
        data.addColumn('number', 'Настроение');
        data.addRows(dataRows);

        var options = {
            title: 'Зависимость настроения от физической активности',
            hAxis: {
                title: 'Дата'
            },
            curveType: 'function',
            vAxis: {
                title: 'Настроение'
            },
            legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

        chart.draw(data, options);
    }
</script>
</body>
</html>