<%@ page import="classes.DBManager" %>
<%@ page import="com.google.common.io.CharStreams" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.JsonObject" %>
<%@ page import="com.google.gson.JsonParser" %>
<%@ page import="com.google.gson.JsonPrimitive" %>
<%@ page import="java.util.Date" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%
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
        System.out.println(requestBody);
        /* Data example
                     {
                        "2016-03-06 20:40:00": {
                            "chain": [ 0, 0, 10
                            ],
                            "tags": [ "Спорт", "Физкультура", "Здоровье"
                            ]
                        }
                    }
                */
        Gson gson = new Gson();
        String timeStamp = String.valueOf(new Date().getTime());

        JsonParser parser = new JsonParser();
        JsonObject responseBodyJson = parser.parse(requestBody).getAsJsonObject();

        responseBodyJson.add("date", new JsonPrimitive(timeStamp));

        String result = gson.toJson(responseBodyJson);
        System.out.println(result);

        DBManager dbManager = new DBManager();
        dbManager.setCollection("events");
        dbManager.insertFromString(result);
    } catch (Exception e) {
        response.sendError(500, e.getClass().getSimpleName() + ": " + e.getMessage());
    }
%>