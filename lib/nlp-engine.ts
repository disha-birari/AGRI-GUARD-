// Multilingual NLP (Natural Language Processing) Intent Classifier & Entity Extractor
// Designed for Indian Agricultural queries across Marathi, Hindi, and English (including Romanized Hinglish/Marathlish)

export type FarmerIntent = 
  | "DIAGNOSIS_AND_TREATMENT"
  | "WEATHER_AND_SPRAY_SAFETY"
  | "MARKET_PRICE_AND_MANDI"
  | "MACHINERY_RENTAL"
  | "DIRECT_FARM_SELLING"
  | "INSURANCE_CLAIM"
  | "IRRIGATION_AND_WATER"
  | "GENERAL_INQUIRY";

export interface NLPEntity {
  crops: string[];
  symptoms: string[];
  locations: string[];
  chemicals: string[];
  urgency: "high" | "medium" | "low";
}

export interface NLPAnalysisResult {
  intent: FarmerIntent;
  confidence: number;
  detectedLanguage: "Marathi" | "Hindi" | "English";
  entities: NLPEntity;
  cleanedTokens: string[];
  suggestedRoute?: string;
}

const INDIAN_STOPWORDS = new Set([
  "आहे", "काय", "करावे", "कसे", "कोणती", "द्यावे", "टाकावे", "का", "वर", "मध्ये", "व", "आणि", "या", "ती",
  "है", "क्या", "करें", "कैसे", "कौनसा", "की", "का", "के", "में", "पर", "और", "से",
  "what", "is", "how", "to", "for", "the", "in", "on", "and", "or", "a", "an", "should", "i", "do"
]);

const CROP_DICTIONARY: Record<string, string> = {
  "tomato": "Tomato", "टमाटर": "Tomato", "टोमॅटो": "Tomato", "tamatar": "Tomato", "tamato": "Tomato", "टोमॅटोवर": "Tomato",
  "onion": "Onion", "कांदा": "Onion", "कांद्या": "Onion", "कांद्यावर": "Onion", "प्याज": "Onion", "kanda": "Onion", "pyaj": "Onion", "kandyavar": "Onion",
  "wheat": "Wheat", "गहू": "Wheat", "गव्हा": "Wheat", "गव्हावर": "Wheat", "गेहूं": "Wheat", "gahu": "Wheat", "gehun": "Wheat",
  "chilli": "Chilli", "मिरची": "Chilli", "मिरचीवर": "Chilli", "मिर्च": "Chilli", "mirchi": "Chilli",
  "potato": "Potato", "बटाटा": "Potato", "बटाट्यावर": "Potato", "आलू": "Potato", "batata": "Potato", "aalu": "Potato",
  "cotton": "Cotton", "कापूस": "Cotton", "कापसावर": "Cotton", "कपास": "Cotton", "kapus": "Cotton", "kapaas": "Cotton",
  "soybean": "Soybean", "सोयाबीन": "Soybean", "soya": "Soybean"
};

const INTENT_KEYWORDS: Record<FarmerIntent, string[]> = {
  DIAGNOSIS_AND_TREATMENT: [
    "करपा", "रोग", "औषध", "फवारणी", "डाग", "पिवळी", "मावा", "तुडतुडे", "कीड", "अळी", "तांबेरा",
    "बीमारी", "दवा", "छिड़काव", "धब्बा", "पीली", "माहू", "इल्ली", "झुलसा", "कीटनाशक",
    "spray", "disease", "medicine", "fungicide", "pesticide", "blight", "spots", "yellow", "curl", "remedy"
  ],
  WEATHER_AND_SPRAY_SAFETY: [
    "पाऊस", "हवामान", "वारा", "ऊन", "ढग", "फवारणी वेळ",
    "बारिश", "मौसम", "हवा", "धूप", "बादल", "छिड़काव का समय",
    "rain", "weather", "forecast", "wind", "spray time", "cloudy", "temperature"
  ],
  MARKET_PRICE_AND_MANDI: [
    "भाव", "दर", "बाजार", "मार्केट", "मंडी", "किंमत", "विक्री",
    "दाम", "रेट", "बाजार भाव", "मंडी रेट", "बिक्री",
    "price", "rate", "mandi", "market", "apmc", "sell", "earning"
  ],
  MACHINERY_RENTAL: [
    "ट्रॅक्टर", "रोटाव्हेटर", "ड्रोन", "भाड्याने", "मशीन", "यंत्र",
    "ट्रैक्टर", "किराये", "ड्रोन स्प्रेयर", "मशीनरी",
    "tractor", "drone", "rent", "harvester", "rotavator", "machinery"
  ],
  DIRECT_FARM_SELLING: [
    "थेट विक्री", "ग्राहक", "सोसायटी", "किचन",
    "सीधी बिक्री", "ग्राहक", "किचन",
    "direct sell", "consumer", "society", "pre-order", "kitchen"
  ],
  INSURANCE_CLAIM: [
    "विमा", "नुकसान", "गारपीट", "भरपाई", "दावा", "पीएमएफबीवाय",
    "बीमा", "नुकसान", "ओलावृष्टि", "मुआवजा", "क्लेम",
    "insurance", "loss", "hailstorm", "flood", "pmfby", "compensation", "claim"
  ],
  IRRIGATION_AND_WATER: [
    "ठिबक", "पाणी", "सिंचन", "मोटार", "ड्रिप",
    "ड्रिप", "पानी", "सिंचाई",
    "drip", "irrigation", "water", "schedule", "liters"
  ],
  GENERAL_INQUIRY: ["शेती", "कृषी", "सल्ला", "krishi", "kisan", "help"]
};

export class NLPEngine {
  // Clean, normalize and tokenize Indian sentences (Unicode Devanagari & Latin)
  public tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .split(/\s+/)
      .filter(w => w.length > 1 && !INDIAN_STOPWORDS.has(w));
  }

  // Detect query language (Marathi / Hindi / English)
  public detectLanguage(text: string): "Marathi" | "Hindi" | "English" {
    // Check Devanagari Unicode Block (U+0900 to U+097F)
    const hasDevanagari = /[\u0900-\u097F]/.test(text);
    if (!hasDevanagari) return "English";

    // Marathi specific common morphological tokens
    const marathiMarkers = ["आहे", "करावे", "कोणती", "पडली", "झाली", "कांद्यावरील", "टोमॅटोची", "गव्हावरील", "फवारावे"];
    const isMarathi = marathiMarkers.some(m => text.includes(m));
    return isMarathi ? "Marathi" : "Hindi";
  }

  // Extract structured agricultural entities from sentence
  public extractEntities(text: string): NLPEntity {
    const lower = text.toLowerCase();
    const detectedCrops: string[] = [];
    const detectedSymptoms: string[] = [];
    const detectedLocations: string[] = [];
    const detectedChemicals: string[] = [];

    // Match crops
    Object.keys(CROP_DICTIONARY).forEach(key => {
      if (lower.includes(key) && !detectedCrops.includes(CROP_DICTIONARY[key])) {
        detectedCrops.push(CROP_DICTIONARY[key]);
      }
    });

    // Match symptoms
    const symptomList = ["blight", "yellow", "curl", "spots", "thrips", "rust", "rot", "करपा", "पिवळी", "चुरडा", "डाग", "मावा", "तांबेरा"];
    symptomList.forEach(s => {
      if (lower.includes(s)) detectedSymptoms.push(s);
    });

    // Detect urgency
    let urgency: "high" | "medium" | "low" = "medium";
    if (lower.includes("तातडीने") || lower.includes("लगेच") || lower.includes("urgent") || lower.includes("तुरंत") || lower.includes("emergency") || lower.includes("गंभीर")) {
      urgency = "high";
    }

    return {
      crops: detectedCrops.length > 0 ? detectedCrops : ["General"],
      symptoms: detectedSymptoms,
      locations: detectedLocations,
      chemicals: detectedChemicals,
      urgency
    };
  }

  // Classify farmer intent
  public classifyIntent(query: string): NLPAnalysisResult {
    const tokens = this.tokenize(query);
    const lang = this.detectLanguage(query);
    const entities = this.extractEntities(query);

    const intentScores: Record<FarmerIntent, number> = {
      DIAGNOSIS_AND_TREATMENT: 0,
      WEATHER_AND_SPRAY_SAFETY: 0,
      MARKET_PRICE_AND_MANDI: 0,
      MACHINERY_RENTAL: 0,
      DIRECT_FARM_SELLING: 0,
      INSURANCE_CLAIM: 0,
      IRRIGATION_AND_WATER: 0,
      GENERAL_INQUIRY: 0.1
    };

    // Calculate keyword density
    (Object.keys(INTENT_KEYWORDS) as FarmerIntent[]).forEach(intent => {
      const keywords = INTENT_KEYWORDS[intent];
      keywords.forEach(kw => {
        if (query.toLowerCase().includes(kw.toLowerCase())) {
          intentScores[intent] += 2.0;
        }
      });
      tokens.forEach(tok => {
        if (keywords.some(k => k.toLowerCase().includes(tok))) {
          intentScores[intent] += 1.0;
        }
      });
    });

    let topIntent: FarmerIntent = "GENERAL_INQUIRY";
    let maxScore = 0;

    (Object.keys(intentScores) as FarmerIntent[]).forEach(intent => {
      if (intentScores[intent] > maxScore) {
        maxScore = intentScores[intent];
        topIntent = intent;
      }
    });

    const routeMap: Partial<Record<FarmerIntent, string>> = {
      DIAGNOSIS_AND_TREATMENT: "/app/scanner",
      WEATHER_AND_SPRAY_SAFETY: "/app/weather",
      MARKET_PRICE_AND_MANDI: "/app/markets",
      MACHINERY_RENTAL: "/app/machinery",
      DIRECT_FARM_SELLING: "/app/direct",
      INSURANCE_CLAIM: "/app/insurance",
      IRRIGATION_AND_WATER: "/app/irrigation"
    };

    const confidence = Math.min(0.99, Number((0.6 + (maxScore * 0.08)).toFixed(2)));

    return {
      intent: topIntent,
      confidence,
      detectedLanguage: lang,
      entities,
      cleanedTokens: tokens,
      suggestedRoute: routeMap[topIntent]
    };
  }
}

export const nlpEngine = new NLPEngine();
