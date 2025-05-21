import express from "express";
import { connectDB, collections } from "../config/db.js";
const router = express.Router();

let productCollection;

// Initialize Database Connection and Collections
async function mongoDBCollection() {
    try {
        await connectDB();
        productCollection = collections.products;
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

// Ensure the database is initialized before handling routes
mongoDBCollection();

router.get('/', async (req, res) => {
    if (!productCollection) {
        return res.status(503).send({ message: "Database not ready" });
    }

    const products = await productCollection.find().toArray();
    res.send(products);
});



export default router;