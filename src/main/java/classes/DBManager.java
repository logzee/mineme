package classes;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.UpdateResult;
import org.bson.Document;
import java.lang.reflect.Type;
import com.google.gson.reflect.TypeToken;
import java.net.UnknownHostException;
import java.util.Iterator;
import java.util.List;

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

    /**
         *  Gets all the tags from the database;
         * @return      list of all tags from the database
         */
    public List<String> getTags() {
        this.collection = db.getCollection("event-types");
        String struct = getStruct();
        JsonParser parser = new JsonParser();
        JsonObject responseBodyJson = parser.parse(struct).getAsJsonObject();
        JsonArray tags = responseBodyJson.getAsJsonArray("tags");
        Type listType = new TypeToken<List<String>>() {}.getType();
        return new Gson().fromJson(tags, listType);
    }

    /**
         *  TODO
         *  Saves info about my keylogs to the database
         * @param keylogs   info about last pressed keys is JSON
         */
    public void saveKeyLogs(String keylogs) {
        this.collection = db.getCollection("events");

    }

    /**
         *  Adds new tags to the database
         * @param eventTags   tags to add
         */
    public void updateTags(List<String> eventTags) {
        List<String> dbTags = getTags();
        this.collection = db.getCollection("event-types");

        printlog("Line 118");
        BasicDBList tagsList = new BasicDBList();
        tagsList.addAll(dbTags);
        tagsList.addAll(eventTags);
        printlog("Line 122");

        BasicDBObject updateDocument = new BasicDBObject();
        updateDocument.append("$set", new BasicDBObject().append("tags", tagsList));

        printlog("Line 126");
        BasicDBObject searchQuery = new BasicDBObject().append("_id", new BasicDBObject("$oid", "56db4d4e9b78fde7268d7d40"));
        printlog("Line 127");
        printlog(searchQuery);
        printlog(updateDocument);
        UpdateResult result = collection.updateOne(searchQuery, updateDocument);
        printlog("Line 128");
        printlog(result);
    }
    private void printlog(Object log) {
        System.out.println(">>>> DBManager.java >>>>");
        System.out.println(log);
    }
}
