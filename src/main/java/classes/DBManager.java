package classes;

import com.mongodb.*;

import java.net.UnknownHostException;
import java.util.Arrays;

/**
 * Created by logzee on 04.03.16.
 */
public class DBManager {
    private final String USERNAME = "admin";
    private final String DATABASE = "mineme";
    private final char[] PASSWORD = "9s__XpG8Yrvp".toCharArray();
    private MongoClient mongoClient;
    private DB db;
    private MongoCredential credential;
    private DBCollection coll;

    public DBManager() throws UnknownHostException {
        credential = MongoCredential.createCredential(USERNAME, DATABASE, PASSWORD);
        mongoClient = new MongoClient(new ServerAddress(), Arrays.asList(credential));
        db = mongoClient.getDB( "mineme" );
        coll = db.getCollection("testCollection");
    }
    public String findOne() {
        DBObject myDoc = coll.findOne();
        return myDoc.toString();
    }
}
