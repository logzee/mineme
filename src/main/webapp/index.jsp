<%--
  Created by IntelliJ IDEA.
  User: logzee
  Date: 04.03.16
  Time: 21:25
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE HTML>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>MineMe</title>
    <link rel="stylesheet" href="css/foundation.min.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/screen.css">
</head>
<body>
<div class="title-bar" data-responsive-toggle="realEstateMenu" data-hide-for="small">
    <div class="title-bar-title">MineMe</div>
</div>
<div class="top-bar" id="realEstateMenu">
    <div class="top-bar-right">
        <ul class="menu">
            <li><a class="button" href="addevent.jsp">Добавить событие</a></li>
        </ul>
    </div>
</div>
<br>
<div class="row">
    <div class="medium-12 large-6 columns">
        <h1>Василий Пупкин</h1>
        <ul>
            <li>Настроение: хорошее</li>
            <li>Физическое состояние: среднее</li>
            <li>Последняя физическая активность: 20 минут назад</li>
            <li>Последний прием пищи: 5 минут назад</li>
        </ul>
    </div>
    <div class="medium-12 large-6 columns">
        <h2>Лог последних событий</h2>
        <div class="callout">
            <p>Здесь будет список последних событий, например</p>
            <ul>
                <li>5 минут назад > Завтрак: позавтракал овсянкой с кофе</li>
            </ul>
        </div>
    </div>
</div>
<div class="row column">
    <hr>
</div>
<div class="row column">
    <p class="lead">Графики</p>
</div>
<div class="row large-12 columns">
    <div class="column">
        <div class="callout">
            <p>Здесь будут графики, например</p>
            <img src="img/plot-example.png" width="100%"/>
        </div>
    </div>
</div>
</body>
</html>