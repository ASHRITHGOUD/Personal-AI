import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const getGeminiAIResponse = async (message) => {
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
          parts: [{ text: message }]
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

    // Extract AI reply text
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Error connecting to Gemini API";
  }
};

export default getGeminiAIResponse;
