"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, Check } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

const CROPS = ["Tomato","Onion","Wheat","Rice","Chilli","Cotton","Sugarcane","Potato","Maize","Soybean","Groundnut","Mango"];
const STATES = ["Maharashtra","Gujarat","Punjab","Uttar Pradesh","Tamil Nadu","Telangana","Karnataka","Andhra Pradesh","Madhya Pradesh","Rajasthan","Bihar","West Bengal"];

export default function Signup() {
  const router = useRouter();
  const { login } = useAuth();
  const { isDark, d } = useTheme();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"farmer"|"expert">("farmer");
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"", state:"Maharashtra", district:"Nashik", village:"", farmSize:"", crops:[] as string[] });
  const [loading, setLoading] = useState(false);

  const set = (k: string, v: string | string[]) => setForm(f => ({ ...f, [k]: v }));
  const toggleCrop = (c: string) => set("crops", form.crops.includes(c) ? form.crops.filter(x => x !== c) : [...form.crops, c]);

  const inp = (label: string, key: string, placeholder: string, type = "text") => (
    <div>
      <label style={{ fontFamily:MRP,fontWeight:600,fontSize:13,color:d.textSub,display:"block",marginBottom:6 }}>{label}</label>
      <input type={type} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        style={{ width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${d.border}`,background:isDark?"rgba(255,248,245,0.05)":"#feeade",color:d.text,fontFamily:MRP,fontSize:14,outline:"none",boxSizing:"border-box" }}
        onFocus={e => (e.target.style.borderColor="#c4501a")}
        onBlur={e => (e.target.style.borderColor=d.border)}
      />
    </div>
  );

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      login({ id:"new1", name:form.name||"New User", email:form.email, role, avatar: (form.name||"NU").slice(0,2).toUpperCase(), language:"en", phone:form.phone, state:form.state, district:form.district, village:form.village, farmSize:form.farmSize, crops:form.crops });
      router.push(role === "expert" ? "/expert/dashboard" : "/app/dashboard");
    }, 800);
  };

  return (
    <div style={{ minHeight:"100vh",background:d.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <div style={{ width:"100%",maxWidth:480,position:"relative" }}>
        {/* Logo */}
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:6 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:"#c4501a",display:"flex",alignItems:"center",justifyContent:"center" }}><Leaf size={16} color="#fff"/></div>
            <span style={{ fontFamily:PJS,fontWeight:800,fontSize:20,color:d.text }}>AgriGuard</span>
          </div>
          <p style={{ fontFamily:MRP,fontSize:13,color:d.textMuted,margin:0 }}>Create your free account</p>
        </div>

        {/* Progress */}
        <div style={{ display:"flex",gap:6,marginBottom:28 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ flex:1,height:3,borderRadius:999,background:n<=step?"#c4501a":d.border,transition:"background 0.3s" }}/>
          ))}
        </div>

        <div style={{ background:d.card,border:`1px solid ${d.border}`,borderRadius:18,padding:32,boxShadow:shadow(isDark,2) }}>

          {/* Step 1: Role */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily:PJS,fontWeight:700,fontSize:20,color:d.text,margin:"0 0 6px" }}>Choose your role</h2>
              <p style={{ fontFamily:MRP,fontSize:14,color:d.textMuted,margin:"0 0 24px" }}>What best describes you?</p>
              <div style={{ display:"flex",flexDirection:"column",gap:12,marginBottom:28 }}>
                {([["farmer","👨‍🌾  Farmer","I grow crops and need AI assistance"],["expert","🔬  Expert / Agronomist","I advise farmers on crop health"]] as const).map(([r,label,desc]) => (
                  <button key={r} onClick={() => setRole(r)} style={{ width: "100%", padding:"16px 18px",borderRadius:12,border:`2px solid ${role===r?"#c4501a":d.border}`,background:role===r?"rgba(196,80,26,0.06)":d.card,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:14,transition:"all 0.15s" }}>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:PJS,fontWeight:700,fontSize:15,color:d.text,margin:"0 0 2px" }}>{label}</p>
                      <p style={{ fontFamily:MRP,fontSize:13,color:d.textMuted,margin:0 }}>{desc}</p>
                    </div>
                    {role===r && <div style={{ width:22,height:22,borderRadius:"50%",background:"#c4501a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><Check size={12} color="#fff"/></div>}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} style={{ width:"100%",padding:13,borderRadius:8,background:"#c4501a",color:"#fff",fontFamily:PJS,fontWeight:700,fontSize:15,border:"none",cursor:"pointer" }}>
                Continue <ArrowRight size={15} style={{ display:"inline",verticalAlign:"middle" }}/>
              </button>
            </div>
          )}

          {/* Step 2: Basic info */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily:PJS,fontWeight:700,fontSize:20,color:d.text,margin:"0 0 22px" }}>Your details</h2>
              <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:24 }}>
                {inp("Full Name","name","Ramesh Kumar")}
                {inp("Email","email","ramesh@farm.in","email")}
                {inp("Phone (optional)","phone","+91 98765 43210","tel")}
                {inp("Password","password","Minimum 6 characters","password")}
              </div>
              <div style={{ display:"flex",gap:10 }}>
                <button onClick={() => setStep(1)} style={{ flex:1,padding:12,borderRadius:8,background:"transparent",color:d.text,fontFamily:PJS,fontWeight:600,fontSize:14,border:`1.5px solid ${d.border}`,cursor:"pointer" }}>Back</button>
                <button onClick={() => setStep(3)} disabled={!form.name||!form.email||!form.password} style={{ flex:2,padding:12,borderRadius:8,background:!form.name||!form.email?"#dfc0b5":"#c4501a",color:"#fff",fontFamily:PJS,fontWeight:700,fontSize:14,border:"none",cursor:!form.name||!form.email?"not-allowed":"pointer" }}>Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Farm details (farmer) or expertise (expert) */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily:PJS,fontWeight:700,fontSize:20,color:d.text,margin:"0 0 22px" }}>
                {role==="farmer" ? "Your farm details" : "Your expertise"}
              </h2>
              {role === "farmer" ? (
                <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:24 }}>
                  <div>
                    <label style={{ fontFamily:MRP,fontWeight:600,fontSize:13,color:d.textSub,display:"block",marginBottom:6 }}>State</label>
                    <select value={form.state} onChange={e => set("state",e.target.value)} style={{ width:"100%",padding:"11px 14px",borderRadius:8,border:`1.5px solid ${d.border}`,background:isDark?"rgba(255,248,245,0.05)":"#feeade",color:d.text,fontFamily:MRP,fontSize:14,outline:"none",boxSizing:"border-box" }}>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  {inp("District","district","e.g. Nashik")}
                  {inp("Village (optional)","village","e.g. Igatpuri")}
                  {inp("Farm Size (acres)","farmSize","e.g. 5")}
                  <div>
                    <label style={{ fontFamily:MRP,fontWeight:600,fontSize:13,color:d.textSub,display:"block",marginBottom:10 }}>Main Crops (select all that apply)</label>
                    <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                      {CROPS.map(c => {
                        const sel = form.crops.includes(c);
                        return (
                          <button key={c} onClick={() => toggleCrop(c)} style={{ padding:"6px 14px",borderRadius:999,border:`1.5px solid ${sel?"#c4501a":d.border}`,background:sel?"rgba(196,80,26,0.1)":"transparent",color:sel?"#c4501a":d.textSub,fontFamily:MRP,fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.15s" }}>
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:24 }}>
                  {inp("Specialization","district","e.g. Plant Pathology")}
                  {inp("Years of Experience","farmSize","e.g. 8")}
                  {inp("Organization (optional)","village","e.g. ICAR, Nashik")}
                </div>
              )}
              <div style={{ display:"flex",gap:10 }}>
                <button onClick={() => setStep(2)} style={{ flex:1,padding:12,borderRadius:8,background:"transparent",color:d.text,fontFamily:PJS,fontWeight:600,fontSize:14,border:`1.5px solid ${d.border}`,cursor:"pointer" }}>Back</button>
                <button onClick={handleSubmit} disabled={loading} style={{ flex:2,padding:12,borderRadius:8,background:loading?"#dfc0b5":"#c4501a",color:"#fff",fontFamily:PJS,fontWeight:700,fontSize:14,border:"none",cursor:loading?"not-allowed":"pointer" }}>
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign:"center",fontFamily:MRP,fontSize:13,color:d.textMuted,marginTop:18 }}>
          Already have an account?{" "}
          <button onClick={() => router.push("/login")} style={{ background:"transparent",border:"none",cursor:"pointer",color:"#c4501a",fontFamily:PJS,fontWeight:700,fontSize:13 }}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
