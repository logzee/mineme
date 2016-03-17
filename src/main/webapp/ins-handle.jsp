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
        System.out.println(requestBody);
        /* Data example
                    {
                        "chain" : [ "1", "4" ],
                        "tags" : ["устал", "радость"],
                        "date" : "1457545945177"
                    }
                */
        JsonParser parser = new JsonParser();
        JsonObject responseBodyJson = parser.parse(requestBody).getAsJsonObject();

        System.out.println("Date check");
        if (!responseBodyJson.has("date")) {
            System.out.println("No date");
            String timeStamp = String.valueOf(new Date().getTime());
            responseBodyJson.add("date", new JsonPrimitive(timeStamp));
        }

        DBManager dbManager = new DBManager();

        System.out.println("Tags check");
        if (responseBodyJson.has("tags")) {
            System.out.println("Has tags");
            JsonArray tags = responseBodyJson.getAsJsonArray("tags");
            Type listType = new TypeToken<List<String>>() {
            }.getType();
            List<String> eventTags = new Gson().fromJson(tags, listType);

            System.out.println("Getting dbTags");
            List<String> dbTags = dbManager.getTags();
            System.out.println("Got em: " + Arrays.toString(dbTags.toArray()));
            Iterator<String> eventTagsIterator = eventTags.iterator();

            while (eventTagsIterator.hasNext()) {
                String eventTag = eventTagsIterator.next();
                if (dbTags.contains(eventTag))
                    eventTagsIterator.remove();
            }
            System.out.println("Tags formed" + Arrays.toString(eventTags.toArray()));
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