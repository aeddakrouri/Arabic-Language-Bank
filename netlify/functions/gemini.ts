import { GoogleGenerativeAI } from "@google/generative-ai";

export const handler = async (event: any) => {
  // السماح بطلبات POST فقط
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { mode, text } = JSON.parse(event.body);
    
    // في Netlify Functions نستخدم process.env
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Gemini API key is not configured in Netlify" })
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "أنت خبير في اللغة العربية واللسانيات الأكاديمية."
    });

    let prompt = "";
    if (mode === "analyze") {
      prompt = `قم بإجراء تحليل لساني معمق للنص العربي التالي: "${text}"`;
    } else if (mode === "paraphrase") {
      prompt = `أعد صياغة النص التالي بأسلوب أكاديمي: "${text}"`;
    } else if (mode === "audit") {
      prompt = `قم بتقييم جودة الصياغة الأكاديمية للنص التالي: "${text}"`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: response.text() })
    };

  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI processing failed", details: error.message })
    };
  }
};