import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/test", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: req.body.message }]
        }
      ]
    })
  };

try {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    options
  );
  
  const data = await response.json();
  
  // Gemini returns data in a different structure
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  console.log(reply); // reply
  res.send(reply);     // send to frontend
} 
catch (err) {
  console.log(err);
  res.status(500).send("Error connecting to Gemini API");
}
});
app.listen(8000, () => console.log("✅ Server running on http://localhost:8000"));
