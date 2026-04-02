// tools.js
import { DynamicStructuredTool } from "@langchain/core/tools";

// Calculator Tool
export const calculator = new DynamicStructuredTool({
  name: "calculator",
  description: "Performs mathematical calculations",
  schema: {
    type: "object",
    properties: {
      expression: { type: "string" },
    },
    required: ["expression"],
  },
  func: async ({ expression }) => {
    try {
      return eval(expression).toString();
    } catch {
      return "Invalid expression";
    }
  },
});

// Word Counter Tool
export const wordCounter = new DynamicStructuredTool({
  name: "word_counter",
  description: "Counts number of words in a text",
  schema: {
    type: "object",
    properties: {
      text: { type: "string" },
    },
    required: ["text"],
  },
  func: async ({ text }) => {
    return text.split(/\s+/).length.toString();
  },
});
