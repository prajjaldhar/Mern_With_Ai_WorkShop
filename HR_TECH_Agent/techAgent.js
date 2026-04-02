// techAgent.js
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const techLLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function runTechAgent(query) {
  const prompt = `
You are a technical support assistant.
Help employees with:
- Code issues
- System errors
- API problems
- Debugging

Query: ${query}
`;

  const res = await techLLM.invoke(prompt);
  return res.content;
}
