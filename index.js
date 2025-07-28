const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://apurba1234:apurba1234@cluster0.rqacs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();
        console.log("✅ Successfully connected to MongoDB");

        const studentCollection = client.db("studentDB").collection("student");


        app.post('/student', async (req, res) => {
            const student = req.body;
            const count = await studentCollection.countDocuments();
            student.roll = count + 1;
            console.log(student)
            const result = await studentCollection.insertOne(student);
            res.send(result)

        });
        app.get('/student', async(req, res) => {
            const result = await studentCollection.find().toArray();
            res.send(result);
        })
        app.get('/student/:id', async(req, res) => {
            const id= req.params.id;
            console.log(id)
            const query={_id: new ObjectId(id)}
            const result = await studentCollection.findOne(query)
            res.send(result)
        })



    } catch (error) {
        console.error("Error connecting to MongoDB❌:", error);
    }
}
run();


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
