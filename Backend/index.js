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
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
});


// Initialize Pinecone Store once
const pineconeIndex = pinecone.index("travelagent");
//const vectorStore = new PineconeStore(pineconeIndex, new OpenAIEmbeddings());

// Proper async way to create the vector store
const vectorStore = await PineconeStore.fromExistingIndex(
  new OpenAIEmbeddings(),
  {
    pineconeIndex: pineconeIndex
  }
);

// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message, is_new_chat } = req.body;

//     // Search Pinecone for relevant documents using the initialized vectorStore
//     const results = await vectorStore.similaritySearch(message, 2);
//     const retrievedDocs = results.map((doc) => doc.pageContent).join("\n\n");

//     // Construct conversation history
//     const conversationHistory = is_new_chat
//       ? [...initial_questions, { role: "user", content: message }]
//       : [{ role: "user", content: message }];

//     // Append retrieved knowledge if available
//     if (retrievedDocs) {
//       conversationHistory.push({
//         role: "system",
//         content: `Relevant information retrieved from knowledge base:\n${retrievedDocs}`,
//       });
//     }

//     // Call OpenAI API using the initialized model
//     const response = await model.call(
//       conversationHistory.map((m) => m.content).join("\n")
//     );

//     res.json({ reply: response });
//   } catch (error) {
//     console.error("API error:", error);
//     res.status(500).json({ error: "Failed to process request" });
//   }
// });
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("📩 Received message:", message);

    const results = await vectorStore.similaritySearch(message, 3);
    console.log("🔍 Pinecone results:", results);

    const retrievedDocs = results.map((doc) => doc.pageContent).join("\n\n");

    const conversationHistory = [
      {
        role: "system",
        content: `You are a travel itinerary assistant...`,
      },
      {
        role: "user",
        content: `Here is some context:\n\n${retrievedDocs}\n\nNow based on this, answer the query: ${message}`,
      }
    ];

    console.log("📤 Sending prompt to OpenAI:", conversationHistory);

    const response = await model.chat.completions.create({
      messages: conversationHistory,
      model: "gpt-3.5-turbo"
    });

    console.log("✅ OpenAI Response:", response.choices[0].message.content);

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("❌ API error:", error?.response?.data || error.message || error);
    
    res.status(500).json({ error: "Failed to process request" });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
