const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello From Recipe book server !");
});

// user : recipe-book
// pass : 548fNkHoHsX4PxrZ

const uri =
  "mongodb+srv://recipe-book:548fNkHoHsX4PxrZ@cluster0.yd2mcnb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const recipeCollection = client.db("recipeDB").collection("recipes");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    app.get("/recipes", async (req, res) => {
      const cursor = recipeCollection.find();
      const recipes = await cursor.toArray();
      res.send(recipes);
    });
     app.get('/recipes/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await recipeCollection.findOne(query)
      res.send(result)

    })
    app.post("/recipes", async (req, res) => {
      const recipe = req.body;
      // console.log(recipe);

      const result = await recipeCollection.insertOne(recipe);
      res.send(result);
    });
    app.patch('/recipes/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const updatedRecipe = req.body;
      console.log(updatedRecipe);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          likeCount : updatedRecipe.likeCount + 1
        },
      };
      const result = await recipeCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
