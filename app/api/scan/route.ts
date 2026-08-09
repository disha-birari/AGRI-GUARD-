import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: "GEMINI_API_KEY is not configured in .env.local. Please create one at Google AI Studio.",
        isMock: true
      }, { status: 200 });
    }

    // Extract base64 details
    const mimeTypeMatch = image.match(/^data:(image\/[a-zA-Z0-9.-]+);base64,/);
    const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
    const base64Data = image.replace(/^data:image\/[a-zA-Z0-9.-]+;base64,/, "");

    const promptText = `
      Analyze this crop leaf photo carefully for Indian agricultural conditions.
      Identify the crop type, disease or pathogen status, AI confidence score, and severity level.
      Provide structured dual-track treatment recommendations:
      1. Organic Natural Remedies (e.g. Jeevamrutha, Neem oil emulsion, Trichoderma, wood ash, bio-fungicides).
      2. Chemical Pesticide & Fungicide Remedies with exact Indian agricultural dilution rates (e.g. Mancozeb 75% WP @ 2.5g/L, Metalaxyl, Chlorothalonil).
      
      Respond ONLY with a valid JSON object matching this structure:
      {
        "crop": "Tomato" | "Onion" | "Wheat" | "Chilli" | "Potato" | "Cotton" | "Soybean" | "Rice" | "Other",
        "disease": "disease name" or "Healthy",
        "confidence": number between 75 and 99,
        "severity": "High" | "Medium" | "Low" | "None",
        "desc": "Short, clear diagnosis description in 1-2 sentences",
        "timeWindow": "Action window (e.g. Act within 24-48 hours)",
        "organicTreatments": ["organic step 1", "organic step 2", "organic step 3"],
        "chemicalTreatments": ["chemical step 1 with dosage", "chemical step 2 with dosage", "chemical step 3"],
        "treatments": ["primary treatment 1", "primary treatment 2", "primary treatment 3"]
      }
      Do not return any markdown code wrapping (no \`\`\`json). Return only raw JSON.
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
                { text: promptText },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Gemini Vision API error response:", errorText);
      throw new Error(`Gemini Vision API error: ${errorText}`);
    }

    const resultJson = await response.json();
    const responseText = resultJson.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error("No analysis returned from Gemini");
    }

    const parsedData = JSON.parse(responseText.trim());
    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error("Scanning API error:", err);
    return NextResponse.json({ error: err.message || "Failed to process image", isMock: true }, { status: 200 });
  }
}

