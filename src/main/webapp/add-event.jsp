<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="classes.DBManager" %>

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
<%-- Data from MongoDB that describes events structure for JavaScript --%>
<div hidden id="struct-data"><%= dbManager.getStruct() %></div>
<nav class="uk-navbar uk-margin-large-bottom uk-navbar-attached">
    <div class="uk-container uk-container-center">
        <a class="uk-navbar-brand" href="index.jsp">MineMe</a>
        <ul class="uk-navbar-nav">
            <li class="uk-active"><a>Добавить событие</a></li>
        </ul>
    </div>
</nav>
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
                    <a class="uk-button uk-button-primary uk-margin-small-top" onclick="sendData()"><i class="fa fa-floppy-o"></i> Сохранить событие</a>
                    <a class="uk-button uk-button-danger uk-margin-small-top" href="index.jsp"><i class="fa fa-ban"></i> Отменить</a>
                </div>
            </fieldset>
        </form>
    </div>
</div>
<script src="js/add-event.js" language="Javascript" type="text/javascript"></script>
</body>
</html>
<div id="response-debug"></div>