import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, language = "English", location = "India", cropContext } = await req.json();

    if (!query || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback local intelligence if no key is configured
      return NextResponse.json({
        response: `Namaste! Based on your query regarding "${query}", we recommend monitoring crop leaves closely. Apply organic neem oil spray (5ml/L) or Mancozeb 2g/L if fungal lesions appear. Avoid spraying if rain is expected within 6 hours. (Offline Mode: Configure GEMINI_API_KEY for live AI responses).`,
        language,
        isOffline: true
      });
    }

    const systemPrompt = `
You are "Agri-Voice Advisor" — an expert agronomist and farming AI companion for Indian farmers.
Your goal is to provide concise, practical, highly accurate, and empathetic farming advice.

Farmer Context:
- Location: ${location}
- Preferred Language: ${language}
${cropContext ? `- Farmer Crop Context: ${cropContext}` : ""}

Rules:
1. Respond directly in ${language} (using native script e.g. Devanagari for Hindi/Marathi, Tamil script for Tamil, or Latin script for English).
2. Keep the answer concise (2-4 clear sentences) so it can be spoken out loud via text-to-speech without overwhelming the farmer.
3. Structure advice into: Diagnosis/Cause -> Recommended Action (mention specific Organic or Chemical remedy with dosage like 2g/L) -> Weather/Spray safety tip.
4. Only discuss agriculture, crops, horticulture, livestock, pest control, weather impact, fertilizers, and mandi prices. Politely decline non-farming questions.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\n\nFarmer Query: "${query}"\n\nAdvisor Response:` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn("Gemini Voice API returned error:", errText);
      throw new Error("AI Advisor service temporarily busy");
    }

    const json = await response.json();
    const replyText = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!replyText) {
      throw new Error("No response generated");
    }

    return NextResponse.json({
      response: replyText,
      language,
      isOffline: false
    });
  } catch (err: any) {
    console.error("Voice API error:", err);
    return NextResponse.json(
      { 
        response: "I understand your question. Please ensure regular watering, inspect leaves for spots, and avoid spraying pesticides before rainfall. Consult your nearest Krishi Vigyan Kendra for lab confirmation.",
        error: err.message,
        isOffline: true 
      }, 
      { status: 200 }
    );
  }
}
