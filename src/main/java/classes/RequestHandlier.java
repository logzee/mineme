package classes;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * This servlet handles HTTP requests
 */
@WebServlet(name = "RequestHandlier", urlPatterns={"/data"})
public class RequestHandlier extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String requestedMethod = request.getParameter("method");
            if (requestedMethod != null && !requestedMethod.isEmpty()) {
                if (requestedMethod.equalsIgnoreCase("getEventsByType")) {
                    Integer[] typeChain = new Integer[1];
                    typeChain[0] = Integer.parseInt(request.getParameter("type"));
                    Long msAgo = Long.parseLong(request.getParameter("msAgo"));

                    DBManager dbManager = new DBManager();
                    response.getOutputStream().print(dbManager.getEventsOfAType(typeChain, msAgo));
                }
            } else {
                response.sendError(400, "Unknown method");
            }
        } catch (Exception e) {
            response.sendError(500, e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
