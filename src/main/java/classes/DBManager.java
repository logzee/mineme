package classes;

import com.mongodb.*;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Project mineme
 * Author: logzee
 * Date: 04.03.16
 * Time: 11:30
 */
public class DBManager {
    private MongoCollection<Document> collection;
    private MongoDatabase db;

    public DBManager() throws UnknownHostException {
        MongoClient mongoClient = new MongoClient(new MongoClientURI(System.getenv("MONGODB_URL")));
        db = mongoClient.getDatabase("mineme");
    }

    public void setCollection(String collection) {
        this.collection = db.getCollection(collection);
    }

    public String getStruct() {
        FindIterable<Document> myDoc = collection.find();
        return myDoc.iterator().next().toJson();
    }

    public void insertOne(Document document) {

    }
    public Object[] getStructTitles() {
        if (this.collection != null) {
            final ArrayList<String> result = new ArrayList<String>();
            FindIterable<Document> myDoc = collection.find();
            myDoc.forEach(new Block<Document>() {
                @Override
                public void apply(final Document document) {
                    System.out.println(">>>>>>>>>>>>>DBManager.java>>>>>>>>>>>>>>>");
                    ArrayList<Document> struct = (ArrayList<Document>) document.get("struct");

                    for (Document eventType : struct) {
                        if(eventType.containsKey("hidden")) continue;
                        result.add(eventType.get("title").toString());
                    }
                }
            });
            return result.toArray();
        }
        return new String[0];
    }
    public List<String> getLastEvents(int count) {
        List<String> eventList = new ArrayList<String>(count);
        if (this.collection != null) {
            FindIterable<Document> myDoc = collection.find();
        }
        return eventList;
    }
}
