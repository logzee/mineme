<%@ page import="classes.DBManager" %>
<%@ page import="com.google.common.io.CharStreams" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    /**
     * This JSP file handles delete requests
     */
    try {
        String requestBody = null;
        if ("POST".equalsIgnoreCase(request.getMethod())) {
            requestBody = CharStreams.toString(request.getReader());
        } else {
            response.sendError(405, "Method Not Allowed");
        }
        if (requestBody.isEmpty()) {
            response.sendError(400, "Bad Request");
        }

        DBManager dbManager = new DBManager();
        dbManager.removeEvent(requestBody);
    } catch (Exception e) {
        response.sendError(500, e.getClass().getSimpleName() + ": " + e.getMessage());
    }
%>
