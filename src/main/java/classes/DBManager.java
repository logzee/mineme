package classes;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.net.UnknownHostException;
import java.util.Iterator;

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

    public void insertFromString(String json) {
        collection.insertOne(Document.parse(json));
    }

    public String getLastEventsJson(int count) {
        JsonArray resultObject = new JsonArray();
        if (this.collection != null) {
            Document sortPattern = new Document("date", -1);
            FindIterable<Document> sortedEvents = collection.find().sort(sortPattern);

            Iterator<Document> sortedEventsIterator = sortedEvents.iterator();
            int i = 0;
            while(sortedEventsIterator.hasNext() && i < count) {
                Document event = sortedEventsIterator.next();
                JsonParser parser = new JsonParser();
                resultObject.add(parser.parse(event.toJson()));
                i++;
            }
        }
        System.out.println("getLastEventsJson result: " + resultObject.toString());
        return resultObject.toString();
    }
}
