// hrAgent.js
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { employees } from "./empdata.js";

const hrLLM = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function runHRAgent(query, isEmpId = false, intent = "") {
  //  1. HANDLE EMPLOYEE-SPECIFIC DATA
  if (isEmpId) {
    const empId = query.trim();
    const emp = employees[empId];

    // Invalid Employee ID
    if (!emp) {
      return "Invalid Employee ID. Please check and try again.";
    }

    const netSalary = emp.basic + emp.hra + emp.bonus;

    // SALARY RESPONSE
    if (intent === "salary") {
      return `
Hi ${emp.name},

Your Employee ID (${empId}) has been successfully verified.

Salary Details:
- Basic Salary: ₹${emp.basic}
- HRA: ₹${emp.hra}
- Bonus: ₹${emp.bonus}
- Net Salary: ₹${netSalary}

Payslip is available in the employee portal.
`;
    }

    //  LEAVE RESPONSE
    if (intent === "leave") {
      return `
Hi ${emp.name},

Your Employee ID (${empId}) has been successfully verified.

Leave Details:
- Total Paid Leaves: 18
- Sick Leaves: 10
- Remaining Leaves: 12

You can apply for leave through the employee portal.
`;
    }

    // ATTENDANCE RESPONSE
    if (intent === "attendance") {
      return `
Hi ${emp.name},

Your Employee ID (${empId}) has been successfully verified.

Attendance Summary:
- Present Days: 22
- Absent Days: 2
- Late Marks: 1

Your attendance is within acceptable limits.
`;
    }

    // 🔹 FALLBACK
    return "Your request has been processed successfully.";
  }

  // 2. GENERAL HR QUERIES (LLM)
  const prompt = `
You are a professional HR assistant of Regex Software Services Pvt Ltd.

==============================
📌 COMPANY DETAILS
==============================
Departments:
- Engineering (Frontend, Backend, DevOps)
- Human Resources
- Sales & Marketing
- Finance
- Customer Support
- Talent Acquisition

Teams:
- Java Team
- Data Engineering Team
- AI/ML Team
- DevOps Team
- C Language Team
- MERN Team

==============================
📌 COMPANY POLICIES
==============================
- Working Hours: 9:00 AM – 6:00 PM (Mon–Fri)
- Weekly Off: Saturday & Sunday
- Late Mark: After 9:30 AM
- Leave Policy:
  - 18 Paid Leaves annually
  - 10 Sick Leaves
  - Max 10 days carry forward
- Work From Home: Requires manager approval
- Dress Code: Business Casual

==============================
📌 HOLIDAYS (2026)
==============================
- 26 Jan – Republic Day
- 15 Aug – Independence Day
- 2 Oct – Gandhi Jayanti
- 25 Dec – Christmas

==============================
📌 RULES
==============================
- Respond in a formal and professional tone
- No jokes or casual language
- Keep answers concise and factual
- If employee-specific data is required → ask for Employee ID

==============================
📌 QUERY
==============================
${query}
`;

  const res = await hrLLM.invoke(prompt);
  return res.content;
}
