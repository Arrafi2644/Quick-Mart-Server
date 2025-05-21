import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/users.js";
import router from "./routes/users.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Base route
app.get("/", (req, res) => {
  res.send("Quick mart is running.");
});

// Mount the users router
app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`Quick mart is running on port ${port}`);
});
