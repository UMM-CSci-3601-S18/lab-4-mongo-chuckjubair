package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import umm3601.todo.TodoController;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the TodoController.
 *
 * Created by mcphee on 22/2/17.
 */
public class TodoControllerSpec
{
    private TodoController todoController;
    private ObjectId samsId;
    @Before
    public void clearAndPopulateDB() throws IOException {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase db = mongoClient.getDatabase("test");
        MongoCollection<Document> todoDocuments = db.getCollection("todos");
        todoDocuments.drop();
        List<Document> testTodos = new ArrayList<>();
        testTodos.add(Document.parse("{\n" +
                "                    _id: \"58af3a600343927e48e8720f\"\n" +
                "                    owner: \"Blanche\",\n" +
                "                    status: \"false\",\n" +
                "                    body: \"In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.\",\n" +
                "                    category: \"software design\"\n" +
                "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    _id: \"58af3a600343927e48e87210\"\n" +
            "                    owner: \"Fry\",\n" +
            "                    status: \"false\",\n" +
            "                    body: \"Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.\",\n" +
            "                    category: \"video games\"\n" +
            "                }"));
        testTodos.add(Document.parse("{\n" +
            "                    _id: \"58af3a600343927e48e87211\"\n" +
            "                    owner: \"Fry\",\n" +
            "                    status: \"true\",\n" +
            "                    body: \"Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.\",\n" +
            "                    category: \"homework\"\n" +
            "                }"));

        samsId = new ObjectId();
        BasicDBObject sam = new BasicDBObject("_id", samsId);
        sam = sam.append("owner", "Sam")
                .append("status", "true")
                .append("body", "Frogs, Inc.")
                .append("category", "homework");



        todoDocuments.insertMany(testTodos);
        todoDocuments.insertOne(Document.parse(sam.toJson()));

        // It might be important to construct this _after_ the DB is set up
        // in case there are bits in the constructor that care about the state
        // of the database.
        todoController = new TodoController(db);
    }

    // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
    private BsonArray parseJsonArray(String json) {
        final CodecRegistry codecRegistry
                = CodecRegistries.fromProviders(Arrays.asList(
                new ValueCodecProvider(),
                new BsonValueCodecProvider(),
                new DocumentCodecProvider()));

        JsonReader reader = new JsonReader(json);
        BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

        return arrayReader.decode(reader, DecoderContext.builder().build());
    }

    private static String getOwner(BsonValue val) {
        BsonDocument doc = val.asDocument();
        return ((BsonString) doc.get("owner")).getValue();
    }

    @Test
    public void getAllTodos() {
        Map<String, String[]> emptyMap = new HashMap<>();
        String jsonResult = todoController.getTodos(emptyMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> owners = docs
                .stream()
                .map(TodoControllerSpec::getOwner)
                .sorted()
                .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Blanche", "Fry", "Fry", "Sam");
        assertEquals("Names should match", expectedNames, owners);
    }

    @Test
    public void getTodosWithStatusTrue() {
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("status", new String[] { "true" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        assertEquals("Should be 2 todos", 2, docs.size());
        List<String> owners = docs
                .stream()
                .map(TodoControllerSpec::getOwner)
                .sorted()
                .collect(Collectors.toList());
        List<String> expectedNames = Arrays.asList("Fry", "Sam");
        assertEquals("Names should match", expectedNames, owners);
    }

    @Test
    public void getSamById() {
        String jsonResult = todoController.getTodo(samsId.toHexString());
        Document sam = Document.parse(jsonResult);
        assertEquals("Name should match", "Sam", sam.get("owner"));
        String noJsonResult = todoController.getTodo(new ObjectId().toString());
        assertNull("No owner should match",noJsonResult);

    }

   /* @Test
    public void addTodoTest(){
        String newId = todoController.addNewTodo("Brian","false","umm", "brian@yahoo.com", "58af3a600343927e48e87212");

        assertNotNull("Add new todo should return true when todo is added,", newId);
        Map<String, String[]> argMap = new HashMap<>();
        argMap.put("status", new String[] { "22" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);

        List<String> owner = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        assertEquals("Should return owner of new todo", "Brian", owner.get(0));
    }*/

    @Test
    public void getTodoByOwner(){
        Map<String, String[]> argMap = new HashMap<>();
        //Mongo in TodoController is doing a regex search so can just take a Java Reg. Expression
        //This will search the body starting with an I or an F
        argMap.put("body", new String[] { "[I,F]" });
        String jsonResult = todoController.getTodos(argMap);
        BsonArray docs = parseJsonArray(jsonResult);
        assertEquals("Should be 4 todos", 4, docs.size());
        List<String> owner = docs
            .stream()
            .map(TodoControllerSpec::getOwner)
            .sorted()
            .collect(Collectors.toList());
        List<String> expectedName = Arrays.asList("Blanche","Fry","Fry", "Sam");
        assertEquals("Names should match", expectedName, owner);

    }



}
