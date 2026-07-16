import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY environment variable is missing or placeholder. Running with mock AI.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API route: AI Mentor Interactive Chat
app.post("/api/mentor/chat", async (req, res) => {
  const { message, history, taskContext } = req.body;

  try {
    const ai = getGeminiClient();
    
    // System instruction to guide the AI to act as a supportive mentor on SkillWallet
    const systemInstruction = `You are the expert Technical Mentor for SkillWallet guiding a developer through their "SHOPEZ : E-commerce Application" project.
    
Your goal is to help them implement:
1. Frontend: React.js UI, responsive components, navigation, product view, shopping cart, checkouts, and order placement.
2. Backend: Express.js RESTful APIs, routing, middleware, authentication, and order logic.
3. Database Management: MongoDB (NoSQL) schemas, CRUD operations, database connection, and query optimization.

Current Task Context: ${taskContext || "General project architecture and setup."}

Provide highly practical, clear, encouraging, and structured guidance. When asked for code, output correct, modern TypeScript/JavaScript patterns. Be brief and professional. Keep response friendly and highly technical. Include scannable bullet points and helpful explanations. Ask diagnostic questions to keep the developer thinking.`;

    if (!ai) {
      // High-quality fallback answers when API Key is missing
      let fallbackText = "";
      const lowerMsg = (message || "").toLowerCase();
      
      if (lowerMsg.includes("react") || lowerMsg.includes("frontend")) {
        fallbackText = `### Hello from your ShopEZ React Mentor! 👋 (Key Mode: Preview/Offline)
Here is a fast boilerplate to kickstart your **ShopEZ Frontend Dev** state:

\`\`\`tsx
import React, { useState, useEffect } from 'react';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(p => (
        <div key={p.id} className="border p-4 rounded-xl shadow-sm bg-white">
          <h3 className="font-bold">{p.name}</h3>
          <p className="text-gray-500 text-sm">{p.description}</p>
          <span className="text-primary font-bold">\${p.price}</span>
        </div>
      ))}
    </div>
  );
}
\`\`\`

**Mentor Tips:**
- Use React context or clean local states for keeping track of the shopping cart items!
- Add motion fade-in transitions for list loads.`;
      } else if (lowerMsg.includes("express") || lowerMsg.includes("backend") || lowerMsg.includes("api")) {
        fallbackText = `### ShopEZ Backend Developer Tip! 🚀
To set up your Express API endpoints and match your Mongo schema, use this standard Express router:

\`\`\`typescript
import express from 'express';
const router = express.Router();

// GET all products with filtering
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST checkout
router.post('/checkout', async (req, res) => {
  const { cartItems, totalAmount } = req.body;
  // Create secure order object, save to MongoDB
  res.status(201).json({ success: true, orderId: "EZ-" + Math.floor(Math.random() * 900000) });
});

export default router;
\`\`\`

Ensure you test these routes via Postman to check headers and verify request structures. Let me know if you need help with JWT token validation middleware!`;
      } else if (lowerMsg.includes("mongo") || lowerMsg.includes("database")) {
        fallbackText = `### ShopEZ Database Schema Setup 🗄️
Using MongoDB allows a highly flexible, document-driven structure. Here is how you can define your **Product** and **Order** schemas:

\`\`\`typescript
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  stock: { type: Number, default: 10 }
});

const OrderSchema = new mongoose.Schema({
  userId: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: 'Pending' }
});
\`\`\``;
      } else {
        fallbackText = `### Welcome to your SkillWallet Mentor Chat! 🎓
I'm your AI Mentor for the **SHOPEZ: E-commerce Application**.

Currently, we are running in local/preview mode. You can ask me specific questions about:
1. **Frontend Dev** (React components, routing, states, Tailwind animations)
2. **Backend Dev** (Express server, routes, REST endpoints)
3. **Database Management** (MongoDB schemas, Mongoose connections, indexes)

*How would you like to begin your e-commerce journey? Feel free to ask about how to set up files, implement checkout, or structure models!*`;
      }

      return res.json({ text: fallbackText });
    }

    // Call actual Gemini API with @google/genai
    // Build Chat contents
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "I'm sorry, I couldn't generate a mentor response. Let's try restructuring your code question." });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to query Gemini API: " + error.message });
  }
});

// Vite middleware & Static asset mounting
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
