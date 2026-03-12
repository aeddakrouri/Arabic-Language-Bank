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
    
    // سطر ذكي عشان نعرف العيب فين من غير ما نفضح المفتاح
    console.log("Checking API Key...", apiKey ? "Key exists (starts with " + apiKey.substring(0,4) + ")" : "KEY IS MISSING!");

    const body = JSON.parse(event.body || "{}");
    const { prompt } = body;

    if (!prompt) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "No prompt provided" }) };
    }

    const genAI = new GoogleGenerativeAI(apiKey!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("Calling Gemini API with prompt:", prompt.substring(0, 20) + "...");
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return { statusCode: 200, headers, body: JSON.stringify({ text }) };

  } catch (error: any) {
    // ده السطر اللي هيقولنا "الخلاصة" في الـ Log
    console.error("DETAILED ERROR:", error.message);
    return { 
      statusCode: 500, 
      headers, 
      body: JSON.stringify({ error: error.message, stack: error.stack }) 
    };
  }
};