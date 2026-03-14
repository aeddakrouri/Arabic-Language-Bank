// api/gemini.ts
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
    
    // تأكد من قراءة الـ body بشكل صحيح
    const body = req.body;
    const prompt = body.prompt || body.text;

    if (!prompt) {
      return res.status(400).json({ error: "الرجاء إدخال نص" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

    return res.status(200).json({ text: aiText });

  } catch (error: any) {
    console.error("Vercel Function Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}