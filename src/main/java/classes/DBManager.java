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
 * Wrapper for MongoDB
 *
 * @author      logzee
 */
public class DBManager {
    private MongoCollection<Document> collection;
    private MongoDatabase db;

    /**
         * The only constructor initializes mongo client connection and then database connection
         * @throws UnknownHostException     if failed to connect to the database
         */
    public DBManager() throws UnknownHostException {
        MongoClient mongoClient = new MongoClient(new MongoClientURI(System.getenv("MONGODB_URL")));
        db = mongoClient.getDatabase("mineme");
    }

    /**
          * Gets data that's describes the structure of event types
          *
          * @return structure of event types in JSON format
          */
    public String getStruct() {
        this.collection = db.getCollection("event-types");
        FindIterable<Document> myDoc = collection.find();
        return myDoc.iterator().next().toJson();
    }

    /**
          * Inserts a new event to the database
          *
          * @param json     an event data to insert in JSON format
          */
    public void insertFromString(String json) {
        this.collection = db.getCollection("events");
        collection.insertOne(Document.parse(json));
    }

    /**
          * Gets last events from the database
          *
          * @param count    how many events to get
          * @return     last events in JSON format
          */
    public String getLastEventsJson(int count) {
        this.collection = db.getCollection("events");
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
        return resultObject.toString();
    }
}
