import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const systemPrompt = `
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
  `;

  const userPrompt = `
    Please process the following email and provide the JSON output.

    **Knowledge Base for Context:**
    ---
    ${knowledgeBase}
    ---

    **Incoming Email:**
    - Sender: ${sender}
    - Subject: ${subject}
    - Body: ${body}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content);
    console.log("AI Analysis Complete:", result);
    return result;
  } catch (error) {
    console.error("Error processing email with AI:", error);
    return null;
  }
}
