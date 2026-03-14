export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // قراءة الـ body
    const body = req.body;
    const prompt = body.prompt || body.text;

    if (!prompt) {
      return res.status(400).json({ error: "الرجاء إدخال نص" });
    }

    // الرابط المعدل للنسخة المستقرة
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // إرجاع رسالة الخطأ من جوجل مباشرة لو حصلت مشكلة
      throw new Error(data.error?.message || "Google API Error");
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("لم يتم الحصول على رد من الذكاء الاصطناعي");
    }

    return res.status(200).json({ text: aiText });

  } catch (error) {
    console.error("Vercel Function Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
