const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  const { context, question } = req.body;

  try {
    // Select the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Construct the prompt
    const prompt = `
      System: You are a friendly financial assistant for an app called 'SplitwisePro'.
      
      Here is the user's current financial data (Context):
      ${context}
      
      User's Question: "${question}"
      
      Instructions:
      1. Answer the user's question based ONLY on the financial context provided above.
      2. If the user asks "Who owes me?", list the specific names and amounts from the context.
      3. Keep your answer brief (under 3 sentences).
      4. If the answer isn't in the context, say "I don't see that information in your dashboard."
    `;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "My brain is offline right now. Try again later." });
  }
});

module.exports = router;