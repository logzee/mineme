<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="classes.DBManager" %>
<%@ page import="org.apache.jasper.JasperException" %>
<%@ page import="javax.servlet.jsp.JspWriter" %>



<%
    DBManager dbManager = null;
    try {
        dbManager = new DBManager();
    } catch (Exception e) {
        out.println(e.getMessage());
    }

%>
<%= dbManager.findOne() %>