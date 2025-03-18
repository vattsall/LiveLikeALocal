import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API key from environment variable
});

// Predefined questions to ask at the start of every new chat
const initial_questions = [
  {
    role: "system",
    content: "Please tell me the city or location of your travel.",
  },
  { role: "system", content: "How long will you be staying there?" },
  {
    role: "system",
    content:
      "Are there any particular activities you are interested in? (e.g., food, sightseeing, adventure sports, museums, etc.)",
  },
];

app.post("/api/chat", async (req, res) => {
  try {
    const { message, is_new_chat } = req.body;

    // Include initial questions only if it's a new chat
    const conversationHistory = is_new_chat
      ? [...initial_questions, { role: "user", content: message }]
      : [{ role: "user", content: message }];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversationHistory,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
