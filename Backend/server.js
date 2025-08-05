import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
  try {
    // ✅ Updated model name
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = "Joke related to Computer Science";

    const result = await model.generateContent(prompt);

    console.log("🤖 Gemini AI:", result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
})();
