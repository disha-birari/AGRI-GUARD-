import type { User } from "./context";

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
  { id: "s2", crop: "Onion", disease: "Purple Blotch", confidence: 88, date: "Jan 10, 2024", status: "consulting", img: "photo-1416879595882-3373a0480b5b", severity: "Medium" },
  { id: "s3", crop: "Tomato", disease: "Healthy", confidence: 99, date: "Jan 5, 2024", status: "healthy", img: "photo-1464226184884-fa280b87c399", severity: "None" },
  { id: "s4", crop: "Wheat", disease: "Rust", confidence: 92, date: "Dec 28, 2023", status: "treated", img: "photo-1500651230702-0e2d8a49d4ad", severity: "High" },
];

export const VOICE_LOGS = [
  { id: "v1", query: "Tomato leaves turning yellow, what should I do?", response: "Yellow leaves on tomatoes may indicate nitrogen deficiency or early blight. Check for spots — if present, apply Mancozeb 2g/L. If no spots, apply 19:19:19 NPK fertilizer.", date: "Jan 14, 2024", lang: "Hindi" },
  { id: "v2", query: "When is the best time to spray fungicide?", response: "Spray fungicide in the early morning (before 9 AM) or late evening (after 5 PM) to avoid evaporation and ensure maximum absorption. Avoid spraying if rain is forecast within 4 hours.", date: "Jan 12, 2024", lang: "Hindi" },
  { id: "v3", query: "What fertilizer for onions before harvest?", response: "Stop nitrogen fertilizers 3 weeks before harvest. Apply potassium sulphate (SOP) at 50kg/acre to improve bulb size and shelf life.", date: "Jan 8, 2024", lang: "Hindi" },
];

export const WEATHER = {
  current: { temp: 28, feels: 30, humidity: 65, wind: 12, uv: 7, condition: "Partly Cloudy", risk: "Low" },
  forecast: [
    { day: "Mon", high: 30, low: 22, rain: 0,  cond: "Sunny",       icon: "sun" },
    { day: "Tue", high: 27, low: 21, rain: 40, cond: "Shower",      icon: "rain" },
    { day: "Wed", high: 25, low: 20, rain: 70, cond: "Heavy Rain",  icon: "rain" },
    { day: "Thu", high: 26, low: 21, rain: 20, cond: "Cloudy",      icon: "cloud" },
    { day: "Fri", high: 29, low: 22, rain: 0,  cond: "Sunny",       icon: "sun" },
    { day: "Sat", high: 31, low: 23, rain: 0,  cond: "Hot",         icon: "sun" },
    { day: "Sun", high: 28, low: 21, rain: 10, cond: "Partly Cloudy", icon: "cloud" },
  ],
  alerts: [
    { type: "rain",  sev: "high",   msg: "Heavy rain Tuesday–Wednesday. Do NOT spray any pesticide or fertilizer." },
    { type: "temp",  sev: "medium", msg: "Temperature drop to 20°C next week. Cover sensitive seedlings." },
    { type: "spray", sev: "low",    msg: "Best spray window: today 6–9 AM or after 5 PM. Wind speed optimal." },
  ],
};

export const MARKETS = [
  { name: "Vashi APMC, Mumbai",       km: 22, price: 3100, delta: +240, best: true  },
  { name: "Yeshwanthpur, Bangalore",  km: 11, price: 2950, delta: +190, best: false },
  { name: "Azadpur, Delhi",           km:  8, price: 2840, delta: +120, best: false },
  { name: "Koyambedu, Chennai",       km: 15, price: 2680, delta:  -80, best: false },
];

export const NOTIFICATIONS = [
  { id: "n1", type: "weather", sev: "high",   title: "Rain Alert",          msg: "Heavy rain expected Tue–Wed. Avoid all spraying.",          time: "2h ago",  read: false },
  { id: "n2", type: "price",   sev: "medium", title: "Tomato Prices Up",    msg: "Tomato prices at Vashi APMC up ₹240/qtl today.",            time: "4h ago",  read: false },
  { id: "n3", type: "disease", sev: "high",   title: "Late Blight Alert",   msg: "Outbreak reported in Nashik district. Check your crops.",   time: "1d ago",  read: false },
  { id: "n4", type: "system",  sev: "low",    title: "Scan Complete",       msg: "Your Tomato scan result is ready to view.",                  time: "1d ago",  read: true  },
  { id: "n5", type: "price",   sev: "low",    title: "Market Update",       msg: "Onion prices dropped ₹80/qtl at Azadpur.",                   time: "2d ago",  read: true  },
  { id: "n6", type: "system",  sev: "low",    title: "Profile Updated",     msg: "Your farm profile was updated successfully.",                time: "3d ago",  read: true  },
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
