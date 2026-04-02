import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY missing");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post("/generate", async (req, res) => {
  try {
    const userInput = req.body.prompt;

    if (!userInput) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const fancyPrompt = `
You are an assistant for college students.

Create a clean, professional, well-structured output.

User input:
${userInput}

Rules:
- Use headings
- Use bullet points
- Use limited emojis
- Keep language simple and clear
`;

    const result = await model.generateContent(fancyPrompt);
    const text = result.response.text();

    res.json({ result: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
