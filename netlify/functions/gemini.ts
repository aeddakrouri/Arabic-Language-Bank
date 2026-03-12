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
    
    // التحقق من وجود المفتاح في الـ Log عشان نقطع الشك باليقين
    if (!apiKey) throw new Error("API KEY IS MISSING IN NETLIFY SETTINGS");

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt || body.text || "مرحبا";

    // ده الرابط النهائي والأكثر استقراراً في العالم حالياً
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Google API Error");
    }

    const aiText = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text: aiText }),
    };

  } catch (error: any) {
    console.error("THE FINAL ERROR:", error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};