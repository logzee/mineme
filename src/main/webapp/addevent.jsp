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
            <form action="ins-handle.jsp" id="event_form">
                <div class="row">
                    <div class="large-12 columns" id="event_selection">
                        <div id="form_wrapper">
                            <label>Тип события
                                <select name="type" id="event_dropdown" onChange="check(this);">
                                    <option value="none">Выбери тип события</option>
                                    <%
                                        Object[] titles = dbManager.getStructTitles();
                                        for (Object title : titles) {
                                            out.println("<option>" + title + "</option>");
                                        }
                                    %>
                                    <option value="new">Новый тип</option>
                                </select>
                                <p></p>
                            </label>
                        </div>
                        <a type="button" class="success button event-btn" onclick="addValueInput();"><i class="fa fa-plus"></i> Добавить значение</a>
                        <a type="button" class="warning button event-btn" onclick="removeValueInput();"><i class="fa fa-minus"></i> Удалить значение</a>
                        <div id="values_wrapper">
                            <label>Значение
                                <input name="val0" type="text" placeholder="Значение или подтип">
                            </label>
                        </div>
                        <a type="submit" class="button event-btn" onclick="document.getElementById('event_form').submit()"><i class="fa fa-floppy-o"></i> Сохранить событие</a>
                        <a class="alert button event-btn" href="index.jsp"><i class="fa fa-ban"></i> Отменить</a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="js/addevent.js" language="Javascript" type="text/javascript"></script>
</body>
</html>