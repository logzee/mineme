<%@ page import="java.util.Date" %>
<%@ page import="classes.DBManager" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    DBManager dbManager = new DBManager();
    boolean ignoreKeylogger = false;

    String requestBody = request.getParameter("ignore-keylogger");
    if (requestBody != null && !requestBody.isEmpty()) {
        ignoreKeylogger = true;
    }
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
<body class="uk-height-1-1">
<%-- Server time in case if the client's time is incorrect --%>
<div hidden id="server-timestamp"><%= new Date().getTime() %></div>
<%--  List of last 10 events from MongoDB in JSON format --%>
<div hidden id="last-events"><%= dbManager.getLastEventsJson(100, ignoreKeylogger) %></div>
<%-- Data from MongoDB describing events structure for the JavaScript --%>
<div hidden id="struct-data"><%= dbManager.getStruct() %></div>
<nav class="uk-navbar uk-margin-large-bottom uk-navbar-attached">
    <div class="uk-container uk-container-center">
        <a class="uk-navbar-brand" href="index.jsp">MineMe</a>
    </div>
</nav>
<div class="uk-container uk-container-center uk-margin-top uk-margin-large-bottom">
    <div class="uk-grid" data-uk-grid-match>
        <a href="event-list.jsp?ignore-keylogger=true" class="uk-float-right">Спрятать кейлоггер</a>
        <h1 class="uk-margin-bottom">События</h1>
        <div class="uk-width-1-1" id="event-log">
            <ul class="uk-breadcrumb uk-margin-small-left">
                <li><a href="event-list.jsp?ignore-keylogger=true">Спрятать кейлоггер</a></li>
            </ul>
        </div>
    </div>
</div>
<script src="js/event-list.js" language="Javascript" type="text/javascript"></script>
</body>
</html>