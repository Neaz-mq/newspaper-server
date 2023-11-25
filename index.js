const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0zyo6s3.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);


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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const publisherCollection = client.db('newsDB').collection('publishers');

    const userCollection = client.db('newsDB').collection('user');

    const articleCollection = client.db('newsDB').collection('article');


    app.get('/publishers', async (req, res) => {
      const cursor = publisherCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })



     // user related apis

     app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users)

    })
    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    })


    // article

    app.post('/article', async (req, res) => {
      const newArticle = req.body;
      console.log(newArticle);
      const result = await articleCollection.insertOne(newArticle);
      res.send(result);

    })

    app.get('/article', async (req, res) => {
      const cursor = articleCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Newspaper server is running')
})

app.listen(port, () => {
    console.log(`Newspaper Server is running on port: ${port}`)
})


