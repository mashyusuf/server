const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 9000


const app = express()

const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    optionSuccessStatus: 200,
  }
app.use(cors(corsOptions))
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ziugtg4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
    const BJETCollection = client.db('BJET').collection('Feature')
    const AssigCollection = client.db('BJET').collection('assingment')
    
     
    // Get all Features data from db
    app.get('/Feature', async (req, res) => {
        const result = await BJETCollection.find().toArray()
        res.send(result)
      })

      //-----------Cards Post-----------

      app.post('/assingments', async (req, res) => {
        const assingmentData= req.body;
        console.log(assingmentData);
        const result = await AssigCollection.insertOne(assingmentData);
        res.send(result.insertedId); // Send the inserted document's ID back to the client
    });

    //Get To Client -----------
    app.get('/assingments', async (req, res) => {
      const result = await AssigCollection.find().toArray()
      res.send(result)
    })

    //Get User Email To My List----------
   
    app.get('/assingments/:email', async (req, res) => {
      console.log(req.params.email);   
      try {
          const result = await AssigCollection.find({email: req.params.email}).toArray();           
          res.send(result);
      } catch (error) {
          console.error('Error fetching assignments:', error);
          res.status(500).send('Internal Server Error');
      }
  });


   
// delete a Assingment data from db
app.delete('/assingments/:id', async (req, res) => {
  const id = req.params.id
  const query = { _id: new ObjectId(id) }
  const result = await AssigCollection.deleteOne(query)
  res.send(result)
})
  
    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello BJET ....')
  })
  
  app.listen(port, () => console.log(`Server running on port ${port}`))