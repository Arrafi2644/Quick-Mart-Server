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
    const result = await userCollection.insertOne(userInfo);
    res.send(result);
});


export default router;