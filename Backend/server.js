import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import memoryManager from "./services/memory_manager.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000; 

// ✅ Middlewares
app.use(express.json());
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// ✅ Test route
app.get("/", (req, res) => {
    res.send("✅ Server is running!");
});

// ✅ API routes
app.use("/api", chatRoutes);

// ✅ Start server and connect DBs
const startServer = async () => {
    console.log("⏳ Starting server...");

    try {
        // 🔹 Initialize Redis + MongoDB (via memory_manager)
        await memoryManager.init();

        // ✅ Start Express server
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("❌ Initialization failed:", err.message);
        console.log("⚠️ Starting server without DB...");

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
startServer();
