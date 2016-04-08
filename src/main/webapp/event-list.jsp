<%@ page import="java.util.Date" %>
<%@ page import="classes.DBManager" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    DBManager dbManager = new DBManager();
    boolean ignoreKeylogger = true;
    String showKeyloggerLink = "<a href=\"event-list.jsp?ignoreKeylogger=false\">Показать кейлоггер</a>";
    String requestBody = request.getParameter("ignoreKeylogger");
    if (requestBody != null) {
        ignoreKeylogger = false;
        showKeyloggerLink = "<a href=\"event-list.jsp\">Спрятать кейлоггер</a>";
    }
    String script;
    if (request.getRemoteUser() != null) {
        script = "<script src=\"js/event-list-admin.js\" language=\"Javascript\" type=\"text/javascript\"></script>";
    } else {
        script = "<script src=\"js/event-list.js\" language=\"Javascript\" type=\"text/javascript\"></script>";
    }
%>

<!DOCTYPE HTML>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MineMe</title>
    <link rel="stylesheet" href="css/uikit.min.css">
    <link rel="stylesheet" href="css/uikit.almost-flat.min.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/mineme.css">
    <link rel="icon" type="image/png" href="img/favicon.ico" />
    <script src="js/jquery.js"></script>
    <script src="js/uikit.min.js"></script>
</head>
<body class="uk-height-1-1">
<!-- I use these hidden tags to get data from the server because it much faster then XmlHttpRequest -->
<div hidden id="server-timestamp"><%= new Date().getTime() %></div>
<div hidden id="last-events"><%= dbManager.getLastEventsJson(100, ignoreKeylogger) %></div>
<div hidden id="struct-data"><%= dbManager.getStruct() %></div>

<nav class="uk-navbar uk-margin-large-bottom uk-navbar-attached">
    <div class="uk-container uk-container-center">
        <a class="uk-navbar-brand" href="index.jsp">MineMe</a>
    </div>
</nav>
<div class="uk-container uk-container-center uk-margin-top uk-margin-large-bottom">
    <div class="uk-grid" data-uk-grid-match>
        <h1 class="uk-margin-bottom">События</h1>
        <div class="uk-width-1-1" id="event-log">
            <ul class="uk-breadcrumb uk-margin-small-left">
                <li><%= showKeyloggerLink %></li>
            </ul>
        </div>
    </div>
</div>
<%= script %>
</body>
</html>