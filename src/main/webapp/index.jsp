<%@ page import="classes.DBManager" %><%--
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
	<div class="uk-container uk-container-center uk-margin-top uk-margin-large-bottom">
		<nav class="uk-navbar uk-margin-large-bottom">
			<div class="uk-navbar-brand uk-hidden-small">MineMe</div>
			<ul class="uk-navbar-nav uk-hidden-small">
                    <li><a href="add-event.jsp">Добавить событие</a></li>
            </ul>
		</nav>
		<div class="uk-grid uk-grid-divider" data-uk-grid-match>
			<div class="uk-width-medium-1-2">
				<h1>Василий Пупкин</h1>
				<ul>
					<li>Настроение: хорошее</li>
					<li>Физическое состояние: среднее</li>
					<li>Последняя физическая активность: 20 минут назад</li>
					<li>Последний прием пищи: 5 минут назад</li>
				</ul>
			</div>
			<div class="uk-width-medium-1-2">
				<h1>Лог последних событий</h1>
					<p>Здесь будет список последних событий, например</p>
					<ul>
						<li>5 минут назад > Завтрак: позавтракал овсянкой с кофе</li>
					</ul>
			</div>
		</div>
		<hr>
		<p>Графики</p>
		<p>Здесь будут графики, например</p>
		<img src="img/plot-example.png" width="100%"/>
	</div>
</body>
</html>