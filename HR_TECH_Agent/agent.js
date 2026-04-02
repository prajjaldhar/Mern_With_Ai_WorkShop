// agent.js
import "dotenv/config";
import { runHRAgent } from "./hrAgent.js";
import { runTechAgent } from "./techAgent.js";
import { runGeneralAgent } from "./generalAgent.js";
import { getSession, setSession, clearSession } from "./session.js";

export async function runAgent(query, userId = "defaultUser") {
  try {
    const lowerQuery = query.toLowerCase().trim();

    //  1. SESSION HANDLING (CRITICAL)
    const session = getSession(userId);

    if (session?.awaitingEmpId) {
      clearSession(userId);
      return await runHRAgent(query, true, session.intent);
    }

    //  2. GREETINGS → General Agent (AI generated)
    if (
      lowerQuery === "hi" ||
      lowerQuery === "hello" ||
      lowerQuery === "hey" ||
      lowerQuery.includes("good morning") ||
      lowerQuery.includes("good afternoon") ||
      lowerQuery.includes("good evening")
    ) {
      return await runGeneralAgent(query);
    }

    // 🔹 3. PERSONAL HR QUERIES (require empId)

    // Salary
    if (lowerQuery.includes("salary")) {
      setSession(userId, { awaitingEmpId: true, intent: "salary" });
      return "Please provide your Employee ID to proceed.";
    }

    // Personal Leave
    if (
      lowerQuery.includes("my leave") ||
      lowerQuery.includes("leave balance") ||
      lowerQuery.includes("how many leaves i have") ||
      lowerQuery.includes("how many leaves i can apply")
    ) {
      setSession(userId, { awaitingEmpId: true, intent: "leave" });
      return "Please provide your Employee ID to proceed.";
    }

    // Attendance
    if (lowerQuery.includes("attendance")) {
      setSession(userId, { awaitingEmpId: true, intent: "attendance" });
      return "Please provide your Employee ID to proceed.";
    }

    //  4. GENERAL HR QUERIES (NO empId needed)
    if (
      lowerQuery.includes("policy") ||
      lowerQuery.includes("holiday") ||
      lowerQuery.includes("leave policy")
    ) {
      return await runHRAgent(query);
    }

    //  5. TECH SUPPORT
    if (
      lowerQuery.includes("error") ||
      lowerQuery.includes("bug") ||
      lowerQuery.includes("code") ||
      lowerQuery.includes("api")
    ) {
      return await runTechAgent(query);
    }

    //  6. DEFAULT → General Agent
    return await runGeneralAgent(query);
  } catch (error) {
    console.error(error);
    return "Something went wrong";
  }
}
