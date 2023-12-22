const express=require ('express')
const cors = require('cors');
require('dotenv').config();
const app=express()
const port= process.env.PORT || 5001;




// middleware
app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tgzt8q2.mongodb.net/?retryWrites=true&w=majority`;


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
    // await client.connect();

    const userCollection = client.db("TaskDB").collection("Users");
    const taskCollection = client.db("TaskDB").collection("Tasks");
    


    app.post('/users',async(req,res)=>{
        const user=req.body;
         
        const result =await userCollection.insertOne(user)
        res.send(result)
        // console.log(user);

    })


    app.get('/users/:email',async(req,res)=>{
        const  email=req.params.email;
      //    console.log(email);
         const query={email:email}
         const result= await userCollection.findOne(query)
         res.send(result)
   })




//tasks collection

app.post('/tasks',async(req,res)=>{
      const task=req.body;
    //   console.log(task);
    const result=await taskCollection.insertOne(task)
    res.send(result)
})


app.get('/tasks',async(req,res)=>{
      const result=await taskCollection.find().toArray()
      res.send(result)
})


app.patch('/tasks/:id',async(req,res)=>{
    const id=req.params.id;
    const filter={_id:new ObjectId(id)}
    const options = { upsert: true };
//  console.log(id);
    const updatedStatus=req.body;
    // console.log(updatedStatus);
    const updatedDoc={
       $set:{ 
            status:updatedStatus.status
       }
    }

    const result=await taskCollection.updateOne(filter,updatedDoc,options)
    res.send(result)
})

app.delete('/tasks/:id',async(req,res)=>{
       const id=req.params.id;
       const query={_id:new ObjectId(id)}
       const result=await taskCollection.deleteOne(query)
       res.send(result)

})


app.get('/tasks/:id',async(req,res)=>{
       const id= req.params.id;
       const result=await taskCollection.findOne({_id:new ObjectId(id)})
       res.send(result)
})



app.put('/tasks/:id',async(req,res)=>{
    const id=req.params.id;
    const filter={_id:new ObjectId(id)}
    const options = { upsert: true };
    // console.log(id);
    const updatedData=req.body;
    console.log(updatedData);
    const updatedDoc={
       $set:{ 
        Title:updatedData.Title,
        description:updatedData.description,
        date:updatedData.date,
        Priority:updatedData.Priority,

       }
    }

    const result=await taskCollection.updateOne(filter,updatedDoc,options)
    res.send(result)
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














app.get('/',(req,res)=>{
      res.send('Task  server is running.....>>>')
})

app.listen(port,()=>{
     console.log(`this site is going on port ${port}`);
})