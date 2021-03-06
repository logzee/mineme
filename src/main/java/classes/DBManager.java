package classes;

import com.google.gson.*;
import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import java.lang.reflect.Type;
import com.google.gson.reflect.TypeToken;
import org.bson.types.ObjectId;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * Wrapper for MongoDB
 *
 * @author logzee
 */
public class DBManager {
    private MongoCollection<Document> collection;
    private MongoDatabase db;

    /**
     * Initialize mongo client connection and database connection
     *
     * @throws UnknownHostException if failed to connect
     */
    public DBManager() throws UnknownHostException {
        MongoClient mongoClient = new MongoClient(new MongoClientURI(System.getenv("MONGODB_URL")));
        db = mongoClient.getDatabase("mineme");
    }

    /**
      * Get data that describes the structure of event types
      * @return structure of event types in JSON format
      */
    public String getStruct() {
        this.collection = db.getCollection("event-types");
        FindIterable<Document> myDoc = collection.find();
        return myDoc.iterator().next().toJson();
    }

    /**
      * Insert a new event to the database
      * @param json an event data to insert in JSON
      */
    public void insertFromString(String json) {
        this.collection = db.getCollection("events");
        collection.insertOne(Document.parse(json));
    }

    /**
     * Get last events from the database
     *
     * @param count how many events to get
     * @return last events in JSON format
     */
    public String getLastEventsJson(int count, boolean ignoreHidden) {
        this.collection = db.getCollection("events");
        JsonArray resultObject = new JsonArray();
        if (this.collection != null) {
            Document sortPattern = new Document("date", -1);
            FindIterable<Document> sortedEvents = collection.find().sort(sortPattern);

            Iterator<Document> sortedEventsIterator = sortedEvents.iterator();
            int i = 0;
            JsonParser parser = new JsonParser();
            while(sortedEventsIterator.hasNext() && i < count) {
                Document event = sortedEventsIterator.next();
                ArrayList<Object> chain = (ArrayList<Object>) event.get("chain");
                Integer eventType = Integer.parseInt((String) chain.toArray()[0]);
                if (eventType == 4 && ignoreHidden)
                    continue;
                resultObject.add(parser.parse(event.toJson()));
                i++;
            }
        }
        return resultObject.toString();
    }

    /**
     * Get all the tags
     *
     * @return list of all tags from the database
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
     * Add new tags to the database
     *
     * @param eventTags   tags to add
     */
    public void updateTags(List<String> eventTags) {
        List<String> dbTags = getTags();
        this.collection = db.getCollection("event-types");

        BasicDBList tagsList = new BasicDBList();
        tagsList.addAll(dbTags);
        tagsList.addAll(eventTags);

        BasicDBObject updateDocument = new BasicDBObject();
        updateDocument.append("$set", new BasicDBObject().append("tags", tagsList));

        BasicDBObject searchQuery = new BasicDBObject().append("_id", new ObjectId("56db4d4e9b78fde7268d7d40"));
        collection.updateOne(searchQuery, updateDocument);
    }

    /**
     * Remove event from
     *
     * @param eventId request body
     */
    public void removeEvent(String eventId) {
        this.collection = db.getCollection("events");
        collection.deleteOne(new BasicDBObject().append("_id", new ObjectId(eventId)));
    }

    /**
     * Get list of events of requested type
     *
     * @param chainFromClient event type or type and subtype
     * @param msAgo from what time
     * @return result in JSON
     */
    public String getEventsOfAType(Integer[] chainFromClient, Long msAgo) {
        this.collection = db.getCollection("events");
        JsonArray resultJson = new JsonArray();
        JsonParser parser = new JsonParser();

        Document sortPattern = new Document("date", -1);
        FindIterable<Document> eventsSortedByDate = collection.find().sort(sortPattern);
        Iterator<Document> eventsIterator = eventsSortedByDate.iterator();

        Long currentTimestamp = new Date().getTime();
        eventListIteration: while (eventsIterator.hasNext()) {
            Document event = eventsIterator.next();
            if (Long.parseLong(event.get("date").toString()) < currentTimestamp - msAgo) {
                break;
            }
            ArrayList<Object> chain = (ArrayList<Object>) event.get("chain");

            Object[] chainFromDb = chain.toArray();
            int minLength = chainFromDb.length < chainFromClient.length ? chainFromDb.length : chainFromClient.length;
            for (int i = 0; i < minLength; i++) {
                int eventTypeFromDb = Integer.parseInt(chainFromDb[i].toString());
                if (eventTypeFromDb != chainFromClient[i]) {
                    continue eventListIteration;
                }
            }
            resultJson.add(parser.parse(event.toJson()));
        }
        return resultJson.toString();
    }
}
