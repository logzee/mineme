<%@ page import="java.util.Date" %>
<%@ page import="classes.DBManager" %>
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
<body class="uk-height-1-1">
<%-- Server time in case if the client's time is incorrect --%>
<div hidden id="server-timestamp"><%= new Date().getTime() %></div>
<%--  List of last 10 events from MongoDB in JSON format --%>
<div hidden id="last-events"><%= dbManager.getLastEventsJson(100, false) %></div>
<%-- Data from MongoDB describing events structure for the JavaScript --%>
<div hidden id="struct-data"><%= dbManager.getStruct() %></div>
<nav class="uk-navbar uk-margin-large-bottom uk-navbar-attached">
    <div class="uk-container uk-container-center">
        <a class="uk-navbar-brand" href="index.jsp">MineMe</a>
    </div>
</nav>
<div class="uk-container uk-container-center uk-margin-top uk-margin-large-bottom">
        <div class="uk-grid" data-uk-grid-match>
            <h1>События</h1>
            <div class="uk-panel uk-panel-box uk-width-1-1">
                <dl class="uk-list uk-list-line uk-description-list-line" id="event-log">
                </dl>
            </div>
        </div>
</div>
<script src="js/index.js" language="Javascript" type="text/javascript"></script>
</body>
</html>