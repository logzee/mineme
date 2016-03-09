<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="classes.DBManager" %>

<%
    DBManager dbManager = new DBManager();
    dbManager.setCollection("event-types");
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
    <script src="js/jquery.js"></script>
    <script src="js/uikit.min.js"></script>
</head>
<body>
<!-- Data from MongoDB describing events structure for JavaScript -->
<div hidden id="struct-data"><%= dbManager.getStruct() %></div>
<nav class="uk-navbar uk-margin-large-bottom uk-navbar-attached">
    <div class="uk-container uk-container-center">
        <a class="uk-navbar-brand" href="index.jsp">MineMe</a>
        <ul class="uk-navbar-nav">
            <li class="uk-active"><a href="add-event.jsp">Добавить событие</a></li>
        </ul>
    </div>
</nav>
<div class="uk-container uk-container-center uk-margin-top uk-margin-large-bottom">
    <div class="uk-container-center">
        <h1>Добавить событие</h1>
        <form class="uk-panel uk-panel-box uk-form">
            <fieldset>
                <div id="form-wrapper" class="uk-form-row">
                    <select name="type" id="event-dropdown" onChange="updateForm(this)">
                    </select>
                </div>
                <div class="uk-form-row">
                    <a class="uk-button uk-button-primary" onclick="sendData()"><i class="fa fa-floppy-o"></i> Сохранить событие</a>
                    <a class="uk-button uk-button-danger" href="index.jsp"><i class="fa fa-ban"></i> Отменить</a>
                </div>
            </fieldset>
        </form>
    </div>
</div>
<script src="js/add-event.js" language="Javascript" type="text/javascript"></script>
</body>
</html>
<div id="response-debug"></div>