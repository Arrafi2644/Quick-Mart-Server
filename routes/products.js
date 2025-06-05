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

    // Extract query parameters
    const category = req.query.category || "";
    const brand = req.query.brand || "";
    const service = req.query.service || "";
    const warranty = req.query.warranty || "";
    const minPrice = Number(req.query.min) || 0;
    const maxPrice = Number(req.query.max) || 0;
    console.log("Service ", service);

    // Build MongoDB query without price filtering
    let query = {};
    if (category && category !== "undefined") {
        query.category = category;
    }
    if (brand && brand !== "undefined") {
        query.brand = brand;
    }
    if (service === "free-delivery") {
        query.is_delivery_free = true;
    }
    if (warranty && warranty !== "undefined") {
        query.warranty = warranty;
    }

    try {
        // Fetch products from DB based on filters except price
        const products = await productCollection.find(query).toArray();

        // Add discountedPrice property
        const enrichedProducts = products.map(p => ({
            ...p,
            discountedPrice: p.discount
                ? p.price - (p.price * p.discount / 100)
                : p.price
        }));

        // Filter products based on discountedPrice
        const filteredProducts = enrichedProducts.filter(p => {
            if (minPrice > 0 && maxPrice > 0) {
                return p.discountedPrice >= minPrice && p.discountedPrice <= maxPrice;
            } else if (minPrice > 0) {
                return p.discountedPrice >= minPrice;
            } else if (maxPrice > 0) {
                return p.discountedPrice <= maxPrice;
            }
            return true; // no min/max price filter
        });

        res.send(filteredProducts);

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ message: "Server error" });
    }
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