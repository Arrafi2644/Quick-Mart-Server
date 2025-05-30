import express from 'express';
import { connectDB, collections } from "../config/db.js"; 
const router = express.Router();

let categoryCollection;

// Initialize Database Connection and Collections
async function mongoDBCollection() {
    try {
        await connectDB();
        categoryCollection = collections.categories;
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

// Ensure the database is initialized before handling routes
mongoDBCollection();

router.get('/', async(req, res) => {
    const result = await categoryCollection.find().toArray();
    res.send(result)
})

export default router;