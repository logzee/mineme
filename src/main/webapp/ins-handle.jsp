<%@ page import="classes.DBManager" %>
<%@ page import="com.google.common.io.CharStreams" %>
<%@ page import="java.util.Date" %>
<%@ page import="com.google.gson.*" %>
<%@ page import="java.util.List" %>
<%@ page import="java.lang.reflect.Type" %>
<%@ page import="com.google.gson.reflect.TypeToken" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.Arrays" %>
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
        System.out.println(">>>>>>>>>>>>>> ins-handle.jsp >>>>>>>>>>>>>>");
        /* Data example
                    {
                        "chain" : [ "1", "4" ],
                        "tags" : ["устал", "радость"],
                        "date" : "1457545945177"
                    }
                */
        JsonParser parser = new JsonParser();
        JsonObject responseBodyJson = parser.parse(requestBody).getAsJsonObject();

        if (!responseBodyJson.has("date")) {
            String timeStamp = String.valueOf(new Date().getTime());
            responseBodyJson.add("date", new JsonPrimitive(timeStamp));
        }

        DBManager dbManager = new DBManager();

        if (responseBodyJson.has("tags")) {
            JsonArray tags = responseBodyJson.getAsJsonArray("tags");
            Type listType = new TypeToken<List<String>>() {
            }.getType();
            List<String> eventTags = new Gson().fromJson(tags, listType);

            List<String> dbTags = dbManager.getTags();
            Iterator<String> eventTagsIterator = eventTags.iterator();

            while (eventTagsIterator.hasNext()) {
                String eventTag = eventTagsIterator.next();
                if (dbTags.contains(eventTag))
                    eventTagsIterator.remove();
            }
            dbManager.updateTags(eventTags);
            System.out.println("Tags updated");
        }

        Gson gson = new Gson();
        String result = gson.toJson(responseBodyJson);
        System.out.println(result);
        dbManager.insertFromString(result);
    } catch (Exception e) {
        response.sendError(500, e.getClass().getSimpleName() + ": " + e.getMessage());
    }
%>