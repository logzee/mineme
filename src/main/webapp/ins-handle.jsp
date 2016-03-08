<%@ page import="com.google.common.io.CharStreams" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Date" %>
<%@ page import="com.google.gson.JsonParser" %>
<%@ page import="com.google.gson.JsonObject" %>
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
        Map<String, Object> dataMap = new HashMap<String, Object>();
        String timeStamp = String.valueOf(new Date().getTime());

        JsonParser parser = new JsonParser();
        JsonObject o = parser.parse(requestBody).getAsJsonObject();

        dataMap.put(timeStamp, o);

        String result = gson.toJson(dataMap);

        System.out.println(result);
    } catch (Exception e) {
        response.sendError(500, e.getClass().getSimpleName() + ": " + e.getMessage());
    }
%>