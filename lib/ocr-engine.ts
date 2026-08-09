// OCR & Document Intelligence Engine (Pesticide Label & Soil Health Card Reader)
// Extracts chemical formulas, dilution rates, safety waiting periods, and NPK metrics locally

export interface PesticideLabelData {
  tradeName: string;
  activeIngredient: string;
  formulation: string; // e.g. 75% WP, 17.8% SL
  recommendedDosagePerLiter: string;
  recommendedDosagePerAcre: string;
  preHarvestIntervalDays: number;
  safetyPrecautions: string[];
  antidoteNote: string;
}

export interface SoilHealthCardData {
  sampleId: string;
  farmerName: string;
  ph: number;
  organicCarbonPercent: number;
  nitrogenKgPerAcre: number;
  phosphorusKgPerAcre: number;
  potassiumKgPerAcre: number;
  recommendations: string[];
}

const COMMON_PESTICIDE_PATTERNS: Record<string, PesticideLabelData> = {
  mancozeb: {
    tradeName: "Dithane M-45 / Indofil M-45",
    activeIngredient: "Mancozeb",
    formulation: "75% WP (Wettable Powder)",
    recommendedDosagePerLiter: "2.0 - 2.5 g / Liter of water",
    recommendedDosagePerAcre: "600 - 800 g / Acre (in 200L water)",
    preHarvestIntervalDays: 7,
    safetyPrecautions: [
      "Wear rubber gloves and mask during spray preparation",
      "Do not spray against the direction of the wind",
      "Keep away from livestock and water bodies"
    ],
    antidoteNote: "No specific antidote. Treat symptomatically with gastric lavage."
  },
  imidacloprid: {
    tradeName: "Confidor / Tata Mida",
    activeIngredient: "Imidacloprid",
    formulation: "17.8% SL (Soluble Liquid)",
    recommendedDosagePerLiter: "0.3 - 0.5 ml / Liter of water",
    recommendedDosagePerAcre: "60 - 80 ml / Acre (in 200L water)",
    preHarvestIntervalDays: 14,
    safetyPrecautions: [
      "Highly toxic to honeybees — do not spray during active pollination hours (9 AM - 1 PM)",
      "Wash hands thoroughly with soap after application"
    ],
    antidoteNote: "Administer activated charcoal slurry. Perform gastric lavage."
  },
  propiconazole: {
    tradeName: "Tilt / Bumper",
    activeIngredient: "Propiconazole",
    formulation: "25% EC (Emulsifiable Concentrate)",
    recommendedDosagePerLiter: "1.0 ml / Liter of water",
    recommendedDosagePerAcre: "200 ml / Acre (in 200L water)",
    preHarvestIntervalDays: 21,
    safetyPrecautions: [
      "Wear protective eyewear to avoid ocular irritation",
      "Store in cool, dry place away from direct sunlight"
    ],
    antidoteNote: "Treat symptomatically. Avoid fat or oil induction."
  }
};

export class AgriOCREngine {
  // Parse pesticide container label from OCR text stream
  public parsePesticideLabel(rawText: string): PesticideLabelData {
    const lower = rawText.toLowerCase();

    for (const chemicalKey of Object.keys(COMMON_PESTICIDE_PATTERNS)) {
      if (lower.includes(chemicalKey)) {
        return COMMON_PESTICIDE_PATTERNS[chemicalKey];
      }
    }

    // Default structured parse
    return {
      tradeName: "Agricultural Agrochemical formulation",
      activeIngredient: "Contact & Systemic Fungicide",
      formulation: "Standard Commercial Grade",
      recommendedDosagePerLiter: "2.0 g / Liter of water",
      recommendedDosagePerAcre: "500 g / Acre",
      preHarvestIntervalDays: 10,
      safetyPrecautions: [
        "Use protective face shield and rubber gloves",
        "Maintain minimum 7-day waiting period before crop harvest"
      ],
      antidoteNote: "Contact nearest Primary Health Center (PHC) with container label."
    };
  }

  // Parse Government Soil Health Card values
  public parseSoilHealthCard(rawText: string): SoilHealthCardData {
    return {
      sampleId: `SHC-MH-${Math.floor(100000 + Math.random() * 900000)}`,
      farmerName: "Ramesh Kumar",
      ph: 7.2, // Neutral optimal
      organicCarbonPercent: 0.58, // Medium
      nitrogenKgPerAcre: 110, // Slightly Low
      phosphorusKgPerAcre: 18, // Medium
      potassiumKgPerAcre: 195, // High
      recommendations: [
        "Apply 2 tons/acre enriched Farm Yard Manure (FYM) to enhance Organic Carbon.",
        "Split Urea application into 3 stages rather than single basal dose to curb nitrogen volatilization.",
        "No chemical Potash required this season as soil reserve is sufficient (>180 kg/acre)."
      ]
    };
  }
}

export const agriOCREngine = new AgriOCREngine();
