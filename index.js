const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();

//middleware here
app.use(express.json());
app.use(cors());

// replace username(${process.env.DB_USER}) and password(${process.env.DB_PASS}) here
const uri =
  "mongodb+srv://yash:12345@cluster2.tjy9olx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2";

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("data");
    const contactsCollection = db.collection("contacts");
    const usersCollection = db.collection("users");
    const plansCollection = db.collection("plans");

    // // Creating index for job sorting last job posted will show first
    // const indexKeys = { title: 1, category: 1 };
    // const indexOptions = { name: "titleCategory" };
    // const result = await jobsCollection.createIndex(indexKeys, indexOptions);
    // // console.log(result);

    // // post a job
    // app.post("/post-job", async (req, res) => {
    //   const body = req.body;
    //   body.createdAt = new Date();
    //   // console.log(body);
    //   const result = await jobsCollection.insertOne(body);
    //   if (result?.insertedId) {
    //     return res.status(200).send(result);
    //   } else {
    //     return res.status(404).send({
    //       message: "can not insert try again leter",
    //       status: false,
    //     });
    //   }
    // });

    app.post("/create-user", async (req, res) => {
      try {
        const userData = req.body;
        // Save userData to the database, you can use your MongoDB client to do this
        // For example:
        const result = await usersCollection.insertOne(userData);
        console.log(result);
        res.status(201).send({ message: "User created successfully" });
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });
    
    app.post("/create-plan", async (req, res) => {
      try {
        const planData = req.body;
        const result = await plansCollection.insertOne(planData);
        console.log(result)
        res.status(201).send({ message: "Plan created successfully" });
      } catch (error) {
        console.error("Error creating plan:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // get all jobs
    app.get("/all-contact", async (req, res) => {
      const jobs = await contactsCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(jobs);
    });
    app.get("/all-plans", async (req, res) => {
      const jobs = await plansCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(jobs);
    });

    app.get("/all-users", async (req, res) => {
      const jobs = await usersCollection
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      res.send(jobs);
    });

    // // get single job using id
    // app.get("/all-jobs/:id", async (req, res) => {
    //   // console.log(req.params.id);
    //   const jobs = await jobsCollection.findOne({
    //     _id: new ObjectId(req.params.id),
    //   });
    //   res.send(jobs);
    // });

    // // get jobs based on email for my job listing
    // app.get("/myJobs/:email", async (req, res) => {
    //   // console.log("email---", req.params.email);
    //   const jobs = await jobsCollection
    //     .find({
    //       postedBy: req.params.email,
    //     })
    //     .toArray();
    //   res.send(jobs);
    // });

    // // delete a job
    // app.delete("/job/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const result = await jobsCollection.deleteOne(filter);
    //   res.send(result);
    // });

    // // updata a job
    // app.patch("/update-job/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const jobData = req.body;
    //   // console.log(body);
    //   const filter = { _id: new ObjectId(id) };
    //   const updateDoc = {
    //     $set: {
    //       ...jobData,
    //     },
    //   };
    //   const options = { upsert: true };
    //   const result = await jobsCollection.updateOne(filter, updateDoc, options);
    //   res.send(result);
    // });


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


app.get("/", (req, res) => {
  res.send("Hello Duniya");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
