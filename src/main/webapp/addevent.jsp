<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="classes.DBManager" %>
<%@ page import="java.util.Map" %>


<%
    DBManager dbManager = new DBManager();
    Map map = request.getParameterMap();
%>
<%= dbManager.findOne()%><br>
<%= map.toString() %>