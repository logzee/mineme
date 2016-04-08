<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.Date" %>
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
<nav class="uk-navbar uk-margin-large-bottom uk-navbar-attached">
    <div class="uk-container uk-container-center">
        <a class="uk-navbar-brand" href="/">MineMe</a>
        <ul class="uk-navbar-nav">
            <li class="uk-active"><a>Добавить событие</a></li>
        </ul>
    </div>
</nav>
<!-- Server time in case if client's time is incorrect. Put in the hidden tag so the data loads faster -->
<div hidden id="server-timestamp"><%= new Date().getTime() %></div>
<div class="uk-container uk-container-center uk-margin-top uk-margin-large-bottom">
    <div class="uk-container-center">
        <h1>Добавить событие</h1>
        <form class="uk-panel uk-panel-box uk-form">
            <div id="alert-wrapper"></div>
            <fieldset>
                <div id="form-wrapper" class="uk-form-row">
                    <select name="type" id="event-dropdown" onChange="updateForm(this)">
                    </select>
                </div>
                <div class="uk-form-row">
                    <input type="text" id="tags" placeholder="Тэги (через запятую)">
                </div>
                <div class="uk-form-row">
                    <input type="text" id="time-picker" placeholder="Время" data-uk-timepicker>
                </div>
                <div class="uk-form-row">
                    <input type="text" id="date-picker" placeholder="Дата" data-uk-timepicker>
                </div>
                <div class="uk-form-row">
                    <a class="uk-button uk-button-primary uk-margin-small-top" onclick="sendData()"><i class="fa fa-floppy-o"></i> Сохранить событие</a>
                    <a class="uk-button uk-margin-small-top" onclick="clearTagsAndTime()"><i class="fa fa-refresh"></i> Очистить</a>
                </div>
            </fieldset>
        </form>
    </div>
</div>
<script src="js/add-event.js" language="Javascript" type="text/javascript"></script>
</body>
</html>
<div id="response-debug"></div>