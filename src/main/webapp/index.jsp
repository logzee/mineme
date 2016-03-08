<%@ page import="classes.DBManager" %>
<%--
Project mineme
Author: logzee
Date: 04.03.16
Time: 21:25
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    DBManager dbManager = new DBManager();
    dbManager.setCollection("events");
%>

<!DOCTYPE HTML>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>MineMe</title>
    <link rel="stylesheet" href="css/uikit.min.css">
    <link rel="stylesheet" href="css/uikit.gradient.min.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/mineme.css">
    <script src="js/jquery.js"></script>
    <script src="js/uikit.min.js"></script>
</head>
<body>
<div hidden id="last-events"><%= dbManager.getLastEvents(10) %></div>

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
        <div class="uk-width-1-2">
            <div class="uk-panel uk-panel-box">
                <h1 class="uk-panel-title">Василий Пупкин</h1>
                <dl class="uk-list uk-list-line uk-description-list-line">
                    <dt>Настроение</dt><dd>Хорошее</dd>
                    <dt>Физическое состояние</dt><dd>Среднее</dd>
                    <dt>Последняя физическая активность</dt><dd>20 минут назад</dd>
                    <dt>Последний прием пищи</dt><dd>5 минут назад</dd>
                </dl>
            </div>
        </div>
        <div class="uk-width-1-2">
            <div class="uk-panel uk-panel-box">
                <h1 class="uk-panel-title">Последние события</h1>
                <p>Здесь будет список последних событий, например</p>
                <dl class="uk-list uk-list-line uk-description-list-line">
                    <dt>Сон, 8ч.43м.</dt><dd>12 минут назад<dd>
                    <dt>Физическая активность, отжимания, 75</dt><dd>9 минут назад<dd>
                    <dt>Забота о теле, душ</dt><dd>6 минут назад</dd>
                    <dt>Завтрак</dt><dd>меньше минуты назад<dd>
                </dl>
            </div>
        </div>
    </div>
    <hr>
    <h2>Биоритмы</h2>
    <p>Здесь будут графики, например</p>
    <img src="img/plot-example.png" width="100%"/>
</div>
</body>
</html>