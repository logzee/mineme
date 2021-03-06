package classes;

import com.google.common.io.CharStreams;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.lang.reflect.Type;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * This servlet handles HTTP requests
 * In fact, this is a wrapper for {@link DBManager}
 */
@WebServlet(name = "RequestHandlier", urlPatterns={"/data"})
public class RequestHandlier extends HttpServlet {
    private DBManager dbManager;

    public RequestHandlier() {
        try {
            dbManager = new DBManager();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if (request.getRemoteUser() == null) response.sendError(403, "Not authorized");
        try {
            String requestedMethod = request.getParameter("method");
            if (requestedMethod != null && !requestedMethod.isEmpty()) {
                if (requestedMethod.equalsIgnoreCase("addEvent")) {
                    addEvent(request);
                } else if (requestedMethod.equalsIgnoreCase("removeEvent")) {
                    removeEvent(request, response);
                }
            } else {
                response.sendError(400, "Unknown method " + requestedMethod);
            }
        } catch (Exception e) {
            response.sendError(500, e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String requestedMethod = request.getParameter("method");
            if (requestedMethod != null && !requestedMethod.isEmpty()) {
                if (requestedMethod.equalsIgnoreCase("getEventsByType")) {
                    getEventByType(request, response);
                } else if (requestedMethod.equalsIgnoreCase("getEventTypesStruct")) {
                    getEventTypesStruct(response);
                }
            } else {
                response.sendError(400, "Unknown method");
            }
        } catch (Exception e) {
            response.sendError(500, e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    /**
     * Send structure of event types to the client
     *
     * @param response  link to servlet response
     */
    private void getEventTypesStruct(HttpServletResponse response) throws IOException {
        response.getOutputStream().write(dbManager.getStruct().getBytes("UTF-8"));
    }

    private void removeEvent(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (request.getRemoteUser() != null) {
            DBManager dbManager = new DBManager();
            String requestBody = CharStreams.toString(request.getReader());
            dbManager.removeEvent(requestBody);
        } else {
            response.sendError(403, "Log in to remove events");
        }
    }

    /**
     * Add new event to the database using {@link DBManager}
     *
     * @param request   Servlet request variable
     * @throws IOException
     */
    private void addEvent(HttpServletRequest request) throws IOException {
        String requestBody = CharStreams.toString(request.getReader());
        JsonParser parser = new JsonParser();
        JsonObject responseBodyJson = parser.parse(requestBody).getAsJsonObject();

        if (!responseBodyJson.has("date")) {
            String timeStamp = String.valueOf(new Date().getTime());
            responseBodyJson.add("date", new JsonPrimitive(timeStamp));
        }

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
        }
        Gson gson = new Gson();
        String result = gson.toJson(responseBodyJson);
        dbManager.insertFromString(result);
    }

    /**
     * Send response with events of requested type and time interval
     *
     * @param request   Client's request
     * @param response  Server's response
     * @throws IOException
     */
    private void getEventByType(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String type = request.getParameter("type");

        Integer[] typeChain;
        if (!type.contains(",")) {
            typeChain = new Integer[1];
            typeChain[0] = Integer.parseInt(request.getParameter("type"));
        } else {
            String[] typeChainStrings = type.split(",");
            typeChain = new Integer[typeChainStrings.length];
            for (int i = 0; i < typeChain.length; i++) {
                typeChain[i] = Integer.valueOf(typeChainStrings[i]);
            }
        }
        Long msAgo = Long.parseLong(request.getParameter("msAgo"));

        String jsonResponse = dbManager.getEventsOfAType(typeChain, msAgo);
        response.getOutputStream().write(jsonResponse.getBytes("UTF-8"));
    }
}
