import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Chat from "./chatModel.js";

dotenv.config();

const app = express();

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// ===== MongoDB Connection =====
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) =>
    console.log("❌ MongoDB Connection Error:", err.message)
  );

// ===== Bot Logic =====
const getBotReply = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello 👋 How can I help you today?";
  }

  if (msg.includes("time")) {
    return `Current time is ${new Date().toLocaleTimeString()}`;
  }

  if (msg.includes("date")) {
    return `Today's date is ${new Date().toLocaleDateString()}`;
  }

  if (msg.includes("your name")) {
    return "I am a Voice/Textual Chatbot 🤖";
  }

  if (msg.includes("bye")) {
    return "Goodbye 😊 Have a great day!";
  }

  return "Sorry, I didn't understand that. Please try again.";
};

// ===== Test Route =====
app.get("/test", (req, res) => {
  res.json({ message: "Backend working fine" });
});

// ===== Chat API =====
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message required" });
    }

    const reply = getBotReply(message);

    // Save to MongoDB
    await Chat.create({
      userMessage: message,
      botReply: reply,
    });

    res.json({ reply });
  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ reply: "Server error" });
  }
});

// ===== Server Start =====
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
