import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
dotenv.config();


const app = express();
const PORT=8000;
app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
    
    // Start server ONLY after DB connects
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log("Failed to connect with Db", err);
    process.exit(1); // Kill server if DB connection fails
  }
};

connectDB(); // 🔁 Now called before listen

// app.post("/test", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "x-goog-api-key": process.env.GEMINI_API_KEY
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: req.body.message }]
//         }
//       ]
//     })
//   };

// try {
//   const response = await fetch(
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
//     options
//   );
  
//   const data = await response.json();
  
//   // Gemini returns data in a different structure
//   const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

//   console.log(reply); // reply
//   res.send(reply);     // send to frontend
// } 
// catch (err) {
//   console.log(err);
//   res.status(500).send("Error connecting to Gemini API");
// }
// });
