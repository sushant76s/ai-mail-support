import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Knowledge Base (For RAG) ---
const knowledgeBase = `
1. Refund Policy: Customers can request a refund within 14 days of purchase. They need to provide their order ID.
2. Password Reset: Users can reset their password by visiting /password-reset. If they can't access their email, they must contact security@example.com.
3. Shipping Times: Standard shipping takes 5-7 business days. Express shipping is 1-2 business days.
4. Product 'X' common issue: If Product 'X' is not turning on, advise the user to charge it for at least 3 hours before first use.
`;
// ---------------------------------------------

export async function processEmailWithAI(email) {
  const { sender, subject, body } = email;
  const prompt = `
    You are an expert customer support agent assistant. Your task is to analyze an incoming email and provide a structured JSON output.
    You must adhere to the following rules:
    1.  Analyze the sentiment of the email (POSITIVE, NEGATIVE, NEUTRAL).
    2.  Determine the priority (URGENT, NOT_URGENT). Keywords like "immediately," "critical," "cannot access," "asap," or highly negative sentiment indicate urgency.
    3.  Extract key information: customer name, contact details (phone, alternate email), order numbers, or specific product names mentioned.
    4.  Based on the email content and the provided knowledge base, generate a context-aware, empathetic, and professional draft response.
    5.  Acknowledge the customer's feelings, especially if they are frustrated.
    6.  The final output MUST be a single, valid JSON object with no extra text or explanations.

    The JSON structure must be:
    {
      "sentiment": "...",
      "priority": "...",
      "extractedInfo": { "name": "...", "phone": "...", "orderId": "..." },
      "draftResponse": "..."
    }

    ---
    **Knowledge Base for Context:**
    ${knowledgeBase}
    ---

    **Incoming Email to Process:**
    - Sender: ${sender}
    - Subject: ${subject}
    - Body: ${body}
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const responseText = result.text;
    console.log("Response Text: ", responseText);
    const cleanResponseText = responseText.replace(/```json|```/g, "").trim();
    const aiResult = JSON.parse(cleanResponseText);

    console.log("Gemini AI Analysis Complete:", aiResult);
    return aiResult;
  } catch (error) {
    console.error("Error processing email with Gemini AI:", error);
    return null;
  }
}
