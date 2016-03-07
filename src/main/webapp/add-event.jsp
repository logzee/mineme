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
    <title>MineMe</title>
    <link rel="stylesheet" href="css/foundation.min.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/screen.css">
</head>
<body>
<!-- Data from MongoDB describing events structure for JavaScript -->
<div hidden id="struct-data"><%= dbManager.getStruct() %></div>
<div class="title-bar" data-responsive-toggle="realEstateMenu" data-hide-for="small">
    <div class="title-bar-title">MineMe</div>
</div>
<div class="top-bar" id="realEstateMenu">
    <div class="top-bar-right">
    </div>
</div>
<br>
<div class="row">
    <div class="large-6 columns large-centered">
        <h1>Добавить событие</h1>
        <div class="callout">
            <form action="ins-handle.jsp" id="event-form">
                <div class="row">
                    <div class="large-12 columns" id="event-selection">
                        <div id="form-wrapper">
                            <select name="type" id="event-dropdown" onChange="updateForm(this)">
                            </select>
                        </div>
                        <a type="submit" class="button event-btn" onclick="sendData()"><i class="fa fa-floppy-o"></i> Сохранить событие</a>
                        <a class="alert button event-btn" href="index.jsp"><i class="fa fa-ban"></i> Отменить</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="js/add-event.js" language="Javascript" type="text/javascript"></script>
</body>
</html>