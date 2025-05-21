import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = `mongodb+srv://rafi1232:${process.env.DB_PASS}@cluster0.guqvoqz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collections = {};

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("QuickMart");

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. MongoDB connected successfully!");

    collections = {
      users: db.collection("users")
    };

  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
}

export { connectDB, collections };
