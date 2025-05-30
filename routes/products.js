import express from "express";
import { connectDB, collections } from "../config/db.js";
import { ObjectId } from "mongodb";
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


router.get('/:id', async (req, res) => {
    if (!productCollection) {
        return res.status(503).send({ message: "Database not ready" });
    }

    const id = req.params.id;
    console.log("Requested ID:", id);

    const query = { _id: id };

    try {
        const product = await productCollection.findOne(query);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.send(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send({ message: "Server error" });
    }
});





export default router;