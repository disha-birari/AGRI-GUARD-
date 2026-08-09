"use client";

import { useState, useEffect, type ElementType, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CloudRain, Wind, Droplets, Sun, AlertTriangle, CheckCircle, Thermometer, RefreshCw, Map, MapPin, Mic, Ban, ShieldCheck, ArrowRight } from "lucide-react";
import { useTheme, useAuth } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

const ICONS: Record<string, ElementType> = { sun: Sun, cloud: Droplets, rain: CloudRain };
const SEV_COLORS: Record<string, string> = { high: "#ba1a1a", medium: "#c4501a", low: "#456348" };
const SEV_BG: Record<string, string> = { high: "rgba(186,26,26,0.08)", medium: "rgba(196,80,26,0.08)", low: "rgba(69,99,72,0.08)" };

const COORDINATES: Record<string, { lat: number; lon: number; state: string }> = {
  Nashik: { lat: 19.9975, lon: 73.7898, state: "Maharashtra" },
  Pune: { lat: 18.5204, lon: 73.8567, state: "Maharashtra" },
  Mumbai: { lat: 19.0760, lon: 72.8777, state: "Maharashtra" },
  Nagpur: { lat: 21.1458, lon: 79.0882, state: "Maharashtra" },
  Delhi: { lat: 28.7041, lon: 77.1025, state: "Delhi" },
  Bangalore: { lat: 12.9716, lon: 77.5946, state: "Karnataka" },
  Chennai: { lat: 13.0827, lon: 80.2707, state: "Tamil Nadu" },
  Hyderabad: { lat: 17.3850, lon: 78.4867, state: "Telangana" },
  Kolkata: { lat: 22.5726, lon: 88.3639, state: "West Bengal" },
  Ahmedabad: { lat: 23.0225, lon: 72.5714, state: "Gujarat" },
  Lucknow: { lat: 26.8467, lon: 80.9462, state: "Uttar Pradesh" },
  Patna: { lat: 25.5941, lon: 85.1376, state: "Bihar" },
  Jaipur: { lat: 26.9124, lon: 75.7873, state: "Rajasthan" },
  Bhopal: { lat: 23.2599, lon: 77.4126, state: "Madhya Pradesh" },
  Amritsar: { lat: 31.6340, lon: 74.8723, state: "Punjab" },
};

function getCoords(district: string | undefined): { lat: number; lon: number; state: string } {
  if (!district) return COORDINATES.Nashik;
  const match = Object.keys(COORDINATES).find(
    k => k.toLowerCase() === district.toLowerCase()
  );
  return match ? COORDINATES[match] : COORDINATES.Nashik;
}

function getConditionFromWmo(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rainy";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Cloudy";
}

function getIconFromWmo(code: number): string {
  if ([0].includes(code)) return "sun";
  if ([1, 2, 3, 45, 48, 71, 72, 73, 75, 77, 85, 86].includes(code)) return "cloud";
  return "rain";
}

interface WeatherData {
  current: {
    temp: number;
    feels: number;
    humidity: number;
    wind: number;
    uv: number;
    condition: string;
    risk: string;
    rainNext6Hrs: boolean;
    rainProbabilityNext6Hrs: number;
  };
  hourly: {
    time: string;
    temp: number;
    rainProb: number;
    spraySafe: boolean;
  }[];
  forecast: {
    day: string;
    high: number;
    low: number;
    rain: number;
    cond: string;
    icon: string;
  }[];
  alerts: {
    type: string;
    sev: string;
    msg: string;
  }[];
  sprayCalendar: {
    day: string;
    status: "good" | "avoid" | "caution";
    note: string;
  }[];
}

export default function SmartAdvisorWeather() {
  const router = useRouter();
  const { d, isDark } = useTheme();
  const { user } = useAuth();
  
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || "Nashik");
  const [coords, setCoords] = useState(getCoords(user?.district));
  const [gpsLoading, setGpsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");

  const handleLiveGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, state: "Live GPS Location" });
        setSelectedDistrict("Live Location");
        setGpsLoading(false);
      },
      (err) => {
        console.error("GPS Error", err);
        setGpsLoading(false);
        alert("Could not access GPS. Please allow location permissions in your browser.");
      }
    );
  };

  useEffect(() => {
    let active = true;
    async function fetchLiveWeather() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,uv_index,weather_code&hourly=temperature_2m,precipitation_probability,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=auto`
        );
        if (!res.ok) throw new Error("Weather API failed");
        const json = await res.json();

        if (active && json.current && json.daily) {
          const currentTemp = Math.round(json.current.temperature_2m);
          const currentFeels = Math.round(json.current.apparent_temperature);
          const humidity = Math.round(json.current.relative_humidity_2m);
          const windSpeed = Math.round(json.current.wind_speed_10m);
          const uv = Math.round(json.current.uv_index || 0);
          const weatherCode = json.current.weather_code;
          const conditionText = getConditionFromWmo(weatherCode);

          // Calculate 6-hour rain risk from hourly forecast
          const next6HoursRainProbs = (json.hourly?.precipitation_probability || []).slice(0, 6);
          const maxRainNext6Hrs = next6HoursRainProbs.length > 0 ? Math.max(...next6HoursRainProbs) : (weatherCode >= 51 ? 80 : 10);
          const rainNext6Hrs = maxRainNext6Hrs >= 35 || weatherCode >= 51;

          let risk = "Low";
          if (humidity > 80 || windSpeed > 15 || rainNext6Hrs) {
            risk = "High";
          } else if (humidity > 70 || windSpeed > 10) {
            risk = "Medium";
          }

          // Hourly breakdown for the next 6 hours
          const currentHour = new Date().getHours();
          const hourlyForecast = next6HoursRainProbs.map((prob: number, idx: number) => {
            const h = (currentHour + idx) % 24;
            const timeLabel = idx === 0 ? "Now" : `${h % 12 || 12} ${h >= 12 ? "PM" : "AM"}`;
            const temp = Math.round(json.hourly?.temperature_2m?.[idx] || currentTemp);
            return {
              time: timeLabel,
              temp,
              rainProb: Math.round(prob),
              spraySafe: prob < 30 && windSpeed < 14 && temp < 34,
            };
          });

          const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const forecastList = json.daily.time.map((timeStr: string, idx: number) => {
            const dateObj = new Date(timeStr);
            const dayName = idx === 0 ? "Today" : daysOfWeek[dateObj.getDay()];
            const maxTemp = Math.round(json.daily.temperature_2m_max[idx]);
            const minTemp = Math.round(json.daily.temperature_2m_min[idx]);
            const prob = Math.round(json.daily.precipitation_probability_max[idx] || 0);
            const code = json.daily.weather_code[idx];
            return {
              day: dayName,
              high: maxTemp,
              low: minTemp,
              rain: prob,
              cond: getConditionFromWmo(code),
              icon: getIconFromWmo(code),
            };
          });

          const generatedAlerts = [];
          if (rainNext6Hrs) {
            generatedAlerts.push({
              type: "rain",
              sev: "high",
              msg: `High chance of rain (${maxRainNext6Hrs}%) within the next 6 hours. Delay pesticide spray to avoid chemical wash-off into groundwater.`,
            });
          } else {
            generatedAlerts.push({
              type: "rain",
              sev: "low",
              msg: `No rain expected in the next 6 hours (${maxRainNext6Hrs}% chance). Clear window for foliar feeding or bio-fungicide sprays.`,
            });
          }

          if (windSpeed > 14) {
            generatedAlerts.push({
              type: "spray",
              sev: "high",
              msg: `Wind speed is ${windSpeed} km/h (exceeds safe 12 km/h limit). Spray drift will cause chemical wastage onto neighboring plots.`,
            });
          }

          const sprayCal = forecastList.slice(0, 5).map((f: any) => {
            let status: "good" | "avoid" | "caution" = "good";
            let note = "Clear skies & calm wind. Optimal window.";

            if (f.rain >= 50) {
              status = "avoid";
              note = `${f.rain}% rain probability. Chemicals will wash off.`;
            } else if (f.rain >= 25) {
              status = "caution";
              note = `Slight rain chance (${f.rain}%). Spray only in early mornings.`;
            } else if (f.high > 32) {
              status = "caution";
              note = "Hot midday. Spray before 9 AM or after 5 PM.";
            }

            return {
              day: f.day === "Today" ? "Today" : f.day,
              status,
              note,
            };
          });

          setWeatherData({
            current: { 
              temp: currentTemp, 
              feels: currentFeels, 
              humidity, 
              wind: windSpeed, 
              uv, 
              condition: conditionText, 
              risk,
              rainNext6Hrs,
              rainProbabilityNext6Hrs: maxRainNext6Hrs
            },
            hourly: hourlyForecast,
            forecast: forecastList,
            alerts: generatedAlerts,
            sprayCalendar: sprayCal,
          });
        }
      } catch (err) {
        console.error(err);
        if (active) setError("Could not load real-time meteorological data. Check internet connection.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchLiveWeather();
    return () => { active = false; };
  }, [coords.lat, coords.lon]);

  const card = (children: ReactNode, style = {}) => (
    <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1), ...style }}>{children}</div>
  );

  return (
    <div>
      {/* Flow Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(67,100,100,0.08)", border: "1px solid rgba(67,100,100,0.2)", marginBottom: 8 }}>
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#436464", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Flow: Smart Advisor (Branch: Need Advice)
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>
          Smart Advisor — GPS Weather & Spray Timing
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          Real-time weather decision engine: <strong>GPS Location → Check Weather → Rain in 6hrs? → Don't Spray! vs Spray Now!</strong>
        </p>
      </div>

      {/* GPS Location Bar & District Selector */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, padding: "12px 18px", borderRadius: 12, background: d.bgAlt, border: `1px solid ${d.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MapPin size={18} color="#c4501a" />
          <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text }}>
            Location: {selectedDistrict} ({coords.lat.toFixed(2)}°N, {coords.lon.toFixed(2)}°E)
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button 
            onClick={handleLiveGPS}
            disabled={gpsLoading}
            style={{ padding: "7px 14px", borderRadius: 8, background: "#436464", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            {gpsLoading ? <RefreshCw size={13} className="animate-spin" /> : <MapPin size={13} />}
            Detect My GPS
          </button>

          <select 
            value={selectedDistrict}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDistrict(val);
              if (COORDINATES[val]) {
                setCoords(COORDINATES[val]);
              }
            }}
            style={{ padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${d.border}`, background: d.card, color: d.text, fontFamily: MRP, fontSize: 12, outline: "none", cursor: "pointer" }}
          >
            {Object.keys(COORDINATES).map(k => (
              <option key={k} value={k}>{k} ({COORDINATES[k].state})</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(186,26,26,0.08)", border: "1px solid rgba(186,26,26,0.2)", marginBottom: 16 }}>
          <p style={{ fontFamily: MRP, fontSize: 13, color: "#ba1a1a", margin: 0 }}>{error}</p>
        </div>
      )}

      {loading && !weatherData ? (
        <div style={{ padding: "48px 24px", textAlign: "center", background: d.card, border: `1px solid ${d.border}`, borderRadius: 14 }}>
          <RefreshCw size={28} style={{ color: "#c4501a", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: 0 }}>Consulting satellite meteorological radar for {selectedDistrict}...</p>
        </div>
      ) : weatherData ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* THE FLOWCHART DECISION BANNER: RAIN IN 6HRS? */}
          {weatherData.current.rainNext6Hrs ? (
            /* DONT SPRAY BANNER */
            <div style={{ 
              padding: "20px 24px", 
              borderRadius: 16, 
              background: "linear-gradient(135deg, rgba(186,26,26,0.12) 0%, rgba(186,26,26,0.05) 100%)", 
              border: "2px solid rgba(186,26,26,0.4)", 
              boxShadow: "0 6px 20px rgba(186,26,26,0.08)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              flexWrap: "wrap", 
              gap: 16 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ba1a1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Ban size={28} color="#fff" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 11, color: "#fff", background: "#ba1a1a", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>Rain in 6hrs: YES</span>
                    <h2 style={{ fontFamily: PJS, fontWeight: 900, fontSize: 22, color: "#ba1a1a", margin: 0 }}>🚫 DON'T SPRAY TODAY!</h2>
                  </div>
                  <p style={{ fontFamily: MRP, fontSize: 14, color: d.textSub, margin: 0, maxWidth: 580, lineHeight: 1.5 }}>
                    <strong>{weatherData.current.rainProbabilityNext6Hrs}% rain probability</strong> expected within 6 hours. Spraying now will wash away expensive fungicides and cause pesticide runoff into soil.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/app/voice")}
                style={{ padding: "10px 18px", borderRadius: 10, background: "#ba1a1a", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Mic size={14} />Ask Voice Advisor →
              </button>
            </div>
          ) : (
            /* SPRAY NOW BANNER */
            <div style={{ 
              padding: "20px 24px", 
              borderRadius: 16, 
              background: "linear-gradient(135deg, rgba(69,99,72,0.14) 0%, rgba(69,99,72,0.06) 100%)", 
              border: "2px solid rgba(69,99,72,0.4)", 
              boxShadow: "0 6px 20px rgba(69,99,72,0.08)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              flexWrap: "wrap", 
              gap: 16 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#456348", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck size={30} color="#fff" />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 11, color: "#fff", background: "#456348", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>Rain in 6hrs: NO</span>
                    <h2 style={{ fontFamily: PJS, fontWeight: 900, fontSize: 22, color: "#456348", margin: 0 }}>✅ SPRAY NOW — SAFE WINDOW</h2>
                  </div>
                  <p style={{ fontFamily: MRP, fontSize: 14, color: d.textSub, margin: 0, maxWidth: 580, lineHeight: 1.5 }}>
                    Zero precipitation in the next 6 hours ({weatherData.current.rainProbabilityNext6Hrs}% rain chance). Wind is calm at <strong>{weatherData.current.wind} km/h</strong>. Optimal absorption window.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => router.push("/app/scanner")}
                style={{ padding: "10px 18px", borderRadius: 10, background: "#456348", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                Scan Leaf For Dosage →
              </button>
            </div>
          )}

          {/* Current conditions + Next 6 Hours Hourly Tracker */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {/* Live Metrics */}
            {card(
              <div>
                <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>
                  Current Telemetry · {selectedDistrict}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(196,80,26,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Thermometer size={22} color="#c4501a" />
                    </div>
                    <div>
                      <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: 0 }}>{weatherData.current.temp}°C</p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Feels {weatherData.current.feels}°C · {weatherData.current.condition}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(67,100,100,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Droplets size={20} color="#436464" />
                    </div>
                    <div>
                      <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: 0 }}>{weatherData.current.humidity}%</p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Relative Humidity</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(69,99,72,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Wind size={20} color="#456348" />
                    </div>
                    <div>
                      <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: 0 }}>{weatherData.current.wind} <span style={{ fontSize: 12 }}>km/h</span></p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Wind Drift Speed</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,94,60,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sun size={20} color="#8b5e3c" />
                    </div>
                    <div>
                      <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: 0 }}>{weatherData.current.uv} / 10</p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Solar UV Index</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next 6-Hour Spray Forecast */}
            {card(
              <div>
                <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>
                  Next 6-Hour Spray Safety Window
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, textAlign: "center" }}>
                  {weatherData.hourly.map((h, i) => (
                    <div key={i} style={{ 
                      padding: "8px 4px", 
                      borderRadius: 10, 
                      background: h.spraySafe ? "rgba(69,99,72,0.08)" : "rgba(186,26,26,0.08)", 
                      border: `1px solid ${h.spraySafe ? "rgba(69,99,72,0.3)" : "rgba(186,26,26,0.3)"}` 
                    }}>
                      <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, margin: "0 0 4px" }}>{h.time}</p>
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 4px" }}>{h.temp}°</p>
                      <p style={{ fontFamily: MRP, fontSize: 10, color: h.rainProb > 30 ? "#ba1a1a" : "#436464", margin: "0 0 4px", fontWeight: 700 }}>{h.rainProb}% rain</p>
                      <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 9, color: h.spraySafe ? "#456348" : "#ba1a1a" }}>
                        {h.spraySafe ? "✓ SAFE" : "✗ SKIP"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Windy Satellite Interactive Radar */}
          {card(
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Map size={16} color="#c4501a" />
                  <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Live Satellite Radar & Cloud Grids</p>
                </div>
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>Live ECMWF Doppler Model</span>
              </div>
              <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${d.border}`, height: 350, width: "100%", position: "relative" }}>
                <iframe
                  src={`https://embed.windy.com/embed2.html?lat=${coords.lat}&lon=${coords.lon}&detailLat=${coords.lat}&detailLon=${coords.lon}&width=650&height=350&zoom=7&level=surface&overlay=radar&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
                  width="100%"
                  height="350"
                  frameBorder="0"
                  title="Windy Weather Satellite Map"
                  style={{ display: "block", background: d.bgAlt }}
                />
              </div>
            </div>
          )}

          {/* 7-Day Forecast */}
          {card(
            <div>
              <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>7-Day Agricultural Forecast</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px,1fr))", gap: 8 }}>
                {weatherData.forecast.map((f, i) => {
                  const Icon = ICONS[f.icon] ?? Sun;
                  const isRainy = f.rain > 30;
                  return (
                    <div key={i} style={{ padding: "12px 8px", borderRadius: 12, border: `1px solid ${isRainy ? "rgba(67,100,100,0.25)" : d.border}`, background: isRainy ? "rgba(67,100,100,0.06)" : "transparent", textAlign: "center" }}>
                      <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, margin: "0 0 8px" }}>{f.day}</p>
                      <Icon size={18} color={isRainy ? "#436464" : "#c4501a"} style={{ margin: "0 auto 8px" }} />
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 2px" }}>{f.high}°</p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 5px" }}>{f.low}°</p>
                      {f.rain > 0 && (
                        <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: "#436464", margin: 0 }}>{f.rain}% rain</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cross flow banner to Agri-Voice */}
          <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(67,100,100,0.08)", border: "1px solid rgba(67,100,100,0.25)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Mic size={20} color="#436464" />
              <div>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: 0 }}>Still unsure about spray timing?</p>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>Speak your question in Hindi, Marathi, Tamil or English to Agri-Voice advisor.</p>
              </div>
            </div>
            <button onClick={() => router.push("/app/voice")} style={{ padding: "8px 16px", borderRadius: 8, background: "#436464", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
              Ask Agri-Voice Now →
            </button>
          </div>

        </div>
      ) : null}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}

