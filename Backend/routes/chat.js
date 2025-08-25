// Backend/routes/chat.js
import memoryManager from "../services/memory_manager.js";
import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAIResponse from "../utils/geminiai.js";

const router = express.Router();

// ✅ Send message and get AI reply
router.post("/chat", async (req, res) => {
    const { threadId, message, userId } = req.body;

    if (!threadId || !message || !userId) {
        return res.status(400).json({ error: "Missing required fields (threadId, message, userId)" });
    }

    try {
        // 🗂 Load STM and LTM
        const stmMessages = await memoryManager.getSTM(userId);
        const ltmDocs = await memoryManager.getLTM(userId);

        // 📝 Combine both into a single context string
        const context = memoryManager.composeContext(stmMessages, ltmDocs);

        // 💬 Get AI response using the combined context
        const assistantReply = await getGeminiAIResponse(`${context}\nUser: ${message}`);

        // 💾 Save in Thread model
        let thread = await Thread.findOne({ threadId });
        if (!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();
        await thread.save();

        // 🧠 Save to both STM & LTM
        await memoryManager.saveBoth(userId, message, assistantReply);

        res.json({ reply: assistantReply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

export default router;
