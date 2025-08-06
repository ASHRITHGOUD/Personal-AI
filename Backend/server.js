import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
const PORT = 8000;

// ✅ Middlewares
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",  // your React dev server URL
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));


// ✅ Test route
app.get("/", (req, res) => {
    res.send("✅ Server is running!");
});

// ✅ API routes
app.use("/api", chatRoutes);

// ✅ Connect Database and Start Server
const connectDB = async () => {
    console.log("⏳ Starting server...");

    try {
        if (!process.env.MONGODB_URI) {
            console.warn("⚠️ MONGODB_URI not found. Skipping database connection.");
        } else {
            console.log("🔗 Connecting to MongoDB...");
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("✅ Connected to MongoDB!");
        }

        // ✅ Start Express server
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
        console.log("⚠️ Starting server without database...");

        // ✅ Start server even if DB fails
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running without DB on http://localhost:${PORT}`);
        });
    }
};

// ✅ Catch unhandled errors (prevents silent exit)
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("❌ Unhandled Rejection:", err);
});

// Start
connectDB();
