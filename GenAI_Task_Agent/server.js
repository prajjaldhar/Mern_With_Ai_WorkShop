// server.js
import express from "express";
import { runAgent } from "./agent.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { query } = req.body;

  const response = await runAgent(query);

  res.json({ response });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
