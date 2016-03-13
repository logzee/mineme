package servlets;

import classes.DBManager;
import com.google.common.io.CharStreams;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonPrimitive;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

/**
 * Handles insert requests
 *
 * @author      logzee
 */
public class InsertHandler extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String requestBody = null;
            requestBody = CharStreams.toString(request.getReader());
            if (requestBody.isEmpty()) {
                response.sendError(400, "Bad Request");
            }
            /* Data example
                             {
                                "2016-03-06 20:40:00": {
                                    "chain": [ 0, 0, 10 ],
                                    "tags": [ "Спорт", "Физкультура", "Здоровье" ]
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
            dbManager.insertFromString(result);
        } catch (Exception e) {
            response.sendError(500, e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendError(405, "Method Not Allowed");
    }
}
