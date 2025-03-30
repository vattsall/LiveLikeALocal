import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import pinecone from "./pinecone.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});

// Initialize Pinecone Store once
const pineconeIndex = pinecone.index("collab-chat");
const vectorStore = new PineconeStore(pineconeIndex, new OpenAIEmbeddings());

app.post("/api/chat", async (req, res) => {
  try {
    const { message, is_new_chat } = req.body;

    // Search Pinecone for relevant documents using the initialized vectorStore
    const results = await vectorStore.similaritySearch(message, 2);
    const retrievedDocs = results.map((doc) => doc.pageContent).join("\n\n");

    // Construct conversation history
    const conversationHistory = is_new_chat
      ? [...initial_questions, { role: "user", content: message }]
      : [{ role: "user", content: message }];

    // Append retrieved knowledge if available
    if (retrievedDocs) {
      conversationHistory.push({
        role: "system",
        content: `Relevant information retrieved from knowledge base:\n${retrievedDocs}`,
      });
    }

    // Call OpenAI API using the initialized model
    const response = await model.call(
      conversationHistory.map((m) => m.content).join("\n")
    );

    res.json({ reply: response });
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
