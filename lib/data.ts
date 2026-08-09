export interface TreatmentDetail {
  organic: string[];
  chemical: string[];
  preventive: string[];
  severity: "High" | "Medium" | "Low" | "None";
  timeWindow: string;
}

export const DISEASE_KNOWLEDGE: Record<string, { crop: string; desc: string; treatments: TreatmentDetail }> = {
  "Late Blight": {
    crop: "Tomato",
    desc: "Caused by Phytophthora infestans. Rapidly spreads in humid weather causing brown-black water-soaked lesions.",
    treatments: {
      severity: "High",
      timeWindow: "Act within 24–48 hours",
      organic: [
        "Spray Panchagavya (30ml/L) or Jeevamrutha early morning.",
        "Apply Trichoderma viride bio-fungicide (5g/L water).",
        "Dust wood ash around plant base to reduce leaf humidity.",
        "Remove heavily infected leaves and burn outside farm."
      ],
      chemical: [
        "Apply Mancozeb 75% WP @ 2.0–2.5 g/L water immediately.",
        "Spray Metalaxyl-M + Mancozeb (Ridomil Gold) @ 2.5 g/L if severe.",
        "Spray Copper Oxychloride 50% WP @ 3.0 g/L after rainfall stops.",
        "Ensure complete canopy coverage using fine hollow cone nozzle."
      ],
      preventive: [
        "Avoid overhead sprinkler watering; use drip irrigation.",
        "Maintain 60cm row spacing for optimal air circulation."
      ]
    }
  },
  "Early Blight": {
    crop: "Tomato",
    desc: "Caused by Alternaria solani. Concentric target-board brown spots on older lower leaves.",
    treatments: {
      severity: "Medium",
      timeWindow: "Act within 3–4 days",
      organic: [
        "Spray pure cold-pressed Neem Oil (5ml/L) + mild liquid soap emulsion.",
        "Apply fermented buttermilk spray (50ml/L) every 7 days.",
        "Mulch around soil to prevent fungal spores from splashing up.",
        "Prune bottom 12 inches of foliage touching wet soil."
      ],
      chemical: [
        "Apply Chlorothalonil 75% WP @ 2g/L water.",
        "Spray Azoxystrobin 23% SC @ 1ml/L at first appearance of spots.",
        "Alternate fungicides every 10 days to prevent resistance."
      ],
      preventive: [
        "Practice 2-year crop rotation avoiding solanaceous crops.",
        "Stake plants upright to keep leaves dry."
      ]
    }
  },
  "Powdery Mildew": {
    crop: "Onion",
    desc: "Fungal white talcum-like powder patches on leaves causing yellowing and premature leaf drop.",
    treatments: {
      severity: "Medium",
      timeWindow: "Act within 5 days",
      organic: [
        "Spray baking soda (Potassium/Sodium Bicarbonate) solution @ 5g/L.",
        "Apply diluted milk whey spray (1 part milk to 9 parts water in sunlight).",
        "Spray garlic-chilli extract emulsion weekly."
      ],
      chemical: [
        "Apply Wettable Sulfur 80% WP @ 3g/L water.",
        "Spray Hexaconazole 5% EC @ 1ml/L during cool morning hours."
      ],
      preventive: [
        "Avoid excessive nitrogen fertilizers which create soft susceptible growth.",
        "Ensure full sunlight exposure across beds."
      ]
    }
  },
  "Healthy": {
    crop: "Tomato",
    desc: "No pathogens or nutritional deficiencies detected. Crop foliage and vigor are optimal.",
    treatments: {
      severity: "None",
      timeWindow: "Routine maintenance",
      organic: [
        "Apply vermicompost tea every 14 days to boost beneficial soil microbes.",
        "Spray seaweed extract (2ml/L) to strengthen plant immunity.",
        "Maintain balanced soil moisture with drip irrigation."
      ],
      chemical: [
        "No chemical fungicides needed at this stage.",
        "Maintain balanced 19:19:19 NPK foliar spray @ 4g/L during flowering."
      ],
      preventive: [
        "Scout field twice weekly for early pest/disease presence.",
        "Keep field borders free of alternate weed hosts."
      ]
    }
  }
};

export const DEMO_USERS: Record<string, User> = {
  farmer: {
    id: "f1", name: "Ramesh Kumar", email: "ramesh@farm.in",
    role: "farmer", avatar: "RK", language: "hi",
    phone: "+91 98765 43210", state: "Maharashtra",
    district: "Nashik", village: "Igatpuri",
    farmSize: "5 acres", crops: ["Tomato", "Onion", "Wheat"],
  },
  expert: {
    id: "e1", name: "Dr. Priya Sharma", email: "expert@agri.in",
    role: "expert", avatar: "PS", language: "en",
    phone: "+91 87654 32109",
  },
  admin: {
    id: "a1", name: "Admin User", email: "admin@agriguard.in",
    role: "admin", avatar: "AU", language: "en",
  },
};

export const SCANS = [
  { id: "s1", crop: "Tomato", disease: "Late Blight", confidence: 96, date: "Jan 15, 2024", status: "treated", img: "photo-1416879595882-3373a0480b5b", severity: "High" },
  { id: "s2", crop: "Onion", disease: "Powdery Mildew", confidence: 88, date: "Jan 10, 2024", status: "consulting", img: "photo-1416879595882-3373a0480b5b", severity: "Medium" },
  { id: "s3", crop: "Tomato", disease: "Healthy", confidence: 99, date: "Jan 5, 2024", status: "healthy", img: "photo-1464226184884-fa280b87c399", severity: "None" },
  { id: "s4", crop: "Wheat", disease: "Early Blight", confidence: 92, date: "Dec 28, 2023", status: "treated", img: "photo-1500651230702-0e2d8a49d4ad", severity: "High" },
];

export const VOICE_LOGS = [
  { id: "v1", query: "Tomato leaves turning yellow, what should I do?", response: "Yellow leaves on tomatoes may indicate nitrogen deficiency or early blight. Check for spots — if present, apply Mancozeb 2g/L. If no spots, apply 19:19:19 NPK fertilizer.", date: "Jan 14, 2024", lang: "Hindi" },
  { id: "v2", query: "When is the best time to spray fungicide?", response: "Spray fungicide in the early morning (before 9 AM) or late evening (after 5 PM) to avoid evaporation and ensure maximum absorption. Avoid spraying if rain is forecast within 6 hours.", date: "Jan 12, 2024", lang: "Hindi" },
  { id: "v3", query: "What fertilizer for onions before harvest?", response: "Stop nitrogen fertilizers 3 weeks before harvest. Apply potassium sulphate (SOP) at 50kg/acre to improve bulb size and shelf life.", date: "Jan 8, 2024", lang: "Hindi" },
];

export const WEATHER = {
  current: { temp: 28, feels: 30, humidity: 65, wind: 12, uv: 7, condition: "Partly Cloudy", risk: "Low", rainNext6Hrs: false },
  forecast: [
    { day: "Mon", high: 30, low: 22, rain: 0,  cond: "Sunny",         icon: "sun" },
    { day: "Tue", high: 27, low: 21, rain: 40, cond: "Shower",        icon: "rain" },
    { day: "Wed", high: 25, low: 20, rain: 70, cond: "Heavy Rain",    icon: "rain" },
    { day: "Thu", high: 26, low: 21, rain: 20, cond: "Cloudy",        icon: "cloud" },
    { day: "Fri", high: 29, low: 22, rain: 0,  cond: "Sunny",         icon: "sun" },
    { day: "Sat", high: 31, low: 23, rain: 0,  cond: "Hot",           icon: "sun" },
    { day: "Sun", high: 28, low: 21, rain: 10, cond: "Partly Cloudy", icon: "cloud" },
  ],
  alerts: [
    { type: "rain",  sev: "high",   msg: "Heavy rain forecast Tuesday–Wednesday. Do NOT spray any pesticide or fertilizer." },
    { type: "temp",  sev: "medium", msg: "Temperature drop to 20°C next week. Cover sensitive seedlings." },
    { type: "spray", sev: "low",    msg: "Best spray window: today 6–9 AM or after 5 PM. Wind speed optimal." },
  ],
};

export const MARKETS = [
  { id: "m1", name: "Vashi APMC, Navi Mumbai", km: 22, price: 3100, delta: +240, best: true,  lat: 19.0771, lon: 72.9986, demand: "Surge (+18%)", arrivalTons: 420, transportCostPerQtl: 90 },
  { id: "m2", name: "Pimpalgaon Baswant, Nashik", km: 14, price: 2980, delta: +160, best: false, lat: 20.1706, lon: 73.9856, demand: "High (+10%)",  arrivalTons: 680, transportCostPerQtl: 50 },
  { id: "m3", name: "Lasalgaon Mandi, Nashik",    km: 28, price: 2920, delta: +110, best: false, lat: 20.1478, lon: 74.2289, demand: "Stable",        arrivalTons: 850, transportCostPerQtl: 80 },
  { id: "m4", name: "Pune Gultekdi APMC",         km: 45, price: 2860, delta: +70,  best: false, lat: 18.4965, lon: 73.8687, demand: "Stable",        arrivalTons: 510, transportCostPerQtl: 130 },
  { id: "m5", name: "Azadpur Mandi, Delhi",       km: 95, price: 2750, delta: -40,  best: false, lat: 28.7100, lon: 77.1700, demand: "Moderate",      arrivalTons: 920, transportCostPerQtl: 280 },
  { id: "m6", name: "Koyambedu Wholesale, Chennai", km: 120, price: 2680, delta: -80, best: false, lat: 13.0694, lon: 80.1948, demand: "Low",       arrivalTons: 380, transportCostPerQtl: 340 },
];

export const COMMUNITY_ALERTS = [
  { id: "ca1", crop: "Tomato", disease: "Late Blight", distanceKm: 6.4, location: "Ozar / Niphad Belt", date: "Reported 2 hrs ago", severity: "high", cases: 14, advice: "Rain in 48h will accelerate spore spread. Apply preventive Trichoderma or Mancozeb today." },
  { id: "ca2", crop: "Onion", disease: "Purple Blotch", distanceKm: 11.2, location: "Dindori Valley", date: "Reported 5 hrs ago", severity: "medium", cases: 8, advice: "High morning dew detected. Ensure sulfur dust or neem emulsion application." },
  { id: "ca3", crop: "Chilli", disease: "Thrips / Leaf Curl", distanceKm: 18.5, location: "Sinnar Border", date: "Reported 1 day ago", severity: "medium", cases: 19, advice: "Install blue/yellow sticky traps to monitor early vector movement." },
];

export const SEASON_REPORT = {
  seasonName: "Rabi 2023–2024",
  totalScans: 28,
  healthyPercent: 86,
  diseasesPrevented: 6,
  estimatedYieldSavedKg: 1450,
  netFinancialGainINR: 42500,
  organicRemediesUsed: 68,
  chemicalRemediesUsed: 32,
  milestones: [
    { date: "Dec 10", title: "Sowing Season Kickoff", status: "completed" },
    { date: "Dec 28", title: "Early Blight Suppressed", status: "saved" },
    { date: "Jan 12", title: "Optimal Spray Window Achieved", status: "completed" },
    { date: "Jan 15", title: "Peak Mandi Sale at ₹3,100/qtl", status: "profit" },
  ]
};

export const NOTIFICATIONS = [
  { id: "n1", type: "weather", sev: "high",   title: "🌧️ Rain in 6 Hours Alert", msg: "Don't spray! Precipitation expected at 3:00 PM. Pesticides will wash away.", time: "30m ago", read: false },
  { id: "n2", type: "disease", sev: "high",   title: "⚠️ Disease Outbreak Near You", msg: "Late Blight confirmed 6.4 km away in Ozar. Inspect your tomato fields.", time: "2h ago", read: false },
  { id: "n3", type: "price",   sev: "medium", title: "📈 Mandi Price Surge", msg: "Tomato prices at Vashi APMC surged by +₹240/qtl. Best rate: ₹3,100.", time: "4h ago", read: false },
  { id: "n4", type: "system",  sev: "low",    title: "✅ Scan Saved to History", msg: "Tomato Late Blight treatment plan added to your Season Report.", time: "1d ago", read: true },
  { id: "n5", type: "price",   sev: "low",    title: "Mandi Trend Update", msg: "Lasalgaon onion rates steady at ₹2,920/qtl.", time: "2d ago", read: true },
];

export const EXPERT_QUEUE = [
  { id: "q1", farmer: "Ramesh Kumar",   crop: "Tomato", disease: "Late Blight",   conf: 88, query: "Brown spots spreading fast. Is it Late Blight?",      date: "Jan 15", status: "pending"  },
  { id: "q2", farmer: "Priya Devi",     crop: "Chilli", disease: "Leaf Curl",     conf: 82, query: "Leaves curling inward. Used neem oil, no effect.",     date: "Jan 14", status: "pending"  },
  { id: "q3", farmer: "Sukhwinder S.",  crop: "Wheat",  disease: "Yellow Rust",   conf: 91, query: "Yellow streaks on leaves. Spreading to nearby rows.",  date: "Jan 13", status: "answered" },
  { id: "q4", farmer: "Kavitha Reddy",  crop: "Cotton", disease: "Bollworm",      conf: 86, query: "Small holes in bolls. Worms visible.",                 date: "Jan 12", status: "answered" },
];

export const ADMIN_STATS = {
  totalUsers: 240412,
  farmers: 235890,
  experts: 4320,
  admins: 202,
  scansToday: 8420,
  activeToday: 32100,
  weeklyScans: [
    { day: "Mon", scans: 6200 }, { day: "Tue", scans: 7100 },
    { day: "Wed", scans: 5800 }, { day: "Thu", scans: 8900 },
    { day: "Fri", scans: 9200 }, { day: "Sat", scans: 8420 },
    { day: "Sun", scans: 7600 },
  ],
  recentUsers: [
    { id: "u1", name: "Arjun Patel",    email: "arjun@farm.in",  role: "farmer", state: "Gujarat",     joined: "Jan 15" },
    { id: "u2", name: "Sunita Devi",    email: "sunita@farm.in", role: "farmer", state: "UP",          joined: "Jan 15" },
    { id: "u3", name: "Dr. Rao",        email: "rao@agri.in",    role: "expert", state: "Telangana",   joined: "Jan 14" },
    { id: "u4", name: "Harpreet Kaur",  email: "hp@farm.in",     role: "farmer", state: "Punjab",      joined: "Jan 14" },
    { id: "u5", name: "Mohamed Ali",    email: "mali@farm.in",   role: "farmer", state: "Tamil Nadu",  joined: "Jan 13" },
  ],
};

export const HEALTH_CHART = [
  { date: "Dec 1",  healthy: 2, diseased: 1 },
  { date: "Dec 8",  healthy: 3, diseased: 2 },
  { date: "Dec 15", healthy: 1, diseased: 3 },
  { date: "Dec 22", healthy: 4, diseased: 1 },
  { date: "Dec 29", healthy: 3, diseased: 2 },
  { date: "Jan 5",  healthy: 5, diseased: 0 },
  { date: "Jan 12", healthy: 4, diseased: 1 },
];

