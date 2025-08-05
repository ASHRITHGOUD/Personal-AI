import express, { Router } from "express";
import Thread from "../models/Thread.js";
const router =express.Router();

//test
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "xyz",
      title: "testing new Thread"
    });

    await thread.save(); // ✅ Save it to MongoDB

    res.status(201).json({
      message: "Thread saved successfully",
      thread
    }); // ✅ Send a response back
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

export default router;