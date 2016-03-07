<%@ page import="com.google.common.io.CharStreams" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
    String requestBody = null;
    if ("POST".equalsIgnoreCase(request.getMethod())) {
        requestBody = CharStreams.toString(request.getReader());
    } else {
        response.sendError(405, "Method Not Allowed");
    }
    System.out.println(requestBody);
%>