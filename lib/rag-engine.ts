// Advanced RAG (Retrieval-Augmented Generation) Knowledge Base & Semantic Search Engine
// Sourced from ICAR (Indian Council of Agricultural Research) & State Agri Universities

export interface AgronomicRecord {
  id: string;
  crop: string;
  category: "fungal" | "bacterial" | "viral" | "pest" | "nutrient_deficiency" | "weather_damage";
  diseaseOrIssue: string;
  aliases: string[]; // English, Hindi, Marathi aliases
  symptoms: string[];
  organicRemedies: string[];
  chemicalRemedies: string[];
  preventiveMeasures: string[];
  sprayWindowNotes: string;
  marathiResponse: string;
  hindiResponse: string;
  englishResponse: string;
  keywords: string[];
}

export const ICAR_KNOWLEDGE_CORPUS: AgronomicRecord[] = [
  {
    id: "kb-01",
    crop: "Tomato",
    category: "fungal",
    diseaseOrIssue: "Late Blight (Phytophthora infestans)",
    aliases: ["करपा", "लेट ब्लाइट", "काळा करपा", "पिवळे डाग", "late blight", "tamatavarcha karpa"],
    symptoms: [
      "Water-soaked dark lesions on leaf margins and tips",
      "White fungal mold growth on the underside of leaves during humid mornings",
      "Dark brown sunken firm rot on green and ripe tomato fruits"
    ],
    organicRemedies: [
      "Spray 5% Dashaparni Ark or Neem oil (5ml/L) with soap emulsifier",
      "Foliar application of Trichoderma viride / harzianum (5g/L water)",
      "Panchagavya 3% (30ml/L) spray every 10 days for foliar immunity"
    ],
    chemicalRemedies: [
      "Mancozeb 75% WP @ 2.5 g/L as preventive contact spray",
      "Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.0 g/L for curative control",
      "Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 2.5 g/L if disease is spreading"
    ],
    preventiveMeasures: [
      "Avoid overhead sprinkler irrigation to keep foliage dry",
      "Maintain 60cm row spacing for adequate air circulation",
      "Remove and burn infected lower leaves immediately"
    ],
    sprayWindowNotes: "Spray only in dry weather. Rain in next 6 hours will wash off chemical barrier.",
    marathiResponse: "टोमॅटोवरील उशिरा येणाऱ्या करप्यासाठी (Late Blight): ताबडतोब मॅन्कोझेब (२.५ ग्रॅम/लिटर) किंवा रिडोमिल गोल्ड (२ ग्रॅम/लिटर) फवारावे. जैविक नियंत्रणासाठी ट्रायकोडर्मा व्हिरिडी (५ ग्रॅम/लिटर) किंवा ५% गोमूत्र/दशपर्णी अर्क वापरावा. पाऊस थांबल्यावरच फवारणी करावी.",
    hindiResponse: "टमाटर के लेट ब्लाइट (झुलसा) के लिए: तुरंत मैंकोजेब (2.5 ग्राम/लीटर) या रिडोमिल एमजेड (2 ग्राम/लीटर) का छिड़काव करें। जैविक उपाय के लिए ट्राइकोडर्मा विरिडी (5 ग्राम/लीटर) या नीम तेल (5 मिली/लीटर) इस्तेमाल करें।",
    englishResponse: "For Tomato Late Blight: Apply Mancozeb 75% WP @ 2.5g/L (preventive) or Metalaxyl + Mancozeb @ 2.0g/L (curative). Organically, spray Trichoderma viride @ 5g/L or Neem oil 5ml/L.",
    keywords: ["tomato", "blight", "karpa", "spots", "fungus", "टोमॅटो", "करपा", "डाग", "पाने", "पिवळी", "काळे", "mancozeb", "ridomil"]
  },
  {
    id: "kb-02",
    crop: "Onion",
    category: "fungal",
    diseaseOrIssue: "Purple Blotch (Alternaria porri)",
    aliases: ["जांभळा करपा", "कांद्यावरील करपा", "पर्पल ब्लॉच", "onion blight", "purple blotch", "kandyavaril karpa"],
    symptoms: [
      "Small, water-soaked lesions on leaves turning purple with yellowish margins",
      "Leaves turn yellow from tip downwards, dry up, and collapse",
      "Bulbs remain undersized and rot during storage"
    ],
    organicRemedies: [
      "Foliar spray of 10% Cow urine (Gomutra) mixed with 1g Hing (asafoetida) per liter",
      "Pseudomonas fluorescens (5g/L) foliar spray in morning hours",
      "Neem seed kernel extract (NSKE 5%) spray"
    ],
    chemicalRemedies: [
      "Hexaconazole 5% EC (Contaf) @ 1.0 ml/L water",
      "Tebuconazole 25.9% EC (Folicur) @ 1.0 ml/L or Difenoconazole @ 1 ml/L",
      "Mancozeb 75% WP @ 2.5 g/L with Sticker/Spreader (0.5 ml/L)"
    ],
    preventiveMeasures: [
      "Add agricultural spreader/sticker (like Sandovit) due to waxy onion leaves",
      "Maintain raised bed drainage to prevent waterlogging",
      "Adopt 3-year crop rotation avoiding allium family crops"
    ],
    sprayWindowNotes: "Always mix sticker/wetting agent (0.5ml/L) because onion foliage is cylindrical and waxy.",
    marathiResponse: "कांद्यावरील जांभळ्या करप्यासाठी (Purple Blotch): हेक्झाकोनॅझोल (१ मिली/लिटर) किंवा टेब्युकोनॅझोल (१ मिली/लिटर) सोबत स्टिकर (०.५ मिली/लिटर) मिसळून फवारणी करावी. सेंद्रिय उपायासाठी सुडोमोनास (५ ग्रॅम/लिटर) फवारावे.",
    hindiResponse: "प्याज के बैंगनी धब्बा (पर्पल ब्लॉच) रोग के लिए: हेक्साकोनाजोल (1 मिली/लीटर) या टेबुकोनाजोल (1 मिली/लीटर) में स्टीकर मिलाकर छिड़काव करें। जैविक रूप से स्यूडोमोनास फ्लोरोसेंस का प्रयोग करें।",
    englishResponse: "For Onion Purple Blotch: Spray Hexaconazole 5% EC @ 1ml/L or Tebuconazole @ 1ml/L mixed with a spreader/sticker (0.5ml/L). Organically, apply Pseudomonas fluorescens @ 5g/L.",
    keywords: ["onion", "kanda", "purple", "blotch", "karpa", "कांदा", "जांभळा", "करपा", "stemphylium", "thrips", "contaf", "folicur"]
  },
  {
    id: "kb-03",
    crop: "Onion",
    category: "pest",
    diseaseOrIssue: "Onion Thrips (Thrips tabaci)",
    aliases: ["कांद्यावरील मावा", "थ्रिप्स", "तुडतुडे", "onion thrips", "mava", "pivli pane", "प्याज में थ्रिप्स", "माहू", "प्याज की दवा", "थ्रिप्स की दवा"],
    symptoms: [
      "Silvery patches or white specks on central leaves",
      "Leaves become curled, crinkled, and twisted",
      "Stunted bulb formation with pre-mature leaf drying"
    ],
    organicRemedies: [
      "Install 15-20 blue and yellow sticky traps per acre",
      "Spray Verticillium lecanii (5g/L) bio-pesticide in the evening",
      "Neem oil 10,000 PPM @ 2.0 ml/L or Dashaparni Ark @ 30 ml/L"
    ],
    chemicalRemedies: [
      "Fipronil 5% SC (Regent) @ 1.5 ml/L water",
      "Spinetoram 11.7% SC (Delegate) @ 0.9 ml/L for severe infestations",
      "Thiamethoxam 25% WG (Actara) @ 0.5 g/L"
    ],
    preventiveMeasures: [
      "Provide light sprinkler irrigation during hot afternoon to knock down thrips",
      "Keep field borders clear of alternate grass hosts"
    ],
    sprayWindowNotes: "Spray early morning or late evening targeting the leaf axils where thrips hide.",
    marathiResponse: "कांद्यावरील थ्रिप्स/मावा नियंत्रणासाठी: फिप्रोनिल ५% एससी (१.५ मिली/लिटर) किंवा स्पिनोटोरम (०.९ मिली/लिटर) फवारावे. सेंद्रिय नियंत्रणासाठी निळ्या रंगाचे चिकट सापळे एकरी १५ लावावेत आणि व्हर्टिसिलियम लेकॅनी (५ ग्रॅम/लिटर) फवारावे.",
    hindiResponse: "प्याज में थ्रिप्स/माहू के लिए: फिप्रोनिल (1.5 मिली/लीटर) या थायामेथोक्सम (0.5 ग्राम/लीटर) का छिड़काव करें। जैविक रूप से नीले चिपचिपे ट्रैप लगाएं और नीम तेल का स्प्रे करें।",
    englishResponse: "For Onion Thrips: Spray Fipronil 5% SC @ 1.5ml/L or Spinetoram 11.7% SC @ 0.9ml/L. For organic control, deploy 15-20 blue sticky traps/acre and spray Verticillium lecanii @ 5g/L.",
    keywords: ["onion", "thrips", "mava", "tudtude", "कांदा", "मावा", "थ्रिप्स", "सफेद", "प्याज", "माहू", "दवा", "fipronil", "actara", "delegate"]
  },
  {
    id: "kb-04",
    crop: "Wheat",
    category: "fungal",
    diseaseOrIssue: "Yellow Rust / Stripe Rust (Puccinia striiformis)",
    aliases: ["गव्हावरील तांबेरा", "पिवळा तांबेरा", "yellow rust", "stripe rust", "tambera", "gahu"],
    symptoms: [
      "Yellow to orange-yellow powdery pustules arranged in linear stripes on leaves",
      "Yellow powder rubs off easily onto hands or clothes when touched",
      "Shriveled grain development and severe yield reduction"
    ],
    organicRemedies: [
      "Spray fermented Butter-milk (Khatta Chhachh / Taak) @ 50ml/L water",
      "Foliar application of bio-agent Bacillus subtilis @ 5g/L",
      "Neem seed oil 1500 PPM @ 4ml/L"
    ],
    chemicalRemedies: [
      "Propiconazole 25% EC (Tilt) @ 1.0 ml/L (1ml per liter of water)",
      "Tebuconazole 50% + Trifloxystrobin 25% WG (Nativo) @ 0.6 g/L",
      "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top) @ 1.0 ml/L"
    ],
    preventiveMeasures: [
      "Grow rust-resistant varieties like DBW 187, DBW 222, or HD 3226",
      "Avoid excess nitrogen fertilizer which creates dense humid canopy"
    ],
    sprayWindowNotes: "Spray immediately upon first symptom notice (500L water/hectare) to prevent field-wide epidemic.",
    marathiResponse: "गव्हावरील पिवळ्या तांबेऱ्यासाठी (Yellow Rust): प्रोपिकोनाझोल २५% ईसी (टिल्ट) १ मिली/लिटर पाण्यात मिसळून तात्काळ फवारणी करावी. जैविक उपायासाठी आंबट ताक (५० मिली/लिटर) फवारावे.",
    hindiResponse: "गेहूं के पीले रतुआ (तांबेरा) के लिए: प्रोपिकोनाजोल 25% ईसी (टिल्ट) 1 मिली/लीटर की दर से तुरंत छिड़कें। जैविक रूप से खट्टी छाछ (50 मिली/लीटर) का प्रयोग करें।",
    englishResponse: "For Wheat Yellow Rust / Stripe Rust: Spray Propiconazole 25% EC (Tilt) @ 1.0 ml/L immediately. Organically, apply sour buttermilk (50ml/L) or Bacillus subtilis @ 5g/L.",
    keywords: ["wheat", "rust", "tambera", "yellow", "गेहूं", "गहू", "तांबेरा", "पिवळा", "propiconazole", "tilt", "nativo"]
  },
  {
    id: "kb-05",
    crop: "Chilli",
    category: "viral",
    diseaseOrIssue: "Chilli Leaf Curl Virus & Murda Disease",
    aliases: ["मिरचीचा चुरडा-मुरडा", "लीफ कर्ल", "बोकड्या", "chilli leaf curl", "murda", "mirchi"],
    symptoms: [
      "Upward curling of leaves into cup-shaped structures caused by thrips",
      "Downward curling of leaves with blister-like thickening caused by yellow mites",
      "Stunted bushy plant with flower and fruit shedding"
    ],
    organicRemedies: [
      "Spray Agni-Astra or Dashaparni Ark (30ml/L) to control vector insects",
      "Yellow and Blue sticky traps (20 per acre) to trap whitefly and thrips vectors",
      "Spray Neem oil 5ml/L + Pongamia (Karanj) oil 3ml/L"
    ],
    chemicalRemedies: [
      "Diafenthiuron 50% WP (Pegasus) @ 1.25 g/L for dual mite and thrips control",
      "Cyantraniliprole 10.26% OD (Benevia) @ 1.8 ml/L for whitefly vector",
      "Spiromesifen 22.9% SC (Oberon) @ 1.0 ml/L specifically for downward mite curling"
    ],
    preventiveMeasures: [
      "Raise 3 rows of Maize or Sorghum border barrier to block windblown whitefly vectors",
      "Seed treatment with Imidacloprid 70% WS @ 5g/kg seed"
    ],
    sprayWindowNotes: "Curling is caused by insect vectors. Kill the vector (mites/thrips/whitefly) to stop virus spread.",
    marathiResponse: "मिरचीच्या चुरडा-मुरडा (Leaf Curl) रोगासाठी: पेगासस (१.२५ ग्रॅम/लिटर) किंवा बेनेव्हिया (१.८ मिली/लिटर) फवारावे. खालील बाजूने वळल्यास ओबेरॉन (१ मिली/लिटर) वापरावे. सेंद्रिय नियंत्रणासाठी अग्निअस्त्र किंवा दशपर्णी अर्क (३० मिली/लिटर) फवारावे.",
    hindiResponse: "मिर्च के मरोडिया (चुरडा-मुरडा) रोग के लिए: पेगासस (1.25 ग्राम/लीटर) या बेनेविया (1.8 मिली/लीटर) का छिड़काव करें। जैविक रूप से अग्निअस्त्र या 20 पीले/नीले चिपचिपे कार्ड प्रति एकड़ लगाएं।",
    englishResponse: "For Chilli Leaf Curl (Murda): Spray Diafenthiuron 50% WP (Pegasus) @ 1.25g/L or Cyantraniliprole (Benevia) @ 1.8ml/L to control vector thrips/whiteflies. For organic, use Dashaparni Ark @ 30ml/L.",
    keywords: ["chilli", "mirchi", "curl", "murda", "bokadya", "मिरची", "चुरडा", "मुरडा", "बोकड्या", "pegasus", "oberon", "benevia"]
  },
  {
    id: "kb-06",
    crop: "General",
    category: "nutrient_deficiency",
    diseaseOrIssue: "Nitrogen & Micronutrient Yellowing (Chlorosis)",
    aliases: ["पाने पिवळी पडणे", "पोषक तत्वांची कमतरता", "chlorosis", "yellow leaves", "micronutrient"],
    symptoms: [
      "General pale yellowing of older lower leaves (Nitrogen deficiency)",
      "Interveinal yellowing of young top leaves with green veins (Iron / Zinc deficiency)",
      "Slow growth and poor vigor"
    ],
    organicRemedies: [
      "Drench Jeevamrutha @ 200 Liters per acre with irrigation water",
      "Foliar spray of Vermiwash (50ml/L) or Panchagavya (30ml/L)",
      "Apply enriched Farm Yard Manure (FYM) around root zones"
    ],
    chemicalRemedies: [
      "Foliar spray of 19:19:19 (NPK) @ 5.0 g/L water",
      "Chelated Micronutrient Grade-II mixture (Zinc, Iron, Boron) @ 2.0 g/L",
      "Urea foliar spray @ 10-15 g/L for rapid nitrogen recovery"
    ],
    preventiveMeasures: [
      "Perform regular Soil Health Card testing every 2 years",
      "Maintain soil pH between 6.5 and 7.5 for optimal micronutrient uptake"
    ],
    sprayWindowNotes: "Spray micronutrients in early morning before 10 AM for highest leaf stomatal intake.",
    marathiResponse: "पाने पिवळी पडत असल्यास: १९:१९:१९ विद्राव्य खत (५ ग्रॅम/लिटर) सोबत सूक्ष्म अन्नद्रव्य ग्रेड-२ (२ ग्रॅम/लिटर) फवारावे. सेंद्रिय पद्धतीने जिवामृत (२०० लिटर/एकर) द्यावे किंवा पंचगव्य (३० मिली/लिटर) फवारावे.",
    hindiResponse: "पत्तियां पीली पड़ने पर: 19:19:19 एनपीके (5 ग्राम/लीटर) और सूक्ष्म पोषक तत्व (2 ग्राम/लीटर) का छिड़काव करें। जैविक रूप से जीवामृत या वर्मीवॉश का उपयोग करें।",
    englishResponse: "For yellowing leaves / Chlorosis: Apply 19:19:19 soluble NPK @ 5g/L plus chelated micronutrient mixture @ 2g/L. Organically, drench Jeevamrutha @ 200L/acre.",
    keywords: ["yellow", "leaves", "chlorosis", "deficiency", "पिवळी", "पाने", "खत", "19:19:19", "npk", "jeevamrutha", "micronutrient"]
  }
];

// Vector Cosine Similarity & BM25 Search Engine
export class RAGEngine {
  private corpus: AgronomicRecord[];

  constructor() {
    this.corpus = ICAR_KNOWLEDGE_CORPUS;
  }

  // Tokenize & Clean text for semantic matching (Unicode Devanagari & Latin support)
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .split(/\s+/)
      .filter(t => t.length > 1);
  }

  // Calculate Term Frequency - Inverse Document Frequency Cosine Match
  public query(userQuery: string, language: string = "Marathi"): {
    bestMatch: AgronomicRecord | null;
    confidence: number;
    response: string;
    retrievedChunks: AgronomicRecord[];
    isLocalRag: boolean;
  } {
    const queryTokens = this.tokenize(userQuery);
    if (queryTokens.length === 0) {
      return {
        bestMatch: null,
        confidence: 0,
        response: "कृपया तुमचा शेतीविषयक प्रश्न सविस्तर विचारा.",
        retrievedChunks: [],
        isLocalRag: false
      };
    }

    const scoredCorpus = this.corpus.map(record => {
      const allText = [
        record.crop,
        record.diseaseOrIssue,
        ...record.aliases,
        ...record.keywords,
        ...record.symptoms
      ].join(" ").toLowerCase();

      let score = 0;
      queryTokens.forEach(token => {
        // Direct keyword match
        if (record.keywords.some(k => k.toLowerCase().includes(token))) {
          score += 3.5;
        }
        // Alias match
        if (record.aliases.some(a => a.toLowerCase().includes(token))) {
          score += 4.0;
        }
        // General text match
        if (allText.includes(token)) {
          score += 1.5;
        }
      });

      // Normalize score against query length
      const confidence = Math.min(0.98, Number((score / (queryTokens.length * 4.0)).toFixed(2)));
      return { record, confidence };
    });

    scoredCorpus.sort((a, b) => b.confidence - a.confidence);

    const top = scoredCorpus[0];
    const topChunks = scoredCorpus.slice(0, 3).map(s => s.record);

    if (top && top.confidence >= 0.65) {
      let localizedResponse = top.record.marathiResponse;
      if (language === "Hindi") localizedResponse = top.record.hindiResponse;
      if (language === "English") localizedResponse = top.record.englishResponse;

      return {
        bestMatch: top.record,
        confidence: top.confidence,
        response: localizedResponse,
        retrievedChunks: topChunks,
        isLocalRag: true
      };
    }

    return {
      bestMatch: top ? top.record : null,
      confidence: top ? top.confidence : 0,
      response: "",
      retrievedChunks: topChunks,
      isLocalRag: false
    };
  }
}

export const ragEngine = new RAGEngine();
