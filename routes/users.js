import express from "express";
import { collections, connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";
const router = express.Router();

let userCollection;
// Initialize Database Connection and Collections
async function mongoDBCollection() {
    try {
        await connectDB();
        userCollection = collections.users;
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

// Ensure the database is initialized before handling routes
mongoDBCollection();

router.get('/', async (req, res) => {
    if (!userCollection) {
        return res.status(503).send({ message: "Database not ready" });
    }

    const users = await userCollection.find().toArray();
    res.send({ message: "user got successfully", users });
});

router.post('/', async (req, res) => {
    if (!userCollection) {
        return res.status(503).send({ message: "Database not ready" });
    }
    const userInfo = req.body;
    const email = userInfo.email;
    const query = { email }
    const isExist = await userCollection.findOne(query)
    console.log(isExist);
    let result;
    if (isExist) {
        return result = { message: "user already exist" }
    } else {
        result = await userCollection.insertOne(userInfo);
    }
    res.send(result);
});


export default router;