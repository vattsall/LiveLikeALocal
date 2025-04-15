import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { PineconeStore } from "@langchain/pinecone";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import pinecone from "./pinecone.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI initialization
const model = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const run = async () => {
  // ✅ Connect to Pinecone index
  const pineconeIndex = pinecone.index("travelagent");

  
  const vectorStore = await PineconeStore.fromExistingIndex(
    new HuggingFaceInferenceEmbeddings({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      apiKey: process.env.HUGGINGFACE_API_KEY, // ✅ Use your token here
    }),
    {
      pineconeIndex,
      namespace: "default"
    }
  );
  
  // ✅ Main chat route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      console.log("📩 Received message:", message);

      const results = await vectorStore.similaritySearch(message, 3);
      console.log("📚 Pinecone matched docs:");
      results.forEach((doc, i) => {
        console.log(`\nResult ${i + 1}:\n${doc.pageContent.slice(0, 300)}...\n`);
      });

      const retrievedDocs = results.map((doc) => doc.pageContent).join("\n\n");

      const conversationHistory = [
        {
          role: "system",
          content: `You are a travel itinerary assistant. Based on the user's query and the information retrieved from a local database, create a personalized travel plan that highlights local places and experiences.`,
        },
        {
          role: "user",
          content: `Here is some context:\n\n${retrievedDocs}\n\nNow based on this, answer the query: ${message}`,
        },
      ];

      console.log("📤 Sending prompt to OpenAI:", conversationHistory);

      const response = await model.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
      });

      console.log("✅ OpenAI Response:", response.choices[0].message.content);

      res.json({ reply: response.choices[0].message.content });
    } catch (error) {
      console.error("❌ API error:", error?.response?.data || error.message || error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // ✅ Root route for sanity check
  app.get("/", (req, res) => {
    res.send("🌍 Travel Itinerary Server is running!");
  });

  // ✅ Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

run().catch((err) => console.error("❌ Failed to start server:", err));
