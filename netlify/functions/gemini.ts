import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey!);
    
    // غيرنا الموديل لـ gemini-pro لأنه الأكثر استقراراً مع المكتبات المختلفة
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt = "";
    try {
      const body = JSON.parse(event.body || "{}");
      prompt = body.prompt || body.text || (typeof body === 'string' ? body : "");
    } catch (e) {
      prompt = event.body || "";
    }

    if (!prompt) return { statusCode: 400, headers, body: JSON.stringify({ error: "No prompt" }) };

    // طلب المحتوى
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text }),
    };
  } catch (error: any) {
    console.error("DETAILED ERROR:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};