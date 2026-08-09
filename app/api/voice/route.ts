import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let language = "Marathi";
  try {
    const body = await req.json();
    const query = body.query;
    language = body.language || "Marathi";
    const location = body.location || "Maharashtra, India";
    const cropContext = body.cropContext;

    if (!query || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Local fallback intelligence with native regional responses
      const regionalFallbacks: Record<string, string> = {
        Marathi: `नमस्कार शेतकरी मित्र! तुमच्या प्रश्नानुसार ("${query}"), पिकावर करपा किंवा बुरशीचा प्रादुर्भाव असल्यास मॅनकोझेब (Mancozeb 2 ग्रॅम/लिटर) किंवा ट्रायकोडर्मा (5 ग्रॅम/लिटर) फवारणी करावी. पाऊस येणार असल्यास फवारणी टाळावी.`,
        Hindi: `नमस्ते किसान भाई! आपके प्रश्न ("${query}") के अनुसार, यदि फसल पर धब्बे या झुलसा रोग है तो मैंकोजेब (2g/L) या नीम तेल (5ml/L) का छिड़काव करें। बारिश होने की संभावना हो तो छिड़काव न करें।`,
        English: `Namaste Farmer Friend! For your query regarding "${query}", if leaf spots or fungal blight appear, spray Mancozeb @ 2g/L or Neem oil @ 5ml/L. Avoid spraying if rain is expected in 6 hours.`
      };
      
      return NextResponse.json({
        response: regionalFallbacks[language] || regionalFallbacks.Marathi,
        language,
        isOffline: true
      });
    }

    const systemPrompt = `
You are "Agri-Voice Advisor" — a world-class Indian Agronomist AI serving farmers in their mother tongue across rural India.

CRITICAL MULTILINGUAL INSTRUCTIONS:
1. Primary Output Language: ${language}.
2. Supported Indian Languages:
   - Marathi (मराठी): Use pure, authentic Maharashtrian agricultural vocabulary (e.g. 'करपा' for Blight, 'मावा' for Aphids, 'तुडतुडे' for Jassids, 'तांबेरा' for Rust, 'भुरी' for Powdery Mildew, 'फवारणी' for Spraying, 'खत नियोजन' for Fertilizer, 'बाजारभाव' for Mandi rates).
   - Hindi (हिंदी): Use respectful, clear agricultural Hindi (e.g. 'झुलसा', 'कीट नियंत्रण', 'छिड़काव', 'मंडी भाव').
   - Tamil (தமிழ்), Telugu (తెలుగు), Kannada (ಕನ್ನಡ), Gujarati (ગુજરાતી), Bengali (বাংলা), Punjabi (ਪੰਜਾਬੀ), Malayalam (മലയാളം).
3. ROMANIZED SCRIPT UNDERSTANDING (Marathlish / Hinglish):
   - If the farmer types in Roman English letters like "Kandyavar karpa aala ahe konti fawarani karu" (Marathi in English letters) or "Tamatar me peele patte ho gaye kya dale" (Hindi in English letters), YOU MUST PERFECTLY UNDERSTAND THE INTENT.
   - Reply in the requested language (${language}) using clean native script (Devanagari for Marathi/Hindi, Tamil script for Tamil, etc.).
4. RESPONSE STRUCTURE:
   - Keep it concise (2 to 4 punchy, clear sentences) so it sounds natural and clear over speech audio.
   - Always specify exact dosage (e.g., "मॅनकोझेब २ ग्रॅम प्रति लिटर पाण्यात मिसळून फवारणी करा" / "Mancozeb 2g per liter").
   - Include a 6-hour rain spray safety warning.
5. STRICT SCOPE: Only answer questions related to farming, crop protection, soil health, fertilizers, weather impact, drip irrigation, livestock, and market prices.

Farmer Context:
- Location: ${location}
- Target Language: ${language}
${cropContext ? `- Active Crops: ${cropContext}` : ""}
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
                { text: `${systemPrompt}\n\nFarmer's Query: "${query}"\n\nAgronomist Response in ${language}:` }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.25,
            maxOutputTokens: 350,
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
        response: language === "Marathi" 
          ? "तुमचा प्रश्न समजला. पानांवर डाग असल्यास कडुलिंब तेल (५ मिली/लिटर) किंवा मॅनकोझेब (२ ग्रॅम/लिटर) फवारावे. पाऊस येण्यापूर्वी फवारणी करू नये."
          : "प्रश्न प्राप्त हुआ। पत्तियों पर धब्बे होने पर नीम तेल या मैंकोजेब 2g/L का छिड़काव करें। बारिश से पहले दवा न डालें।",
        error: err.message,
        isOffline: true 
      }, 
      { status: 200 }
    );
  }
}

