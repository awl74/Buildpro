import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = {
  bg: "#0d1117",
  surface: "#161b24",
  card: "#1c2333",
  cardHover: "#222c3f",
  border: "#28354d",
  accent: "#f59e0b",
  accentLight: "#fcd34d",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#a855f7",
  text: "#e2e8f0",
  muted: "#64748b",
  white: "#ffffff",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  html, body, #root { height: 100%; background: ${G.bg}; color: ${G.text}; font-family: 'Inter', sans-serif; overscroll-behavior: none; }
  
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${G.border}; border-radius: 4px; }

  input, textarea, select {
    background: ${G.bg};
    color: ${G.text};
    border: 1.5px solid ${G.border};
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 16px; /* prevents iOS zoom */
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
  }
  input:focus, textarea:focus, select:focus {
    border-color: ${G.accent};
    box-shadow: 0 0 0 3px ${G.accent}22;
  }
  input[type="number"] { -moz-appearance: textfield; }
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; }
  textarea { resize: none; }
  select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%2364748b' d='M1 1l5 5 5-5'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
  select option { background: ${G.card}; }
  button { cursor: pointer; font-family: 'Inter', sans-serif; -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
  
  @media (max-width: 768px) {
    .hide-mobile { display: none !important; }
    .show-mobile { display: flex !important; }
  }
  @media (min-width: 769px) {
    .hide-desktop { display: none !important; }
  }

  .tap-card { transition: background .15s, transform .1s; }
  .tap-card:active { background: ${G.cardHover} !important; transform: scale(0.985); }
  
  .slide-up { animation: slideUp .25s cubic-bezier(.32,.72,0,1); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

  .fade-in { animation: fadeIn .2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`;

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
const fmtExact = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
const today = () => new Date().toISOString().split("T")[0];
const uid = () => Math.random().toString(36).slice(2, 9);
const useIsMobile = () => {
  const [mobile, setMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style = {}, disabled, fullWidth }) => {
  const variants = {
    primary: { background: G.accent, color: "#000", fontWeight: 700 },
    ghost: { background: "transparent", color: G.text, border: `1.5px solid ${G.border}` },
    danger: { background: G.red + "22", color: G.red, border: `1.5px solid ${G.red}44` },
    success: { background: G.green + "22", color: G.green, border: `1.5px solid ${G.green}44` },
    blue: { background: G.blue + "22", color: G.blue, border: `1.5px solid ${G.blue}44` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 20px", borderRadius: 12, fontWeight: 600, fontSize: 15,
        border: "none", transition: "all .15s", letterSpacing: ".2px",
        opacity: disabled ? .4 : 1, display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6, width: fullWidth ? "100%" : "auto", minHeight: 46,
        ...variants[variant], ...style,
      }}
    >
      {children}
    </button>
  );
};

const Card = ({ children, style = {}, onClick, className = "" }) => (
  <div
    className={`${onClick ? "tap-card" : ""} ${className}`}
    onClick={onClick}
    style={{
      background: G.card, border: `1px solid ${G.border}`, borderRadius: 14,
      padding: 18, ...style,
    }}
  >
    {children}
  </div>
);

const Label = ({ children, style = {} }) => (
  <div style={{ fontSize: 12, fontWeight: 600, color: G.muted, textTransform: "uppercase", letterSpacing: ".9px", marginBottom: 6, ...style }}>
    {children}
  </div>
);

const Field = ({ label, value, onChange, type = "text", placeholder = "", multiline, rows = 3, min, step }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <Label>{label}</Label>}
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
      : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} min={min} step={step} inputMode={type === "number" ? "decimal" : undefined} />}
  </div>
);

const Badge = ({ children, color = G.accent }) => (
  <span style={{
    background: color + "22", color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
  }}>
    {children}
  </span>
);

const Divider = () => <div style={{ height: 1, background: G.border, margin: "16px 0" }} />;

const AmountPill = ({ label, value, color = G.text }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 11, color: G.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: .8, marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, fontWeight: 700, color }}>{fmt(value)}</div>
  </div>
);

// ─── BOTTOM NAV (mobile) ──────────────────────────────────────────────────────
const NAV = [
  { id: "estimate", icon: "📐", label: "Estimate" },
  { id: "contract", icon: "📋", label: "Contract" },
  { id: "projects", icon: "🏗️", label: "Projects" },
  { id: "invoices", icon: "💰", label: "Invoices" },
];

const BottomNav = ({ active, setActive, counts }) => (
  <div style={{
    position: "fixed", bottom: 0, left: 0, right: 0, height: 72,
    background: G.surface, borderTop: `1px solid ${G.border}`,
    display: "flex", zIndex: 100,
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
  }}>
    {NAV.map(n => (
      <button
        key={n.id}
        onClick={() => setActive(n.id)}
        style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 3, background: "none", border: "none",
          color: active === n.id ? G.accent : G.muted, transition: "color .15s",
          position: "relative", padding: "8px 0",
        }}
      >
        <div style={{ fontSize: 22, lineHeight: 1 }}>{n.icon}</div>
        <div style={{ fontSize: 10, fontWeight: active === n.id ? 700 : 500, letterSpacing: .3 }}>{n.label}</div>
        {counts[n.id] > 0 && (
          <div style={{
            position: "absolute", top: 6, right: "calc(50% - 20px)",
            background: G.accent, color: "#000", borderRadius: 10,
            width: 16, height: 16, fontSize: 9, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{counts[n.id]}</div>
        )}
      </button>
    ))}
  </div>
);

// ─── DESKTOP SIDEBAR ─────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, counts }) => (
  <div style={{ display: "flex", flexDirection: "column", padding: "28px 0", flex: 1 }}>
    <div style={{ padding: "0 24px 28px" }}>
      <div style={{ fontFamily: "'Bebas Neue'", fontSize: 28, color: G.accent, letterSpacing: 2 }}>⚒ BuildPro</div>
      <div style={{ fontSize: 11, color: G.muted, letterSpacing: .5, marginTop: 2 }}>Construction Suite</div>
    </div>
    {NAV.map(n => (
      <button key={n.id} onClick={() => setActive(n.id)} style={{
        display: "flex", alignItems: "center", gap: 12, padding: "13px 24px",
        background: active === n.id ? G.accent + "18" : "transparent",
        borderLeft: active === n.id ? `3px solid ${G.accent}` : "3px solid transparent",
        border: "none", color: active === n.id ? G.accent : G.muted,
        fontWeight: active === n.id ? 600 : 400, fontSize: 15, transition: "all .15s", textAlign: "left",
      }}>
        <span style={{ fontSize: 20 }}>{n.icon}</span>
        <span>{n.label}</span>
        {counts[n.id] > 0 && (
          <span style={{
            marginLeft: "auto", background: G.accent, color: "#000",
            borderRadius: 12, padding: "1px 8px", fontSize: 11, fontWeight: 800,
          }}>{counts[n.id]}</span>
        )}
      </button>
    ))}
  </div>
);

// ─── MOBILE PAGE HEADER ───────────────────────────────────────────────────────
const MobileHeader = ({ title, onBack, right }) => (
  <div style={{
    position: "sticky", top: 0, zIndex: 50, background: G.surface,
    borderBottom: `1px solid ${G.border}`, padding: "14px 18px",
    display: "flex", alignItems: "center", gap: 12, minHeight: 58,
  }}>
    {onBack && (
      <button onClick={onBack} style={{
        background: G.card, border: `1px solid ${G.border}`, borderRadius: 10,
        width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, color: G.text, flexShrink: 0,
      }}>←</button>
    )}
    <div style={{ flex: 1, fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 1, color: G.accent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</div>
    {right && <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>{right}</div>}
  </div>
);

// ─── SECTION TITLE ────────────────────────────────────────────────────────────
const SectionTitle = ({ title, sub, action }) => (
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
    <div>
      <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 1, color: G.accent, lineHeight: 1 }}>{title}</h2>
      {sub && <p style={{ color: G.muted, fontSize: 13, marginTop: 3 }}>{sub}</p>}
    </div>
    {action}
  </div>
);

// ─── DOCUMENT EXPORT UTILITY ─────────────────────────────────────────────────
// Works on iPad/Safari: creates a blob URL, opens it in a new tab so the
// user can Print (⌘P / Share → Print) or use the browser's "Save as PDF".
// Falls back to a direct download link if popups are blocked.
const openDocWindow = (html, filename = "document") => {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Try opening a new tab (works in most browsers & iPad Safari when user triggers it)
  const newTab = window.open(url, "_blank");

  if (!newTab || newTab.closed || typeof newTab.closed === "undefined") {
    // Popup blocked — fall back to download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename.replace(/[^a-z0-9_\-]/gi, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("Your document has been downloaded as an HTML file.\n\nTo convert to PDF:\n1. Open the downloaded file in Safari\n2. Tap Share → Print\n3. Pinch-zoom the preview → tap Share → Save as PDF");
  }

  // Clean up the blob URL after 60s
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

// ═══════════════════════════════════════════════════════════════════════════════
// ESTIMATOR
// ═══════════════════════════════════════════════════════════════════════════════
// CSI MasterFormat Divisions + Sub-Divisions
const DIVISIONS = [
  { div: "00", label: "Procurement & Contracting", subs: [
    { code: "00 10 00", label: "Solicitation" }, { code: "00 20 00", label: "Instructions" },
    { code: "00 40 00", label: "Procurement Forms" }, { code: "00 50 00", label: "Contracting Forms" },
    { code: "00 60 00", label: "Project Forms" }, { code: "00 70 00", label: "Conditions of the Contract" },
    { code: "00 90 00", label: "Revisions, Clarifications & Modifications" },
  ]},
  { div: "01", label: "General Requirements", subs: [
    { code: "01 10 00", label: "Summary" }, { code: "01 20 00", label: "Price & Payment Procedures" },
    { code: "01 30 00", label: "Administrative Requirements" }, { code: "01 40 00", label: "Quality Requirements" },
    { code: "01 50 00", label: "Temporary Facilities & Controls" }, { code: "01 60 00", label: "Product Requirements" },
    { code: "01 70 00", label: "Execution & Closeout" }, { code: "01 80 00", label: "Performance Requirements" },
  ]},
  { div: "02", label: "Existing Conditions", subs: [
    { code: "02 20 00", label: "Assessment" }, { code: "02 30 00", label: "Subsurface Investigation" },
    { code: "02 40 00", label: "Demolition & Structure Moving" }, { code: "02 50 00", label: "Site Remediation" },
    { code: "02 60 00", label: "Contaminated Site Material Removal" }, { code: "02 80 00", label: "Facility Remediation" },
  ]},
  { div: "03", label: "Concrete", subs: [
    { code: "03 10 00", label: "Concrete Forming & Accessories" }, { code: "03 20 00", label: "Concrete Reinforcing" },
    { code: "03 30 00", label: "Cast-in-Place Concrete" }, { code: "03 40 00", label: "Precast Concrete" },
    { code: "03 50 00", label: "Cast Decks & Underlayment" }, { code: "03 60 00", label: "Grouting" },
    { code: "03 70 00", label: "Mass Concrete" }, { code: "03 80 00", label: "Concrete Cutting & Boring" },
  ]},
  { div: "04", label: "Masonry", subs: [
    { code: "04 20 00", label: "Unit Masonry" }, { code: "04 40 00", label: "Stone Assemblies" },
    { code: "04 50 00", label: "Refractory Masonry" }, { code: "04 60 00", label: "Corrosion-Resistant Masonry" },
    { code: "04 70 00", label: "Manufactured Masonry" },
  ]},
  { div: "05", label: "Metals", subs: [
    { code: "05 10 00", label: "Structural Metal Framing" }, { code: "05 20 00", label: "Metal Joists" },
    { code: "05 30 00", label: "Metal Decking" }, { code: "05 40 00", label: "Cold-Formed Metal Framing" },
    { code: "05 50 00", label: "Metal Fabrications" }, { code: "05 70 00", label: "Decorative Metal" },
  ]},
  { div: "06", label: "Wood, Plastics & Composites", subs: [
    { code: "06 10 00", label: "Rough Carpentry" }, { code: "06 20 00", label: "Finish Carpentry" },
    { code: "06 40 00", label: "Architectural Woodwork" }, { code: "06 50 00", label: "Structural Plastics" },
    { code: "06 60 00", label: "Plastic Fabrications" }, { code: "06 70 00", label: "Structural Composites" },
  ]},
  { div: "07", label: "Thermal & Moisture Protection", subs: [
    { code: "07 10 00", label: "Dampproofing & Waterproofing" }, { code: "07 20 00", label: "Thermal Protection" },
    { code: "07 30 00", label: "Steep Slope Roofing" }, { code: "07 40 00", label: "Roofing & Siding Panels" },
    { code: "07 50 00", label: "Membrane Roofing" }, { code: "07 60 00", label: "Flashing & Sheet Metal" },
    { code: "07 70 00", label: "Roof & Wall Specialties & Accessories" }, { code: "07 80 00", label: "Fire & Smoke Protection" },
    { code: "07 90 00", label: "Joint Protection" },
  ]},
  { div: "08", label: "Openings", subs: [
    { code: "08 10 00", label: "Doors & Frames" }, { code: "08 20 00", label: "Windows" },
    { code: "08 30 00", label: "Specialty Doors & Frames" }, { code: "08 40 00", label: "Entrances, Storefronts & Curtain Walls" },
    { code: "08 50 00", label: "Windows" }, { code: "08 60 00", label: "Roof Windows & Skylights" },
    { code: "08 70 00", label: "Hardware" }, { code: "08 80 00", label: "Glazing" },
    { code: "08 90 00", label: "Louvers & Vents" },
  ]},
  { div: "09", label: "Finishes", subs: [
    { code: "09 20 00", label: "Plaster & Gypsum Board" }, { code: "09 30 00", label: "Tiling" },
    { code: "09 50 00", label: "Ceilings" }, { code: "09 60 00", label: "Flooring" },
    { code: "09 70 00", label: "Wall Finishes" }, { code: "09 80 00", label: "Acoustic Treatment" },
    { code: "09 90 00", label: "Paints & Coatings" },
  ]},
  { div: "10", label: "Specialties", subs: [
    { code: "10 10 00", label: "Information Specialties" }, { code: "10 20 00", label: "Interior Specialties" },
    { code: "10 40 00", label: "Safety Specialties" }, { code: "10 50 00", label: "Storage Specialties" },
    { code: "10 70 00", label: "Exterior Specialties" }, { code: "10 80 00", label: "Other Specialties" },
  ]},
  { div: "11", label: "Equipment", subs: [
    { code: "11 10 00", label: "Vehicle & Pedestrian Equipment" }, { code: "11 20 00", label: "Commercial Equipment" },
    { code: "11 30 00", label: "Residential Equipment" }, { code: "11 40 00", label: "Foodservice Equipment" },
    { code: "11 50 00", label: "Educational & Scientific Equipment" }, { code: "11 70 00", label: "Healthcare Equipment" },
  ]},
  { div: "12", label: "Furnishings", subs: [
    { code: "12 10 00", label: "Art" }, { code: "12 20 00", label: "Window Treatments" },
    { code: "12 30 00", label: "Casework" }, { code: "12 40 00", label: "Furnishings & Accessories" },
    { code: "12 60 00", label: "Multiple Seating" }, { code: "12 90 00", label: "Other Furnishings" },
  ]},
  { div: "13", label: "Special Construction", subs: [
    { code: "13 10 00", label: "Special Facility Components" }, { code: "13 20 00", label: "Special Purpose Rooms" },
    { code: "13 30 00", label: "Special Structures" }, { code: "13 40 00", label: "Integrated Construction" },
    { code: "13 50 00", label: "Special Instrumentation" },
  ]},
  { div: "14", label: "Conveying Equipment", subs: [
    { code: "14 10 00", label: "Dumbwaiters" }, { code: "14 20 00", label: "Elevators" },
    { code: "14 30 00", label: "Escalators & Moving Walks" }, { code: "14 40 00", label: "Lifts" },
    { code: "14 70 00", label: "Turntables" }, { code: "14 80 00", label: "Scaffolding" },
  ]},
  { div: "21", label: "Fire Suppression", subs: [
    { code: "21 10 00", label: "Water-Based Fire Suppression" }, { code: "21 20 00", label: "Fire Extinguishing" },
    { code: "21 30 00", label: "Fire Pumps" }, { code: "21 40 00", label: "Fire Suppression Water Storage" },
  ]},
  { div: "22", label: "Plumbing", subs: [
    { code: "22 05 00", label: "Common Work Results for Plumbing" }, { code: "22 10 00", label: "Plumbing Piping & Pumps" },
    { code: "22 30 00", label: "Plumbing Equipment" }, { code: "22 40 00", label: "Plumbing Fixtures" },
    { code: "22 50 00", label: "Pool & Fountain Plumbing" }, { code: "22 60 00", label: "Gas & Vacuum Systems" },
    { code: "22 70 00", label: "Drinking Water Treatment" },
  ]},
  { div: "23", label: "HVAC", subs: [
    { code: "23 05 00", label: "Common Work Results for HVAC" }, { code: "23 07 00", label: "HVAC Insulation" },
    { code: "23 09 00", label: "Instrumentation & Control" }, { code: "23 20 00", label: "HVAC Piping & Pumps" },
    { code: "23 30 00", label: "HVAC Air Distribution" }, { code: "23 40 00", label: "HVAC Air Cleaning" },
    { code: "23 50 00", label: "Central Heating Equipment" }, { code: "23 60 00", label: "Central Cooling Equipment" },
    { code: "23 70 00", label: "Central HVAC Equipment" }, { code: "23 80 00", label: "Decentralized HVAC Equipment" },
  ]},
  { div: "25", label: "Integrated Automation", subs: [
    { code: "25 10 00", label: "Integrated Automation Network" }, { code: "25 30 00", label: "Integrated Automation Instrumentation" },
    { code: "25 50 00", label: "Integrated Automation Facility Controls" }, { code: "25 90 00", label: "Integrated Automation Control Sequences" },
  ]},
  { div: "26", label: "Electrical", subs: [
    { code: "26 05 00", label: "Common Work Results for Electrical" }, { code: "26 09 00", label: "Instrumentation & Control" },
    { code: "26 10 00", label: "Medium-Voltage Electrical Distribution" }, { code: "26 20 00", label: "Low-Voltage Electrical Transmission" },
    { code: "26 24 00", label: "Switchboards, Switchgear & Panelboards" }, { code: "26 27 00", label: "Low-Voltage Distribution Equipment" },
    { code: "26 28 00", label: "Low-Voltage Circuit Protective Devices" }, { code: "26 29 00", label: "Low-Voltage Controllers" },
    { code: "26 30 00", label: "Facility Power Generation" }, { code: "26 40 00", label: "Electrical & Cathodic Protection" },
    { code: "26 50 00", label: "Lighting" }, { code: "26 60 00", label: "Electrical Utilities" },
  ]},
  { div: "27", label: "Communications", subs: [
    { code: "27 05 00", label: "Common Work Results for Communications" }, { code: "27 10 00", label: "Structured Cabling" },
    { code: "27 20 00", label: "Data Communications" }, { code: "27 30 00", label: "Voice Communications" },
    { code: "27 40 00", label: "Audio-Video Communications" }, { code: "27 50 00", label: "Distributed Communications" },
  ]},
  { div: "28", label: "Electronic Safety & Security", subs: [
    { code: "28 10 00", label: "Electronic Access Control & Intrusion Detection" }, { code: "28 20 00", label: "Electronic Surveillance" },
    { code: "28 30 00", label: "Electronic Detection & Alarm" }, { code: "28 40 00", label: "Electronic Monitoring & Control" },
  ]},
  { div: "31", label: "Earthwork", subs: [
    { code: "31 10 00", label: "Site Clearing" }, { code: "31 20 00", label: "Earth Moving" },
    { code: "31 30 00", label: "Earthwork Methods" }, { code: "31 40 00", label: "Shoring & Underpinning" },
    { code: "31 50 00", label: "Excavation Support & Protection" }, { code: "31 60 00", label: "Special Foundations & Load-Bearing Elements" },
    { code: "31 70 00", label: "Tunneling & Mining" },
  ]},
  { div: "32", label: "Exterior Improvements", subs: [
    { code: "32 10 00", label: "Bases, Ballasts & Paving" }, { code: "32 12 00", label: "Flexible Paving" },
    { code: "32 13 00", label: "Rigid Paving" }, { code: "32 17 00", label: "Paving Specialties" },
    { code: "32 30 00", label: "Site Improvements" }, { code: "32 40 00", label: "Planting Irrigation" },
    { code: "32 70 00", label: "Wetlands" }, { code: "32 80 00", label: "Irrigation" },
    { code: "32 90 00", label: "Planting" },
  ]},
  { div: "33", label: "Utilities", subs: [
    { code: "33 10 00", label: "Water Utilities" }, { code: "33 20 00", label: "Wells" },
    { code: "33 30 00", label: "Sanitary Sewerage" }, { code: "33 40 00", label: "Storm Drainage" },
    { code: "33 50 00", label: "Fuel Distribution" }, { code: "33 70 00", label: "Electrical Utilities" },
    { code: "33 80 00", label: "Communications Utilities" },
  ]},
  { div: "34", label: "Transportation", subs: [
    { code: "34 10 00", label: "Guideways & Trackwork" }, { code: "34 20 00", label: "Traction Power" },
    { code: "34 40 00", label: "Transportation Signaling & Control" }, { code: "34 70 00", label: "Transportation Construction & Equipment" },
  ]},
  { div: "35", label: "Waterway & Marine", subs: [
    { code: "35 20 00", label: "Waterway & Marine Construction" }, { code: "35 30 00", label: "Coastal Construction" },
    { code: "35 40 00", label: "Waterway Construction & Equipment" }, { code: "35 50 00", label: "Marine Construction & Equipment" },
  ]},
  { div: "40", label: "Process Integration", subs: [
    { code: "40 05 00", label: "Common Work Results for Process Integration" }, { code: "40 10 00", label: "Gas & Vapor Process Piping" },
    { code: "40 20 00", label: "Liquid Process Piping" }, { code: "40 30 00", label: "Solid & Mixed Material Piping" },
  ]},
  { div: "48", label: "Electrical Power Generation", subs: [
    { code: "48 10 00", label: "Electrical Power Generation Equipment" }, { code: "48 14 00", label: "Solar Energy Electrical Power Generation" },
    { code: "48 15 00", label: "Wind Energy Electrical Power Generation" }, { code: "48 70 00", label: "Electrical Power Generation Testing" },
  ]},
];

const CATEGORIES = DIVISIONS.map(d => `Div ${d.div} – ${d.label}`);
const getSubsForCategory = (cat) => {
  const divNum = cat?.match(/Div (\d+)/)?.[1];
  const found = DIVISIONS.find(d => d.div === divNum);
  return found?.subs || [];
};
const UNITS = ["hr", "sqft", "lf", "ea", "day", "ls", "ton", "cy"];

// ─── RSMeans-Style Reference Pricing Database ─────────────────────────────────
// National average unit costs (2024 USD). Low/avg/high per sub-division code.
// Sources: RSMeans Building Construction Cost Data, Gordian, NAHB estimates.
const PRICE_DB = {
  // Div 01 General Requirements
  "01 10 00": { low: 1.20, avg: 2.50, high: 4.00, unit: "sqft", desc: "General conditions & supervision" },
  "01 30 00": { low: 0.80, avg: 1.50, high: 2.50, unit: "sqft", desc: "Project administration" },
  "01 50 00": { low: 0.50, avg: 1.20, high: 2.00, unit: "sqft", desc: "Temporary facilities" },
  // Div 02 Existing Conditions
  "02 20 00": { low: 0.30, avg: 0.65, high: 1.20, unit: "sqft", desc: "Environmental assessment" },
  "02 40 00": { low: 3.50, avg: 7.00, high: 14.00, unit: "sqft", desc: "Selective demolition" },
  "02 50 00": { low: 8.00, avg: 18.00, high: 35.00, unit: "sqft", desc: "Site remediation" },
  // Div 03 Concrete
  "03 10 00": { low: 1.80, avg: 3.20, high: 5.50, unit: "sqft", desc: "Concrete forming" },
  "03 20 00": { low: 0.90, avg: 1.40, high: 2.10, unit: "lb", desc: "Rebar / reinforcing steel" },
  "03 30 00": { low: 110, avg: 145, high: 190, unit: "cy", desc: "Cast-in-place concrete" },
  "03 40 00": { low: 6.50, avg: 10.00, high: 16.00, unit: "sqft", desc: "Precast concrete" },
  "03 50 00": { low: 2.80, avg: 4.50, high: 7.00, unit: "sqft", desc: "Concrete decks & underlayment" },
  "03 60 00": { low: 0.40, avg: 0.75, high: 1.30, unit: "lb", desc: "Grouting" },
  "03 80 00": { low: 4.00, avg: 7.50, high: 13.00, unit: "lf", desc: "Concrete cutting & boring" },
  // Div 04 Masonry
  "04 20 00": { low: 9.00, avg: 14.50, high: 22.00, unit: "sqft", desc: "Unit masonry / CMU block" },
  "04 40 00": { low: 18.00, avg: 28.00, high: 45.00, unit: "sqft", desc: "Stone assemblies" },
  // Div 05 Metals
  "05 10 00": { low: 18.00, avg: 26.00, high: 40.00, unit: "sqft", desc: "Structural steel framing" },
  "05 20 00": { low: 4.50, avg: 7.00, high: 11.00, unit: "sqft", desc: "Metal joists" },
  "05 30 00": { low: 3.00, avg: 4.80, high: 7.50, unit: "sqft", desc: "Metal decking" },
  "05 40 00": { low: 2.80, avg: 4.50, high: 7.00, unit: "sqft", desc: "Cold-formed metal framing" },
  "05 50 00": { low: 12.00, avg: 20.00, high: 35.00, unit: "ea", desc: "Metal fabrications / misc iron" },
  // Div 06 Wood, Plastics & Composites
  "06 10 00": { low: 4.50, avg: 7.00, high: 11.00, unit: "sqft", desc: "Rough carpentry / framing" },
  "06 20 00": { low: 3.50, avg: 6.00, high: 10.00, unit: "lf", desc: "Finish carpentry / trim" },
  "06 40 00": { low: 180, avg: 320, high: 550, unit: "lf", desc: "Custom cabinetry / millwork" },
  "06 60 00": { low: 2.50, avg: 4.20, high: 7.00, unit: "sqft", desc: "Plastic fabrications" },
  // Div 07 Thermal & Moisture
  "07 10 00": { low: 1.20, avg: 2.20, high: 4.00, unit: "sqft", desc: "Waterproofing / dampproofing" },
  "07 20 00": { low: 0.80, avg: 1.60, high: 3.00, unit: "sqft", desc: "Insulation (batt/blown)" },
  "07 30 00": { low: 3.50, avg: 5.50, high: 9.00, unit: "sqft", desc: "Steep slope roofing (shingles)" },
  "07 40 00": { low: 4.00, avg: 7.00, high: 12.00, unit: "sqft", desc: "Roofing / siding panels" },
  "07 50 00": { low: 5.00, avg: 8.50, high: 14.00, unit: "sqft", desc: "Membrane roofing (TPO/EPDM)" },
  "07 60 00": { low: 2.50, avg: 4.50, high: 8.00, unit: "lf", desc: "Flashing & sheet metal" },
  "07 80 00": { low: 1.80, avg: 3.00, high: 5.00, unit: "sqft", desc: "Fire & smoke protection" },
  "07 90 00": { low: 1.00, avg: 1.80, high: 3.20, unit: "lf", desc: "Joint sealants & caulking" },
  // Div 08 Openings
  "08 10 00": { low: 350, avg: 650, high: 1200, unit: "ea", desc: "Interior doors & frames" },
  "08 20 00": { low: 280, avg: 550, high: 1100, unit: "ea", desc: "Windows (vinyl/aluminum)" },
  "08 30 00": { low: 800, avg: 1800, high: 4500, unit: "ea", desc: "Specialty doors (garage, fire)" },
  "08 40 00": { low: 55, avg: 90, high: 145, unit: "sqft", desc: "Storefront / curtain wall" },
  "08 60 00": { low: 280, avg: 480, high: 900, unit: "ea", desc: "Skylights" },
  "08 70 00": { low: 180, avg: 320, high: 600, unit: "ea", desc: "Door hardware sets" },
  "08 80 00": { low: 8.50, avg: 14.00, high: 22.00, unit: "sqft", desc: "Glazing (standard)" },
  // Div 09 Finishes
  "09 20 00": { low: 1.80, avg: 3.00, high: 5.00, unit: "sqft", desc: "Drywall / gypsum board installed" },
  "09 30 00": { low: 5.00, avg: 9.50, high: 18.00, unit: "sqft", desc: "Tile (floor or wall)" },
  "09 50 00": { low: 2.50, avg: 4.50, high: 8.00, unit: "sqft", desc: "Suspended ceilings (ACT)" },
  "09 60 00": { low: 3.00, avg: 6.00, high: 12.00, unit: "sqft", desc: "Flooring (LVP / hardwood)" },
  "09 70 00": { low: 1.50, avg: 2.80, high: 5.00, unit: "sqft", desc: "Wall coverings / finishes" },
  "09 80 00": { low: 2.00, avg: 3.80, high: 6.50, unit: "sqft", desc: "Acoustic treatment" },
  "09 90 00": { low: 0.80, avg: 1.60, high: 2.80, unit: "sqft", desc: "Painting & coatings" },
  // Div 10 Specialties
  "10 10 00": { low: 200, avg: 450, high: 900, unit: "ea", desc: "Signage" },
  "10 20 00": { low: 120, avg: 280, high: 600, unit: "ea", desc: "Partitions / lockers" },
  "10 40 00": { low: 180, avg: 350, high: 700, unit: "ea", desc: "Safety specialties / AED" },
  "10 50 00": { low: 280, avg: 550, high: 1100, unit: "ea", desc: "Storage specialties / shelving" },
  // Div 11 Equipment
  "11 30 00": { low: 600, avg: 1200, high: 2800, unit: "ea", desc: "Residential appliances" },
  "11 40 00": { low: 2500, avg: 5500, high: 12000, unit: "ea", desc: "Foodservice equipment" },
  // Div 12 Furnishings
  "12 20 00": { low: 35, avg: 75, high: 160, unit: "ea", desc: "Window blinds / treatments" },
  "12 30 00": { low: 200, avg: 380, high: 700, unit: "lf", desc: "Casework / base cabinets" },
  // Div 13 Special Construction
  "13 20 00": { low: 85, avg: 150, high: 260, unit: "sqft", desc: "Clean rooms / special purpose rooms" },
  // Div 14 Conveying
  "14 20 00": { low: 28000, avg: 45000, high: 85000, unit: "ea", desc: "Elevator (hydraulic)" },
  // Div 21 Fire Suppression
  "21 10 00": { low: 2.50, avg: 4.00, high: 6.50, unit: "sqft", desc: "Sprinkler system (wet pipe)" },
  "21 30 00": { low: 8500, avg: 14000, high: 24000, unit: "ea", desc: "Fire pump" },
  // Div 22 Plumbing
  "22 05 00": { low: 4.50, avg: 8.00, high: 14.00, unit: "sqft", desc: "Plumbing rough-in" },
  "22 10 00": { low: 12.00, avg: 20.00, high: 35.00, unit: "lf", desc: "Plumbing piping (supply/drain)" },
  "22 30 00": { low: 900, avg: 1600, high: 3000, unit: "ea", desc: "Water heater installed" },
  "22 40 00": { low: 350, avg: 650, high: 1400, unit: "ea", desc: "Plumbing fixtures installed" },
  "22 60 00": { low: 8.00, avg: 14.00, high: 24.00, unit: "lf", desc: "Gas piping" },
  // Div 23 HVAC
  "23 05 00": { low: 6.00, avg: 10.00, high: 16.00, unit: "sqft", desc: "HVAC rough-in" },
  "23 07 00": { low: 1.20, avg: 2.20, high: 3.80, unit: "sqft", desc: "HVAC insulation / duct wrap" },
  "23 09 00": { low: 2.00, avg: 3.80, high: 6.50, unit: "sqft", desc: "Controls & thermostats" },
  "23 20 00": { low: 14.00, avg: 22.00, high: 38.00, unit: "lf", desc: "Hydronic piping & pumps" },
  "23 30 00": { low: 4.00, avg: 7.00, high: 12.00, unit: "sqft", desc: "Ductwork installed" },
  "23 50 00": { low: 2800, avg: 5500, high: 11000, unit: "ea", desc: "Boiler / heating unit" },
  "23 60 00": { low: 2200, avg: 4500, high: 9000, unit: "ea", desc: "Chiller / cooling unit" },
  "23 70 00": { low: 3500, avg: 7000, high: 14000, unit: "ea", desc: "RTU / packaged HVAC unit" },
  "23 80 00": { low: 1800, avg: 3800, high: 8000, unit: "ea", desc: "Split system / mini-split" },
  // Div 26 Electrical
  "26 05 00": { low: 5.00, avg: 9.00, high: 16.00, unit: "sqft", desc: "Electrical rough-in / wiring" },
  "26 20 00": { low: 8.00, avg: 14.00, high: 24.00, unit: "lf", desc: "Conduit & wire" },
  "26 24 00": { low: 1200, avg: 2200, high: 4500, unit: "ea", desc: "Panel / switchboard installed" },
  "26 27 00": { low: 180, avg: 320, high: 600, unit: "ea", desc: "Distribution equipment" },
  "26 28 00": { low: 120, avg: 220, high: 420, unit: "ea", desc: "Circuit breakers / devices" },
  "26 29 00": { low: 280, avg: 520, high: 1100, unit: "ea", desc: "Motor controls / VFDs" },
  "26 50 00": { low: 3.50, avg: 6.00, high: 10.00, unit: "sqft", desc: "Lighting (LED fixtures)" },
  // Div 27 Communications
  "27 05 00": { low: 1.50, avg: 2.80, high: 5.00, unit: "sqft", desc: "Low-voltage rough-in" },
  "27 10 00": { low: 0.80, avg: 1.60, high: 3.00, unit: "sqft", desc: "Structured cabling / data" },
  "27 40 00": { low: 2.50, avg: 4.50, high: 8.00, unit: "sqft", desc: "AV / audio-video systems" },
  // Div 28 Security
  "28 10 00": { low: 1.80, avg: 3.50, high: 6.50, unit: "sqft", desc: "Access control / intrusion" },
  "28 20 00": { low: 800, avg: 1500, high: 3200, unit: "ea", desc: "Security cameras (per camera)" },
  "28 30 00": { low: 1.20, avg: 2.20, high: 4.00, unit: "sqft", desc: "Fire alarm system" },
  // Div 31 Earthwork
  "31 10 00": { low: 0.40, avg: 0.80, high: 1.60, unit: "sqft", desc: "Site clearing / grubbing" },
  "31 20 00": { low: 18.00, avg: 32.00, high: 58.00, unit: "cy", desc: "Excavation / grading" },
  "31 40 00": { low: 22.00, avg: 40.00, high: 75.00, unit: "lf", desc: "Shoring & underpinning" },
  "31 60 00": { low: 28.00, avg: 55.00, high: 110, unit: "lf", desc: "Piles / deep foundations" },
  // Div 32 Exterior Improvements
  "32 10 00": { low: 2.50, avg: 4.50, high: 8.00, unit: "sqft", desc: "Aggregate base / gravel" },
  "32 12 00": { low: 3.50, avg: 6.00, high: 10.00, unit: "sqft", desc: "Asphalt paving" },
  "32 13 00": { low: 6.00, avg: 9.50, high: 15.00, unit: "sqft", desc: "Concrete flatwork / sidewalk" },
  "32 17 00": { low: 1.80, avg: 3.20, high: 5.50, unit: "sqft", desc: "Pavement markings / striping" },
  "32 30 00": { low: 28.00, avg: 55.00, high: 110, unit: "lf", desc: "Fencing / site walls" },
  "32 80 00": { low: 1.20, avg: 2.20, high: 4.00, unit: "sqft", desc: "Irrigation system" },
  "32 90 00": { low: 1.50, avg: 3.00, high: 6.00, unit: "sqft", desc: "Landscaping / planting" },
  // Div 33 Utilities
  "33 10 00": { low: 28.00, avg: 55.00, high: 100, unit: "lf", desc: "Water main / service" },
  "33 30 00": { low: 32.00, avg: 65.00, high: 120, unit: "lf", desc: "Sanitary sewer line" },
  "33 40 00": { low: 22.00, avg: 45.00, high: 85.00, unit: "lf", desc: "Storm drainage pipe" },
  "33 70 00": { low: 18.00, avg: 35.00, high: 65.00, unit: "lf", desc: "Underground electrical" },
};

const getPriceRef = (subCode) => PRICE_DB[subCode] || null;

// Price suggestion badge shown next to unit cost
const PriceBadge = ({ subCode, onApply }) => {
  const ref = getPriceRef(subCode);
  if (!ref) return null;
  return (
    <div style={{
      background: G.blue + "15", border: `1px solid ${G.blue}44`,
      borderRadius: 8, padding: "6px 10px", marginTop: 6,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
    }}>
      <div>
        <div style={{ fontSize: 10, color: G.blue, fontWeight: 700, letterSpacing: .8, textTransform: "uppercase", marginBottom: 2 }}>
          📊 Ref. Avg · {ref.unit}
        </div>
        <div style={{ fontSize: 12, color: G.muted }}>
          <span style={{ color: G.green }}>Low: {fmtExact(ref.low)}</span>
          {"  ·  "}
          <span style={{ color: G.text, fontWeight: 700 }}>Avg: {fmtExact(ref.avg)}</span>
          {"  ·  "}
          <span style={{ color: G.red }}>High: {fmtExact(ref.high)}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {[["Low", ref.low, G.green], ["Avg", ref.avg, G.blue], ["High", ref.high, G.red]].map(([lbl, val, col]) => (
          <button key={lbl} onClick={() => onApply(val, ref.unit)}
            style={{ background: col + "22", border: `1px solid ${col}44`, color: col, borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700 }}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
};

const emptyItem = () => ({ id: uid(), description: "", category: CATEGORIES[1], subDivision: "", qty: 1, unit: "ea", unitCost: 0, markup: 20 });

const LineItemRow = ({ item, onChange, onRemove, isMobile }) => {
  const lineTotal = (parseFloat(item.qty) || 0) * (parseFloat(item.unitCost) || 0) * (1 + (parseFloat(item.markup) || 0) / 100);
  const subs = getSubsForCategory(item.category);
  const priceRef = getPriceRef(item.subDivision);

  const applyPrice = (val, refUnit) => {
    onChange("unitCost", val);
    if (refUnit && UNITS.includes(refUnit)) onChange("unit", refUnit);
  };

  if (isMobile) {
    return (
      <Card style={{ marginBottom: 10, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ flex: 1, marginRight: 8 }}>
            <input value={item.description} onChange={e => onChange("description", e.target.value)}
              placeholder={priceRef?.desc || "Description"} />
          </div>
          <button onClick={onRemove} style={{
            background: G.red + "22", border: `1px solid ${G.red}44`, color: G.red,
            borderRadius: 8, width: 38, height: 38, fontSize: 18, display: "flex",
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>×</button>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Label>Division</Label>
          <select value={item.category} onChange={e => { onChange("category", e.target.value); onChange("subDivision", ""); }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {subs.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <Label>Sub-Division</Label>
            <select value={item.subDivision || ""} onChange={e => onChange("subDivision", e.target.value)}>
              <option value="">— Select sub-division —</option>
              {subs.map(s => <option key={s.code} value={s.code}>{s.code} – {s.label}</option>)}
            </select>
          </div>
        )}
        {/* Price reference badge */}
        {item.subDivision && <PriceBadge subCode={item.subDivision} onApply={applyPrice} />}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8, marginTop: 10 }}>
          <div>
            <Label>Unit</Label>
            <select value={item.unit} onChange={e => onChange("unit", e.target.value)}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div><Label>Markup %</Label><input type="number" value={item.markup} onChange={e => onChange("markup", e.target.value)} min="0" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div><Label>Qty</Label><input type="number" value={item.qty} onChange={e => onChange("qty", e.target.value)} min="0" /></div>
          <div>
            <Label>Unit Cost {priceRef ? `(ref: ${fmtExact(priceRef.avg)}/${priceRef.unit})` : ""}</Label>
            <input type="number" value={item.unitCost} onChange={e => onChange("unitCost", e.target.value)} min="0"
              style={{ borderColor: priceRef && item.unitCost == 0 ? G.blue + "88" : undefined }} />
          </div>
        </div>
        <div style={{ marginTop: 10, textAlign: "right", fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 700, color: G.accent }}>
          {fmtExact(lineTotal)}
        </div>
      </Card>
    );
  }

  // Desktop
  return (
    <>
      <tr style={{ borderBottom: priceRef ? "none" : `1px solid ${G.border}33` }}>
        <td style={{ padding: "6px 4px", verticalAlign: "top", minWidth: 210 }}>
          <select value={item.category} onChange={e => { onChange("category", e.target.value); onChange("subDivision", ""); }}
            style={{ fontSize: 12, padding: "7px 10px", marginBottom: subs.length ? 5 : 0 }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          {subs.length > 0 && (
            <select value={item.subDivision || ""} onChange={e => onChange("subDivision", e.target.value)}
              style={{ fontSize: 11, padding: "6px 10px", color: item.subDivision ? G.text : G.muted, borderColor: G.accent + "66" }}>
              <option value="">— Sub-division —</option>
              {subs.map(s => <option key={s.code} value={s.code}>{s.code} – {s.label}</option>)}
            </select>
          )}
        </td>
        <td style={{ padding: "6px 4px" }}>
          <input value={item.description} onChange={e => onChange("description", e.target.value)}
            placeholder={priceRef?.desc || "Description"} style={{ fontSize: 13, padding: "8px 10px" }} />
        </td>
        <td style={{ padding: "6px 4px" }}>
          <input type="number" value={item.qty} onChange={e => onChange("qty", e.target.value)} style={{ fontSize: 13, padding: "8px 10px", width: 70 }} />
        </td>
        <td style={{ padding: "6px 4px" }}>
          <select value={item.unit} onChange={e => onChange("unit", e.target.value)} style={{ fontSize: 13, padding: "8px 10px", width: 80 }}>
            {UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </td>
        <td style={{ padding: "6px 4px" }}>
          <input type="number" value={item.unitCost} onChange={e => onChange("unitCost", e.target.value)}
            style={{ fontSize: 13, padding: "8px 10px", width: 100, borderColor: priceRef && item.unitCost == 0 ? G.blue + "99" : undefined }} />
        </td>
        <td style={{ padding: "6px 4px" }}>
          <input type="number" value={item.markup} onChange={e => onChange("markup", e.target.value)} style={{ fontSize: 13, padding: "8px 10px", width: 80 }} />
        </td>
        <td style={{ padding: "6px 10px", fontFamily: "'JetBrains Mono'", color: G.accent, fontSize: 14, fontWeight: 700 }}>
          {fmtExact(lineTotal)}
        </td>
        <td style={{ padding: "6px 4px" }}>
          <button onClick={onRemove} style={{ background: G.red + "22", border: `1px solid ${G.red}44`, color: G.red, borderRadius: 8, width: 32, height: 32, fontSize: 16 }}>×</button>
        </td>
      </tr>
      {/* Inline price reference row */}
      {priceRef && (
        <tr style={{ borderBottom: `1px solid ${G.border}33`, background: G.blue + "08" }}>
          <td colSpan={8} style={{ padding: "4px 8px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: G.blue, fontWeight: 700, letterSpacing: .7, textTransform: "uppercase" }}>
                📊 {priceRef.desc} — National Avg Reference ({priceRef.unit})
              </span>
              <span style={{ fontSize: 12, color: G.green }}>Low: {fmtExact(priceRef.low)}</span>
              <span style={{ fontSize: 12, color: G.text, fontWeight: 700 }}>Avg: {fmtExact(priceRef.avg)}</span>
              <span style={{ fontSize: 12, color: G.red }}>High: {fmtExact(priceRef.high)}</span>
              <span style={{ fontSize: 11, color: G.muted }}>→ Apply:</span>
              {[["Low", priceRef.low, G.green], ["Avg", priceRef.avg, G.blue], ["High", priceRef.high, G.red]].map(([lbl, val, col]) => (
                <button key={lbl} onClick={() => applyPrice(val, priceRef.unit)}
                  style={{ background: col + "22", border: `1px solid ${col}55`, color: col, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                  {lbl} · {fmtExact(val)}
                </button>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const EstimatorView = ({ estimates, setEstimates, onCreateContract }) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState("list"); // list | form
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({ clientName: "", projectAddress: "", notes: "", items: [emptyItem()], status: "Draft" });

  const subtotal = form.items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.unitCost) || 0), 0);
  const markupAmt = form.items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.unitCost) || 0) * ((parseFloat(i.markup) || 0) / 100), 0);
  const total = subtotal + markupAmt;

  const openNew = () => {
    setForm({ clientName: "", projectAddress: "", notes: "", items: [emptyItem()], status: "Draft" });
    setActiveId(null);
    setView("form");
  };

  const openEst = (e) => { setForm({ ...e }); setActiveId(e.id); setView("form"); };

  const duplicate = (e, evt) => {
    evt.stopPropagation();
    const copy = {
      ...e,
      id: uid(),
      date: today(),
      status: "Draft",
      clientName: e.clientName ? `${e.clientName} (Copy)` : "Copy",
      items: e.items.map(i => ({ ...i, id: uid() })),
    };
    setEstimates(p => [copy, ...p]);
    setForm({ ...copy });
    setActiveId(copy.id);
    setView("form");
  };

  const save = () => {
    if (!activeId) {
      const ne = { ...form, id: uid(), date: today() };
      setEstimates(p => [ne, ...p]);
      setActiveId(ne.id);
    } else {
      setEstimates(p => p.map(e => e.id === activeId ? { ...e, ...form } : e));
    }
    if (isMobile) setView("list");
  };

  const updateItem = (id, key, val) => setForm(f => ({ ...f, items: f.items.map(i => i.id === id ? { ...i, [key]: val } : i) }));

  const printEstimate = () => {
    const c = form;
    const items = c.items || [];
    const sub = items.reduce((s, i) => s + (parseFloat(i.qty)||0)*(parseFloat(i.unitCost)||0), 0);
    const mkp = items.reduce((s, i) => s + (parseFloat(i.qty)||0)*(parseFloat(i.unitCost)||0)*((parseFloat(i.markup)||0)/100), 0);
    const tot = sub + mkp;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Estimate – ${c.clientName||"Client"}</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:Georgia,serif;max-width:900px;margin:40px auto;color:#111;line-height:1.7;font-size:13px;padding:0 20px}
      h1{font-size:30px;letter-spacing:2px;border-bottom:3px solid #f59e0b;padding-bottom:10px;margin-bottom:6px}
      .subtitle{color:#666;font-size:12px;margin-bottom:24px}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0;padding:16px;background:#fafafa;border:1px solid #eee;border-radius:4px}
      .meta p{margin:3px 0}
      h2{font-size:15px;margin:24px 0 10px;color:#333;border-left:4px solid #f59e0b;padding-left:10px}
      table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:12px}
      th{background:#1c2333;color:#fff;padding:9px 11px;text-align:left;font-size:11px;letter-spacing:.5px}
      td{border-bottom:1px solid #eee;padding:8px 11px;vertical-align:top}
      .ref-row td{background:#f0f7ff;font-size:11px;color:#555;padding:3px 11px 8px;border-bottom:1px solid #dde}
      .pill{display:inline-block;padding:1px 7px;border-radius:10px;font-size:10px;font-weight:bold;margin-right:5px}
      .low{background:#dcfce7;color:#166534}.avg{background:#dbeafe;color:#1e40af}.high{background:#fee2e2;color:#991b1b}
      .totals-box{float:right;width:280px;border:1px solid #eee;border-radius:4px;overflow:hidden;margin-top:10px}
      .totals-box .row{display:flex;justify-content:space-between;padding:8px 14px;border-bottom:1px solid #eee}
      .grand{background:#f59e0b;color:#000;font-weight:bold;font-size:15px}
      .disc{clear:both;margin-top:40px;font-size:10px;color:#999;font-style:italic;border-top:1px solid #eee;padding-top:10px}
      @media print{body{margin:20px auto}.disc{margin-top:20px}}
    </style></head><body>
    <h1>ESTIMATE</h1>
    <div class="subtitle">Pricing reference: CSI MasterFormat · National average cost data (2024)</div>
    <div class="meta">
      <div>
        <p><strong>Client:</strong> ${c.clientName||"—"}</p>
        ${c.clientCompany?`<p><strong>Company:</strong> ${c.clientCompany}</p>`:""}
        <p><strong>Project:</strong> ${c.projectAddress||"—"}</p>
        ${c.clientEmail?`<p><strong>Email:</strong> ${c.clientEmail}</p>`:""}
        ${c.clientPhone?`<p><strong>Phone:</strong> ${c.clientPhone}</p>`:""}
      </div>
      <div>
        <p><strong>Estimate #:</strong> EST-${(c.id||"").slice(0,8).toUpperCase()}</p>
        <p><strong>Status:</strong> ${c.status||"Draft"}</p>
        <p><strong>Date:</strong> ${c.date||today()}</p>
        <p><strong>Valid Until:</strong> ${new Date(new Date(c.date||today()).getTime()+30*86400000).toLocaleDateString()}</p>
      </div>
    </div>
    <h2>LINE ITEMS</h2>
    <table><thead><tr>
      <th>CSI Division</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit Cost</th><th>Markup</th><th>Line Total</th>
    </tr></thead><tbody>
    ${items.map(i => {
      const lt = (parseFloat(i.qty)||0)*(parseFloat(i.unitCost)||0)*(1+(parseFloat(i.markup)||0)/100);
      const ref = getPriceRef(i.subDivision);
      const direction = ref && parseFloat(i.unitCost) > 0 ? (parseFloat(i.unitCost) < ref.avg ? "▼ below avg" : "▲ above avg") : "";
      return `<tr>
        <td><strong style="font-size:11px">${i.category||""}</strong>${i.subDivision?`<br><span style="color:#666;font-size:10px">${i.subDivision}</span>`:""}</td>
        <td>${i.description||(ref?.desc||"—")}</td>
        <td>${i.qty}</td><td>${i.unit}</td>
        <td>$${parseFloat(i.unitCost||0).toFixed(2)}${direction?`<br><span style="font-size:10px;color:${parseFloat(i.unitCost)<(ref?.avg||0)?'#166534':'#991b1b'}">${direction}</span>`:""}</td>
        <td>${i.markup}%</td>
        <td><strong>$${lt.toFixed(2)}</strong></td>
      </tr>${ref?`<tr class="ref-row"><td colspan="7">Ref: ${ref.desc} per ${ref.unit} —
        <span class="pill low">Low $${ref.low}</span>
        <span class="pill avg">Avg $${ref.avg}</span>
        <span class="pill high">High $${ref.high}</span>
      </td></tr>`:""}`;
    }).join("")}
    </tbody></table>
    <div class="totals-box">
      <div class="row"><span>Subtotal</span><span>$${sub.toFixed(2)}</span></div>
      <div class="row"><span>Markup / Overhead</span><span>$${mkp.toFixed(2)}</span></div>
      <div class="row grand"><span>TOTAL ESTIMATE</span><span>$${tot.toFixed(2)}</span></div>
    </div>
    <div class="disc">Reference pricing from national average construction cost data (RSMeans/Gordian 2024). Costs vary by region, labor market, and site conditions. Estimate valid 30 days.</div>
    ${c.notes?`<p style="margin-top:20px;font-size:12px"><strong>Notes:</strong> ${c.notes}</p>`:""}
    </body></html>`;

    openDocWindow(html, `Estimate_${c.clientName||"Client"}_${c.date||today()}`);
  };

  const sendEstimate = () => {
    if (!form.clientEmail) { alert("Please add a client email address first."); return; }
    const sentForm = { ...form, status: "Sent", sentAt: new Date().toISOString() };
    setForm(sentForm);
    setEstimates(p => p.map(e => e.id === activeId ? { ...e, ...sentForm } : e));
    const tot = form.items.reduce((s, i) => s + (parseFloat(i.qty)||0)*(parseFloat(i.unitCost)||0)*(1+(parseFloat(i.markup)||0)/100), 0);
    const subject = encodeURIComponent(`Estimate for ${form.projectAddress || form.clientName} — ${fmtExact(tot)}`);
    const body = encodeURIComponent(
`Hi ${form.clientName || ""},

Please find attached your estimate for the project at ${form.projectAddress || "your property"}.

Estimate Total: ${fmtExact(tot)}
Estimate #: EST-${(form.id||"").slice(0,8).toUpperCase()}
Date: ${form.date || today()}
Valid for: 30 days

To save as PDF: open the attached file, then File → Print → Save as PDF.

If you have any questions or would like to approve this estimate, please reply to this email or call us directly.

Looking forward to working with you.

Best regards,
${form.contractorName || "Your Contractor"}
${form.contractorPhone ? "\n" + form.contractorPhone : ""}
${form.contractorEmail || ""}`);
    window.location.href = `mailto:${form.clientEmail}?subject=${subject}&body=${body}`;
  };

  const recordView = (estId) => {
    const entry = { timestamp: new Date().toISOString(), device: navigator.userAgent.includes("Mobile") ? "Mobile" : "Desktop" };
    setEstimates(p => p.map(e => e.id === estId
      ? { ...e, views: [...(e.views || []), entry], status: e.status === "Sent" ? "Viewed" : e.status }
      : e));
    if (activeId === estId) setForm(f => ({ ...f, views: [...(f.views || []), entry], status: f.status === "Sent" ? "Viewed" : f.status }));
  };

  const ViewTracker = () => {
    const views = form.views || [];
    if (!form.sentAt && views.length === 0) return null;
    return (
      <Card style={{ marginBottom: 14, border: `1px solid ${G.blue}33`, background: G.blue + "08" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: views.length ? 10 : 0 }}>
          <span style={{ fontSize: 18 }}>📬</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: G.blue }}>
              {views.length > 0 ? `Opened ${views.length} time${views.length !== 1 ? "s" : ""}` : "Sent — awaiting open"}
            </div>
            {form.sentAt && <div style={{ fontSize: 12, color: G.muted }}>Sent {new Date(form.sentAt).toLocaleString()}</div>}
          </div>
          <Btn variant="ghost" onClick={() => recordView(activeId)} style={{ padding: "5px 10px", fontSize: 11 }}>+ Log View</Btn>
        </div>
        {views.length > 0 && (
          <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 8 }}>
            {views.slice().reverse().map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: G.muted, padding: "3px 0" }}>
                <span>👁 Opened</span>
                <span>{new Date(v.timestamp).toLocaleString()} · {v.device}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  };

  if (isMobile && view === "list") return (
    <div style={{ paddingBottom: 80 }}>
      <MobileHeader title="Estimator" right={<Btn onClick={openNew} style={{ padding: "8px 16px", fontSize: 14 }}>+ New</Btn>} />
      <div style={{ padding: "16px 16px 0" }}>
        {estimates.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: G.muted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📐</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No estimates yet</div>
            <div style={{ fontSize: 14 }}>Tap + New to create your first estimate</div>
          </div>
        )}
        {estimates.map(e => (
          <Card key={e.id} className="tap-card" onClick={() => openEst(e)} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{e.clientName || "Unnamed Client"}</div>
                {e.clientCompany && <div style={{ fontSize: 12, color: G.muted, marginBottom: 2 }}>{e.clientCompany}</div>}
                <div style={{ fontSize: 13, color: G.muted, marginBottom: 10 }}>{e.projectAddress || "No address"} · {e.date}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge color={e.status === "Approved" ? G.green : e.status === "Viewed" ? G.purple : e.status === "Sent" ? G.blue : G.muted}>{e.status}</Badge>
                  {e.views?.length > 0 && <Badge color={G.purple}>👁 {e.views.length} open{e.views.length !== 1 ? "s" : ""}</Badge>}
                  {e.sentAt && !e.views?.length && <Badge color={G.blue}>📬 Sent</Badge>}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, fontWeight: 700, color: G.accent }}>
                  {fmt(e.items?.reduce((s, i) => s + (i.qty * i.unitCost) * (1 + i.markup / 100), 0))}
                </div>
                <button onClick={(evt) => duplicate(e, evt)} style={{ background: G.purple + "22", border: `1px solid ${G.purple}44`, color: G.purple, borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>⧉ Copy</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // MOBILE FORM
  if (isMobile && view === "form") return (
    <div style={{ paddingBottom: 100 }} className="slide-up">
      <MobileHeader
        title={activeId ? "Edit Estimate" : "New Estimate"}
        onBack={() => setView("list")}
        right={
          <div style={{ display: "flex", gap: 6 }}>
            <Btn onClick={save} style={{ padding: "8px 12px", fontSize: 13 }}>💾</Btn>
            {activeId && <Btn variant="ghost" onClick={(evt) => duplicate(form, evt)} style={{ padding: "8px 10px", fontSize: 13, color: G.purple, borderColor: G.purple + "55" }}>⧉</Btn>}
            {activeId && <Btn variant="success" onClick={() => { onCreateContract(form); }} style={{ padding: "8px 12px", fontSize: 13 }}>→</Btn>}
            {activeId && <Btn variant="blue" onClick={printEstimate} style={{ padding: "8px 12px", fontSize: 13 }}>🖨️</Btn>}
            {activeId && <Btn onClick={sendEstimate} style={{ padding: "8px 12px", fontSize: 13, background: G.green, color: "#000" }}>✉️</Btn>}
          </div>
        }
      />
      <div style={{ padding: 16 }}>
        <Card style={{ background: `linear-gradient(135deg, ${G.accent}18, ${G.accent}08)`, border: `1px solid ${G.accent}33`, marginBottom: 16, padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <AmountPill label="Subtotal" value={subtotal} />
            <AmountPill label="Markup" value={markupAmt} color={G.blue} />
            <AmountPill label="Total" value={total} color={G.accent} />
          </div>
        </Card>

        <ViewTracker />

        <Card style={{ marginBottom: 14 }}>
          <Label style={{ color: G.accent, marginBottom: 10 }}>Project Info</Label>
          <Field label="Project Address" value={form.projectAddress} onChange={v => setForm(f => ({ ...f, projectAddress: v }))} placeholder="123 Main St, City, ST" />
          <div>
            <Label>Status</Label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {["Draft", "Sent", "Viewed", "Approved", "Declined"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginTop: 14 }}>
            <Field label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Scope overview..." multiline />
          </div>
        </Card>

        <Card style={{ marginBottom: 14, border: `1px solid ${G.green}33` }}>
          <Label style={{ color: G.green, marginBottom: 10 }}>👤 Client Contact</Label>
          <Field label="Client Name" value={form.clientName} onChange={v => setForm(f => ({ ...f, clientName: v }))} placeholder="John Smith" />
          <Field label="Company" value={form.clientCompany || ""} onChange={v => setForm(f => ({ ...f, clientCompany: v }))} placeholder="Smith Properties LLC" />
          <Field label="Email" value={form.clientEmail || ""} onChange={v => setForm(f => ({ ...f, clientEmail: v }))} placeholder="john@email.com" type="email" />
          <Field label="Phone" value={form.clientPhone || ""} onChange={v => setForm(f => ({ ...f, clientPhone: v }))} placeholder="(555) 000-0000" type="tel" />
          <Field label="Billing Address" value={form.clientBillingAddress || ""} onChange={v => setForm(f => ({ ...f, clientBillingAddress: v }))} placeholder="Same as project address" />
          {form.clientEmail && (
            <Btn fullWidth onClick={sendEstimate} style={{ background: G.green, color: "#000", marginTop: 4 }}>
              ✉️ Send Estimate to {form.clientEmail}
            </Btn>
          )}
        </Card>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Label style={{ marginBottom: 0 }}>Line Items ({form.items.length})</Label>
          <Btn variant="ghost" onClick={() => setForm(f => ({ ...f, items: [...f.items, emptyItem()] }))} style={{ padding: "8px 14px", fontSize: 13 }}>+ Add Item</Btn>
        </div>
        {form.items.map(item => (
          <LineItemRow
            key={item.id} item={item} isMobile={true}
            onChange={(k, v) => updateItem(item.id, k, v)}
            onRemove={() => setForm(f => ({ ...f, items: f.items.filter(i => i.id !== item.id) }))}
          />
        ))}
        <Btn fullWidth variant="ghost" onClick={() => setForm(f => ({ ...f, items: [...f.items, emptyItem()] }))} style={{ marginTop: 4 }}>+ Add Line Item</Btn>
      </div>
    </div>
  );

  // DESKTOP
  return (
    <div style={{ display: "flex", gap: 24, height: "100%", minHeight: 0 }}>
      <div style={{ width: 280, flexShrink: 0, overflowY: "auto" }}>
        <SectionTitle title="Estimates" action={<Btn onClick={openNew} style={{ padding: "8px 16px", fontSize: 13 }}>+ New</Btn>} />
        {estimates.length === 0 && <p style={{ color: G.muted, fontSize: 13 }}>No estimates yet.</p>}
        {estimates.map(e => (
          <Card key={e.id} className="tap-card" onClick={() => openEst(e)} style={{ marginBottom: 12, cursor: "pointer", border: activeId === e.id ? `1.5px solid ${G.accent}` : undefined }}>
            <div style={{ fontWeight: 700, marginBottom: 3 }}>{e.clientName || "Unnamed"}</div>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>{e.projectAddress || "No address"}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Badge color={e.status === "Approved" ? G.green : e.status === "Sent" ? G.blue : G.muted}>{e.status}</Badge>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: G.accent }}>
                {fmt(e.items?.reduce((s, i) => s + (i.qty * i.unitCost) * (1 + i.markup / 100), 0))}
              </span>
            </div>
            <button
              onClick={(evt) => duplicate(e, evt)}
              style={{
                width: "100%", background: G.purple + "18", border: `1px solid ${G.purple}44`,
                color: G.purple, borderRadius: 8, padding: "6px 0", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}
            >⧉ Duplicate Estimate</button>
          </Card>
        ))}
      </div>

      {(activeId || view === "form") && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <SectionTitle title={activeId ? "Edit Estimate" : "New Estimate"} sub={form.clientName} />
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={save}>💾 Save</Btn>
              {activeId && <Btn variant="ghost" onClick={(evt) => duplicate(form, evt)} style={{ color: G.purple, borderColor: G.purple + "55" }}>⧉ Duplicate</Btn>}
              {activeId && <Btn variant="blue" onClick={printEstimate}>🖨️ Print / PDF</Btn>}
              {activeId && <Btn onClick={sendEstimate} style={{ background: G.green, color: "#000" }}>✉️ Send</Btn>}
              {activeId && <Btn variant="success" onClick={() => onCreateContract(form)}>→ Contract</Btn>}
            </div>
          </div>

          <Card style={{ background: `linear-gradient(135deg, ${G.accent}15, ${G.accent}05)`, border: `1px solid ${G.accent}33`, marginBottom: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <AmountPill label="Subtotal" value={subtotal} />
              <AmountPill label="Markup" value={markupAmt} color={G.blue} />
              <AmountPill label="Total" value={total} color={G.accent} />
            </div>
          </Card>

          <ViewTracker />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Card style={{ border: `1px solid ${G.green}33` }}>
              <Label style={{ color: G.green, marginBottom: 10 }}>👤 Client Contact</Label>
              <Field label="Client Name" value={form.clientName} onChange={v => setForm(f => ({ ...f, clientName: v }))} placeholder="John Smith" />
              <Field label="Company" value={form.clientCompany || ""} onChange={v => setForm(f => ({ ...f, clientCompany: v }))} placeholder="Smith Properties LLC" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Field label="Email" value={form.clientEmail || ""} onChange={v => setForm(f => ({ ...f, clientEmail: v }))} placeholder="john@email.com" type="email" />
                <Field label="Phone" value={form.clientPhone || ""} onChange={v => setForm(f => ({ ...f, clientPhone: v }))} placeholder="(555) 000-0000" type="tel" />
              </div>
              <Field label="Billing Address" value={form.clientBillingAddress || ""} onChange={v => setForm(f => ({ ...f, clientBillingAddress: v }))} placeholder="Same as project address" />
              {form.clientEmail && (
                <Btn fullWidth onClick={sendEstimate} style={{ background: G.green, color: "#000", marginTop: 4 }}>
                  ✉️ Send to {form.clientEmail}
                </Btn>
              )}
            </Card>
            <Card>
              <Label style={{ marginBottom: 10 }}>📋 Project Info</Label>
              <Field label="Project Address" value={form.projectAddress} onChange={v => setForm(f => ({ ...f, projectAddress: v }))} placeholder="123 Main St" />
              <div style={{ marginBottom: 14 }}>
                <Label>Status</Label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {["Draft", "Sent", "Viewed", "Approved", "Declined"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Field label="Notes / Scope Overview" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Brief scope description..." multiline rows={4} />
            </Card>
          </div>

          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <Label style={{ marginBottom: 0 }}>Line Items</Label>
              <Btn variant="ghost" onClick={() => setForm(f => ({ ...f, items: [...f.items, emptyItem()] }))} style={{ padding: "7px 14px", fontSize: 13 }}>+ Item</Btn>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${G.border}` }}>
                    {["Category", "Description", "Qty", "Unit", "Unit Cost", "Markup %", "Line Total", ""].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: G.muted, fontWeight: 600, fontSize: 11, letterSpacing: .8 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.items.map(item => (
                    <LineItemRow key={item.id} item={item} isMobile={false}
                      onChange={(k, v) => updateItem(item.id, k, v)}
                      onRemove={() => setForm(f => ({ ...f, items: f.items.filter(i => i.id !== item.id) }))}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTRACT
// ═══════════════════════════════════════════════════════════════════════════════
const DEFAULT_TERMS = `1. All work shall be performed in a workmanlike manner consistent with industry standards.
2. Contractor warrants all work for one (1) year from completion.
3. Any changes to the scope of work must be agreed upon in writing via a Change Order before work commences.
4. Owner shall provide reasonable access to the property as needed.
5. Contractor carries general liability insurance and workers' compensation as required by law.
6. Any disputes shall be resolved by binding arbitration in the project's jurisdiction.
7. Contractor is not responsible for delays caused by weather, acts of God, or material shortages beyond our control.`;

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
const ConfirmModal = ({ show, title, message, detail, confirmLabel, confirmColor = G.accent, onConfirm, onCancel }) => {
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="slide-up"
        style={{
          background: G.card, border: `1px solid ${G.border}`,
          borderRadius: 16, padding: 28, maxWidth: 420, width: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 12, textAlign: "center" }}>✉️</div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: G.accent, letterSpacing: 1, marginBottom: 8, textAlign: "center" }}>
          {title}
        </div>
        <p style={{ fontSize: 15, color: G.text, marginBottom: 8, textAlign: "center", lineHeight: 1.5 }}>{message}</p>
        {detail && (
          <div style={{ background: G.bg, border: `1px solid ${G.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: G.muted, lineHeight: 1.6 }}>
            {detail}
          </div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" onClick={onCancel} fullWidth>Cancel</Btn>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "12px 20px", borderRadius: 12, fontWeight: 700,
              fontSize: 15, border: "none", background: confirmColor, color: "#000",
              cursor: "pointer",
            }}
          >{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

const ContractView = ({ contracts, setContracts }) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState("list");
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({});
  const [modal, setModal] = useState(null); // { type: "send" | "sign" }

  const open = (c) => { setForm({ ...c }); setActiveId(c.id); setView("form"); };
  const save = () => {
    setContracts(p => p.map(c => c.id === activeId ? { ...c, ...form } : c));
    if (isMobile) setView("list");
  };

  // Keep form in sync when the parent auto-syncs estimate changes into contracts
  useEffect(() => {
    if (!activeId) return;
    const updated = contracts.find(c => c.id === activeId);
    if (updated) setForm(updated);
  }, [contracts, activeId]);

  const calcTotal = (c) => (c.estimateItems || c.items || []).reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.unitCost) || 0) * (1 + (parseFloat(i.markup) || 0) / 100), 0);

  const isSigned = form.status === "Signed" || form.status === "Void";
  const isLinked = !!form.estimateId;

  const SyncBanner = () => {
    if (!isLinked) return null;
    if (isSigned) return (
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        background: G.green + "15", border: `1px solid ${G.green}44`,
        borderRadius: 10, marginBottom: 16,
      }}>
        <span style={{ fontSize: 16 }}>🔒</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: G.green }}>Contract Locked — Signed</div>
          <div style={{ fontSize: 12, color: G.muted }}>Estimate changes will no longer sync to this contract.</div>
        </div>
      </div>
    );
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
        background: G.blue + "15", border: `1px solid ${G.blue}44`,
        borderRadius: 10, marginBottom: 16,
      }}>
        <span style={{ fontSize: 16 }}>🔄</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: G.blue }}>Auto-Syncing with Estimate</div>
          <div style={{ fontSize: 12, color: G.muted }}>
            Scope, pricing, and client info update automatically when the estimate changes.
            {form.lastSynced && ` Last synced: ${new Date(form.lastSynced).toLocaleString()}.`}
            {" "}Set status to <strong>Signed</strong> to lock.
          </div>
        </div>
      </div>
    );
  };

  const sendContract = () => {
    if (!form.clientEmail) { setModal({ type: "noEmail" }); return; }
    setModal({ type: "send" });
  };

  const confirmSend = () => {
    const sentForm = { ...form, status: "Sent", sentAt: new Date().toISOString() };
    setForm(sentForm);
    setContracts(p => p.map(c => c.id === activeId ? { ...c, ...sentForm } : c));
    const total = parseFloat(form.contractValue) || calcTotal(form);
    const subject = encodeURIComponent(`Construction Contract — ${form.projectAddress || form.clientName} — Please Review & Sign`);
    const body = encodeURIComponent(
`Hi ${form.clientName || ""},

Please find attached your construction contract for the project at ${form.projectAddress || "your property"}.

Contract Total: ${fmtExact(total)}
Contract #: ${(form.id || "").slice(0, 8).toUpperCase()}
Date: ${form.date || today()}
Start Date: ${form.startDate || "TBD"}
Est. Completion: ${form.endDate || "TBD"}

Please review the attached PDF carefully, sign both copies, and return one signed copy to us before the project start date.

If you have any questions or need clarification on any terms, please don't hesitate to call or reply to this email.

Looking forward to working with you.

Best regards,
${form.contractorName || "Your Contractor"}${form.contractorPhone ? "\n" + form.contractorPhone : ""}
${form.contractorEmail || ""}`);
    setModal(null);
    window.location.href = `mailto:${form.clientEmail}?subject=${subject}&body=${body}`;
  };

  const printContract = () => {
    const c = form;
    const total = parseFloat(c.contractValue) || calcTotal(c);
    const dep = parseInt(c.depositPct) || 30;
    const prog = parseInt(c.progressPct) || 40;
    const fin = 100 - dep - prog;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Contract – ${c.clientName}</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:Georgia,serif;max-width:820px;margin:40px auto;color:#111;line-height:1.8;font-size:14px;padding:0 20px}
      h1{font-size:30px;letter-spacing:2px;border-bottom:3px solid #222;padding-bottom:12px;margin-bottom:24px}
      h2{font-size:16px;margin-top:28px;color:#333;border-left:4px solid #f59e0b;padding-left:10px;text-transform:uppercase;letter-spacing:.5px}
      table{width:100%;border-collapse:collapse;margin:16px 0}
      th,td{border:1px solid #ccc;padding:9px 13px;text-align:left;font-size:13px}
      th{background:#f5f5f5;font-weight:600}
      .meta{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0;padding:16px;background:#fafafa;border:1px solid #eee;border-radius:4px}
      .meta p{margin:4px 0;font-size:13px}
      .meta strong{color:#333}
      .box{background:#fffbeb;border:1px solid #f59e0b55;border-radius:4px;padding:14px 16px;margin:12px 0}
      .box p{margin:4px 0;font-size:13px}
      .sig{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:60px}
      .sig div{padding-top:12px;border-top:1px solid #333;font-size:13px}
      @media print{body{margin:20px auto}}
    </style></head><body>
    <h1>CONSTRUCTION CONTRACT</h1>
    <div class="meta">
      <div>
        <p><strong>Contractor:</strong> ${c.contractorName || "—"}</p>
        ${c.contractorAddress ? `<p><strong>Address:</strong> ${c.contractorAddress}</p>` : ""}
        ${c.contractorPhone ? `<p><strong>Phone:</strong> ${c.contractorPhone}</p>` : ""}
        ${c.contractorEmail ? `<p><strong>Email:</strong> ${c.contractorEmail}</p>` : ""}
        <p><strong>License #:</strong> ${c.licenseNum || "N/A"}</p>
        ${c.insuranceNum ? `<p><strong>Insurance Policy #:</strong> ${c.insuranceNum}</p>` : ""}
      </div>
      <div>
        <p><strong>Client:</strong> ${c.clientName || "—"}</p>
        ${c.clientPhone ? `<p><strong>Phone:</strong> ${c.clientPhone}</p>` : ""}
        ${c.clientEmail ? `<p><strong>Email:</strong> ${c.clientEmail}</p>` : ""}
        <p><strong>Project Address:</strong> ${c.projectAddress || "—"}</p>
        <p><strong>Contract #:</strong> ${(c.id || "").slice(0,8).toUpperCase()}</p>
        <p><strong>Date:</strong> ${c.date || ""}</p>
        ${c.permitNum ? `<p><strong>Permit #:</strong> ${c.permitNum}</p>` : ""}
      </div>
    </div>

    <h2>Scope of Work</h2>
    <p>${(c.notes || "").replace(/\n/g, "<br>")} ${(c.scopeDetails || "").replace(/\n/g, "<br>")}</p>

    ${c.exclusions ? `<h2>Exclusions</h2><p>The following items are <strong>NOT</strong> included in this contract:</p><p>${c.exclusions.replace(/\n/g, "<br>")}</p>` : ""}

    ${c.clientResponsibilities ? `
    <h2>Owner / Client Responsibilities</h2>
    <div class="box">
      <p><strong>The Owner/Client shall be responsible for providing the following prior to and during construction:</strong></p>
      <p>${c.clientResponsibilities.replace(/\n/g, "<br>")}</p>
      <p style="font-size:12px;color:#666;margin-top:10px"><em>Failure to fulfill these responsibilities may result in project delays and/or additional charges billed at the contractor's standard rate.</em></p>
    </div>` : ""}

    <h2>Project Schedule</h2>
    <p><strong>Start Date:</strong> ${c.startDate || "TBD"} &nbsp;&nbsp;&nbsp; <strong>Estimated Completion:</strong> ${c.endDate || "TBD"}</p>

    <h2>Contract Price &amp; Payment Schedule</h2>
    <table>
      <tr><th>Payment Milestone</th><th>%</th><th>Amount</th><th>Due When</th></tr>
      <tr><td>Deposit</td><td>${dep}%</td><td>${fmtExact(total * dep / 100)}</td><td>Upon contract signing</td></tr>
      <tr><td>Progress Payment</td><td>${prog}%</td><td>${fmtExact(total * prog / 100)}</td><td>Rough-in complete</td></tr>
      <tr><td>Final Payment</td><td>${fin}%</td><td>${fmtExact(total * fin / 100)}</td><td>Substantial completion</td></tr>
      <tr><td><strong>TOTAL</strong></td><td><strong>100%</strong></td><td><strong>${fmtExact(total)}</strong></td><td></td></tr>
    </table>
    ${c.retainagePct > 0 ? `<p style="font-size:13px"><em>Retainage of ${c.retainagePct}% (${fmtExact(total * c.retainagePct / 100)}) to be held until final inspection and punch list completion.</em></p>` : ""}

    ${c.specialConditions ? `<h2>Special Conditions</h2><p>${c.specialConditions.replace(/\n/g, "<br>")}</p>` : ""}

    <h2>Terms &amp; Conditions</h2>
    <p>${(c.terms || DEFAULT_TERMS).replace(/\n/g, "<br>")}</p>

    <div class="sig">
      <div>Contractor Signature<br><br><br>___________________________<br><strong>${c.contractorName || ""}</strong><br>Date: _______________</div>
      <div>Client Signature<br><br><br>___________________________<br><strong>${c.clientName || ""}</strong><br>Date: _______________</div>
    </div>
    </body></html>`;
    openDocWindow(html, `Contract_${c.clientName||"Client"}_${c.date||today()}`);
  };

  const contractFormJSX = (
    <div style={{ padding: isMobile ? 16 : 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <Field label="Contractor Name / Company" value={form.contractorName || ""} onChange={v => setForm(f => ({ ...f, contractorName: v }))} placeholder="Your Company LLC" />
          <Field label="License #" value={form.licenseNum || ""} onChange={v => setForm(f => ({ ...f, licenseNum: v }))} placeholder="LIC-000000" />
          <Field label="Contractor Address" value={form.contractorAddress || ""} onChange={v => setForm(f => ({ ...f, contractorAddress: v }))} placeholder="456 Business Ave, City, ST" />
          <Field label="Contractor Phone" value={form.contractorPhone || ""} onChange={v => setForm(f => ({ ...f, contractorPhone: v }))} placeholder="(555) 000-0000" />
          <Field label="Contractor Email" value={form.contractorEmail || ""} onChange={v => setForm(f => ({ ...f, contractorEmail: v }))} placeholder="you@company.com" />
        </Card>
        <Card>
          <Field label="Client Name" value={form.clientName || ""} onChange={v => setForm(f => ({ ...f, clientName: v }))} placeholder="John Smith" />
          <Field label="Client Phone" value={form.clientPhone || ""} onChange={v => setForm(f => ({ ...f, clientPhone: v }))} placeholder="(555) 000-0000" type="tel" />
          <Field label="Client Email" value={form.clientEmail || ""} onChange={v => setForm(f => ({ ...f, clientEmail: v }))} placeholder="client@email.com" type="email" />
          <Field label="Project Address" value={form.projectAddress || ""} onChange={v => setForm(f => ({ ...f, projectAddress: v }))} placeholder="123 Main St, City, ST" />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <Field label="Start Date" value={form.startDate || ""} onChange={v => setForm(f => ({ ...f, startDate: v }))} type="date" />
          <Field label="Est. Completion Date" value={form.endDate || ""} onChange={v => setForm(f => ({ ...f, endDate: v }))} type="date" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <Field label="Deposit %" value={form.depositPct || 30} onChange={v => setForm(f => ({ ...f, depositPct: v }))} type="number" />
            <Field label="Progress %" value={form.progressPct || 40} onChange={v => setForm(f => ({ ...f, progressPct: v }))} type="number" />
            <div style={{ marginBottom: 14 }}>
              <Label>Final %</Label>
              <div style={{ padding: "12px 14px", border: `1.5px solid ${G.border}`, borderRadius: 10, fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 700, color: G.accent }}>
                {100 - (parseInt(form.depositPct) || 30) - (parseInt(form.progressPct) || 40)}%
              </div>
            </div>
          </div>
          <div>
            <Label>Contract Status</Label>
            <select value={form.status || "Draft"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {["Draft", "Sent", "Signed", "Void"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </Card>
        <Card>
          <Field label="Contract Value ($)" value={form.contractValue || calcTotal(form)} onChange={v => setForm(f => ({ ...f, contractValue: v }))} type="number" />
          <Field label="Retainage %" value={form.retainagePct || 0} onChange={v => setForm(f => ({ ...f, retainagePct: v }))} type="number" />
          <Field label="Permit #" value={form.permitNum || ""} onChange={v => setForm(f => ({ ...f, permitNum: v }))} placeholder="Permit number (if known)" />
          <Field label="Insurance Policy #" value={form.insuranceNum || ""} onChange={v => setForm(f => ({ ...f, insuranceNum: v }))} placeholder="GL Policy number" />
        </Card>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <Field label="Scope of Work" value={form.scopeDetails || ""} onChange={v => setForm(f => ({ ...f, scopeDetails: v }))} placeholder="Detailed description of all work to be performed..." multiline rows={5} />
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Field label="Exclusions (work NOT included)" value={form.exclusions || ""} onChange={v => setForm(f => ({ ...f, exclusions: v }))} placeholder="e.g. Painting, finish hardware, appliances, landscaping..." multiline rows={3} />
      </Card>

      <Card style={{ marginBottom: 14, border: `1px solid ${G.accent}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 18 }}>👤</span>
          <Label style={{ marginBottom: 0, color: G.accent }}>Owner / Client Responsibilities</Label>
        </div>
        <Field
          label="Client shall provide and/or be responsible for:"
          value={form.clientResponsibilities || ""}
          onChange={v => setForm(f => ({ ...f, clientResponsibilities: v }))}
          placeholder={`e.g.\n• Clear and provide access to work areas prior to start date\n• Disconnect and move furniture, personal belongings, and valuables\n• Provide water and electrical power to the work site at no charge\n• Secure pets and ensure safe site access for crew\n• Obtain HOA approvals or neighbor notifications as required\n• Make timely decisions on selections (tile, fixtures, finishes) per schedule\n• Provide approved permit drawings if separately procured\n• Ensure payment milestones are met per schedule to avoid work stoppage`}
          multiline
          rows={6}
        />
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <Field label="Special Conditions / Notes" value={form.specialConditions || ""} onChange={v => setForm(f => ({ ...f, specialConditions: v }))} placeholder="Access restrictions, noise ordinances, HOA requirements, hazmat concerns..." multiline rows={3} />
      </Card>

      <Card>
        <Field label="Terms & Conditions" value={form.terms || DEFAULT_TERMS} onChange={v => setForm(f => ({ ...f, terms: v }))} multiline rows={10} />
      </Card>
    </div>
  );

  if (isMobile && view === "list") return (
    <div style={{ paddingBottom: 80 }}>
      <MobileHeader title="Contracts" />
      <div style={{ padding: "16px 16px 0" }}>
        {contracts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: G.muted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No contracts yet</div>
            <div style={{ fontSize: 14 }}>Use "→ Contract" in the Estimator to generate one</div>
          </div>
        )}
        {contracts.map(c => (
          <Card key={c.id} className="tap-card" onClick={() => open(c)} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{c.clientName}</div>
                <div style={{ fontSize: 13, color: G.muted, marginBottom: 10 }}>{c.projectAddress}</div>
                <Badge color={c.status === "Signed" ? G.green : c.status === "Sent" ? G.blue : G.muted}>{c.status || "Draft"}</Badge>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 700, color: G.accent }}>{fmt(calcTotal(c))}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isMobile && view === "form") return (
    <div style={{ paddingBottom: 100 }} className="slide-up">
      <MobileHeader
        title={form.clientName || "Contract"}
        onBack={() => setView("list")}
        right={
          <div style={{ display: "flex", gap: 6 }}>
            <Btn onClick={save} style={{ padding: "8px 12px", fontSize: 13 }}>💾</Btn>
            <Btn variant="blue" onClick={printContract} style={{ padding: "8px 12px", fontSize: 13 }}>🖨️</Btn>
            {!isSigned && <Btn onClick={sendContract} style={{ padding: "8px 12px", fontSize: 13, background: G.green, color: "#000" }}>✉️</Btn>}
          </div>
        }
      />
      <div style={{ padding: "12px 16px 0" }}>
        <SyncBanner />
        {form.sentAt && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            background: G.green + "12", border: `1px solid ${G.green}33`,
            borderRadius: 10, marginBottom: 14,
          }}>
            <span style={{ fontSize: 16 }}>📬</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: G.green }}>Contract Sent</div>
              <div style={{ fontSize: 12, color: G.muted }}>Sent to {form.clientEmail} on {new Date(form.sentAt).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
      {contractFormJSX}
      <ConfirmModal
        show={modal?.type === "send"}
        title="Send Contract"
        message={`Send this contract to ${form.clientName}?`}
        detail={`An email will open addressed to ${form.clientEmail} with a professional cover message and instructions to sign and return the contract. The contract status will be updated to Sent.`}
        confirmLabel="✉️ Send Contract"
        confirmColor={G.green}
        onConfirm={confirmSend}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        show={modal?.type === "noEmail"}
        title="No Email Address"
        message="Please add a client email address before sending."
        detail="Go to the Estimator tab to add contact info, or fill in the client email in the contract fields above."
        confirmLabel="Got it"
        confirmColor={G.accent}
        onConfirm={() => setModal(null)}
        onCancel={() => setModal(null)}
      />
    </div>
  );

  // Desktop
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ width: 280, flexShrink: 0, overflowY: "auto" }}>
        <SectionTitle title="Contracts" sub="Tap to edit & print" />
        {contracts.length === 0 && <p style={{ color: G.muted, fontSize: 13 }}>Generate from Estimator.</p>}
        {contracts.map(c => (
          <Card key={c.id} className="tap-card" onClick={() => open(c)} style={{ marginBottom: 12, cursor: "pointer", border: activeId === c.id ? `1.5px solid ${G.accent}` : undefined }}>
            <div style={{ fontWeight: 700, marginBottom: 3 }}>{c.clientName}</div>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>{c.projectAddress}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Badge color={c.status === "Signed" ? G.green : c.status === "Sent" ? G.blue : G.muted}>{c.status || "Draft"}</Badge>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: G.accent }}>{fmt(calcTotal(c))}</span>
            </div>
            {c.estimateId && c.status !== "Signed" && c.status !== "Void" && (
              <div style={{ fontSize: 10, color: G.blue, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <span>🔄</span> Auto-syncing with estimate
              </div>
            )}
            {(c.status === "Signed" || c.status === "Void") && c.estimateId && (
              <div style={{ fontSize: 10, color: G.green, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                <span>🔒</span> Locked — no longer syncing
              </div>
            )}
          </Card>
        ))}
      </div>
      {activeId && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <SectionTitle title="Contract Editor" sub={form.clientName} />
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={save}>💾 Save</Btn>
              <Btn variant="blue" onClick={printContract}>🖨️ Print / PDF</Btn>
              {!isSigned && (
                <Btn onClick={sendContract} style={{ background: G.green, color: "#000" }}>✉️ Send Contract</Btn>
              )}
            </div>
          </div>
          <SyncBanner />
          {form.sentAt && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
              background: G.green + "12", border: `1px solid ${G.green}33`,
              borderRadius: 10, marginBottom: 16,
            }}>
              <span style={{ fontSize: 16 }}>📬</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G.green }}>Contract Sent</div>
                <div style={{ fontSize: 12, color: G.muted }}>
                  Sent to {form.clientEmail} on {new Date(form.sentAt).toLocaleString()}
                  {" · "}
                  <button onClick={sendContract} style={{ background: "none", border: "none", color: G.blue, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Resend</button>
                </div>
              </div>
            </div>
          )}
          {contractFormJSX}
          <ConfirmModal
            show={modal?.type === "send"}
            title="Send Contract"
            message={`Send this contract to ${form.clientName}?`}
            detail={`An email will open addressed to ${form.clientEmail} with a professional cover message and instructions to sign and return the contract. The contract status will be updated to Sent.`}
            confirmLabel="✉️ Send Contract"
            confirmColor={G.green}
            onConfirm={confirmSend}
            onCancel={() => setModal(null)}
          />
          <ConfirmModal
            show={modal?.type === "noEmail"}
            title="No Email Address"
            message="Please add a client email address before sending."
            detail="Add the client email in the contract fields below under client contact info."
            confirmLabel="Got it"
            confirmColor={G.accent}
            onConfirm={() => setModal(null)}
            onCancel={() => setModal(null)}
          />
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════════════════════════
const STATUS_C = { "Not Started": G.muted, "In Progress": G.blue, "On Hold": G.accent, "Complete": G.green };
const PHASES = ["Pre-Construction", "Site Prep", "Foundation", "Framing", "Rough-Ins", "Insulation/Drywall", "Finish Work", "Punch List", "Final Inspection"];

const ProjectsView = ({ projects, setProjects }) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState("list"); // list | form | tasks | changes
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({});
  const [subView, setSubView] = useState("details"); // details | tasks | changes

  const openNew = () => {
    setForm({ name: "", client: "", address: "", status: "Not Started", phase: "Pre-Construction", budget: 0, spent: 0, startDate: today(), endDate: "", tasks: [], changeOrders: [] });
    setActiveId(null); setView("form"); setSubView("details");
  };
  const open = (p) => { setForm({ ...p }); setActiveId(p.id); setView("form"); setSubView("details"); };
  const save = () => {
    if (!activeId) {
      const np = { ...form, id: uid() };
      setProjects(p => [np, ...p]);
      setActiveId(np.id);
    } else {
      setProjects(p => p.map(pr => pr.id === activeId ? { ...pr, ...form } : pr));
    }
    if (isMobile) setView("list");
  };

  const tasks = form.tasks || [];
  const changeOrders = form.changeOrders || [];
  const donePct = tasks.length ? Math.round(tasks.filter(t => t.done).length / tasks.length * 100) : 0;
  const approvedCOs = changeOrders.filter(c => c.status === "Approved").reduce((s, c) => s + parseFloat(c.amount || 0), 0);
  const revisedBudget = parseFloat(form.budget || 0) + approvedCOs;
  const remaining = revisedBudget - parseFloat(form.spent || 0);

  const SubTabs = () => (
    <div style={{ display: "flex", gap: 6, padding: isMobile ? "10px 16px" : "0 0 20px", background: isMobile ? G.surface : "transparent", borderBottom: isMobile ? `1px solid ${G.border}` : "none" }}>
      {[["details", "📋 Details"], ["tasks", `✅ Tasks (${tasks.length})`], ["changes", `🔄 Change Orders (${changeOrders.length})`]].map(([id, label]) => (
        <button key={id} onClick={() => setSubView(id)} style={{
          padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: subView === id ? 700 : 500,
          background: subView === id ? G.accent + "22" : "transparent",
          border: `1.5px solid ${subView === id ? G.accent : G.border}`,
          color: subView === id ? G.accent : G.muted, transition: "all .15s",
        }}>{label}</button>
      ))}
    </div>
  );

  const DetailsTab = () => (
    <div style={{ padding: isMobile ? 16 : 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <Field label="Project Name" value={form.name || ""} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Kitchen Remodel" />
          <Field label="Client" value={form.client || ""} onChange={v => setForm(f => ({ ...f, client: v }))} />
          <Field label="Address" value={form.address || ""} onChange={v => setForm(f => ({ ...f, address: v }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><Label>Status</Label><select value={form.status || "Not Started"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>{Object.keys(STATUS_C).map(s => <option key={s}>{s}</option>)}</select></div>
            <div><Label>Phase</Label><select value={form.phase || "Pre-Construction"} onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}>{PHASES.map(p => <option key={p}>{p}</option>)}</select></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <Field label="Start Date" value={form.startDate || ""} onChange={v => setForm(f => ({ ...f, startDate: v }))} type="date" />
            <Field label="End Date" value={form.endDate || ""} onChange={v => setForm(f => ({ ...f, endDate: v }))} type="date" />
          </div>
        </Card>
        <Card>
          <Field label="Contract Budget ($)" value={form.budget || ""} onChange={v => setForm(f => ({ ...f, budget: v }))} type="number" min="0" />
          <Field label="Amount Spent ($)" value={form.spent || ""} onChange={v => setForm(f => ({ ...f, spent: v }))} type="number" min="0" />
          <div style={{ background: G.bg, borderRadius: 12, padding: 16, marginTop: 4 }}>
            {[["Approved COs", fmtExact(approvedCOs), G.blue], ["Revised Budget", fmtExact(revisedBudget), G.text], ["Remaining", fmtExact(remaining), remaining >= 0 ? G.green : G.red]].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: G.muted }}>{l}</span>
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
            <div style={{ background: G.border, borderRadius: 6, height: 8, marginTop: 8 }}>
              <div style={{ width: Math.min(100, ((form.spent || 0) / (revisedBudget || 1)) * 100) + "%", height: "100%", background: remaining < 0 ? G.red : G.green, borderRadius: 6, transition: "width .3s" }} />
            </div>
            <div style={{ textAlign: "right", fontSize: 12, color: G.muted, marginTop: 4 }}>
              {Math.round(((form.spent || 0) / (revisedBudget || 1)) * 100)}% spent
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const TasksTab = () => (
    <div style={{ padding: isMobile ? 16 : 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 14, color: G.muted }}>{tasks.filter(t => t.done).length} of {tasks.length} complete</div>
        <Btn variant="ghost" onClick={() => setForm(f => ({ ...f, tasks: [...tasks, { id: uid(), name: "", done: false, due: "" }] }))} style={{ padding: "8px 14px", fontSize: 13 }}>+ Task</Btn>
      </div>
      <div style={{ background: G.bg, borderRadius: 8, height: 8, marginBottom: 16 }}>
        <div style={{ width: donePct + "%", height: "100%", background: G.green, borderRadius: 8, transition: "width .3s" }} />
      </div>
      {tasks.map(task => (
        <Card key={task.id} style={{ marginBottom: 10, padding: "12px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setForm(f => ({ ...f, tasks: tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t) }))}
              style={{
                width: 28, height: 28, borderRadius: 8, border: `2px solid ${task.done ? G.green : G.border}`,
                background: task.done ? G.green : "transparent", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#000",
              }}
            >{task.done ? "✓" : ""}</button>
            <input value={task.name} onChange={e => setForm(f => ({ ...f, tasks: tasks.map(t => t.id === task.id ? { ...t, name: e.target.value } : t) }))}
              placeholder="Task description"
              style={{ flex: 1, textDecoration: task.done ? "line-through" : "none", color: task.done ? G.muted : G.text, fontSize: 15 }}
            />
            <input type="date" value={task.due} onChange={e => setForm(f => ({ ...f, tasks: tasks.map(t => t.id === task.id ? { ...t, due: e.target.value } : t) }))}
              style={{ width: isMobile ? 130 : 160, fontSize: 14 }}
            />
            <button onClick={() => setForm(f => ({ ...f, tasks: tasks.filter(t => t.id !== task.id) }))}
              style={{ background: "none", border: "none", color: G.red, fontSize: 20, flexShrink: 0 }}>×</button>
          </div>
        </Card>
      ))}
      {tasks.length === 0 && <div style={{ textAlign: "center", padding: 30, color: G.muted, fontSize: 14 }}>No tasks yet — tap + Task to add one</div>}
    </div>
  );

  const ChangesTab = () => (
    <div style={{ padding: isMobile ? 16 : 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 14, color: G.muted }}>{changeOrders.filter(c => c.status === "Approved").length} approved · {fmtExact(approvedCOs)} added</div>
        <Btn variant="ghost" onClick={() => setForm(f => ({ ...f, changeOrders: [...changeOrders, { id: uid(), description: "", amount: 0, status: "Pending", date: today() }] }))} style={{ padding: "8px 14px", fontSize: 13 }}>+ Change Order</Btn>
      </div>
      {changeOrders.map(co => (
        <Card key={co.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
            <input value={co.description} onChange={e => setForm(f => ({ ...f, changeOrders: changeOrders.map(c => c.id === co.id ? { ...c, description: e.target.value } : c) }))}
              placeholder="Change order description" style={{ flex: 1 }} />
            <button onClick={() => setForm(f => ({ ...f, changeOrders: changeOrders.filter(c => c.id !== co.id) }))}
              style={{ background: "none", border: "none", color: G.red, fontSize: 22, flexShrink: 0 }}>×</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <Label>Amount ($)</Label>
              <input type="number" value={co.amount} onChange={e => setForm(f => ({ ...f, changeOrders: changeOrders.map(c => c.id === co.id ? { ...c, amount: e.target.value } : c) }))} />
            </div>
            <div>
              <Label>Status</Label>
              <select value={co.status} onChange={e => setForm(f => ({ ...f, changeOrders: changeOrders.map(c => c.id === co.id ? { ...c, status: e.target.value } : c) }))}>
                {["Pending", "Approved", "Rejected"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 8, textAlign: "right" }}>
            <Badge color={co.status === "Approved" ? G.green : co.status === "Rejected" ? G.red : G.accent}>{co.status}</Badge>
          </div>
        </Card>
      ))}
      {changeOrders.length === 0 && <div style={{ textAlign: "center", padding: 30, color: G.muted, fontSize: 14 }}>No change orders yet</div>}
    </div>
  );

  if (isMobile && view === "list") return (
    <div style={{ paddingBottom: 80 }}>
      <MobileHeader title="Projects" right={<Btn onClick={openNew} style={{ padding: "8px 16px", fontSize: 14 }}>+ New</Btn>} />
      <div style={{ padding: "16px 16px 0" }}>
        {projects.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: G.muted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏗️</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No projects yet</div>
            <div style={{ fontSize: 14 }}>Tap + New to start tracking a project</div>
          </div>
        )}
        {projects.map(p => {
          const pTasks = p.tasks || [];
          const pct = pTasks.length ? Math.round(pTasks.filter(t => t.done).length / pTasks.length * 100) : 0;
          return (
            <Card key={p.id} className="tap-card" onClick={() => open(p)} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{p.name || "Unnamed Project"}</div>
                  <div style={{ fontSize: 13, color: G.muted }}>{p.client}</div>
                </div>
                <Badge color={STATUS_C[p.status] || G.muted}>{p.status}</Badge>
              </div>
              <div style={{ fontSize: 12, color: G.muted, marginBottom: 10 }}>{p.phase}</div>
              <div style={{ background: G.bg, borderRadius: 4, height: 5 }}>
                <div style={{ width: pct + "%", height: "100%", background: G.green, borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 12, color: G.muted }}>
                <span>{pct}% tasks</span>
                <span style={{ color: G.accent, fontFamily: "'JetBrains Mono'", fontWeight: 600 }}>{fmt(p.budget)}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if (isMobile && view === "form") return (
    <div style={{ paddingBottom: 100 }} className="slide-up">
      <MobileHeader
        title={form.name || "New Project"}
        onBack={() => setView("list")}
        right={<Btn onClick={save} style={{ padding: "8px 14px", fontSize: 13 }}>💾 Save</Btn>}
      />
      <SubTabs />
      {subView === "details" && <DetailsTab />}
      {subView === "tasks" && <TasksTab />}
      {subView === "changes" && <ChangesTab />}
    </div>
  );

  // Desktop
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ width: 280, flexShrink: 0, overflowY: "auto" }}>
        <SectionTitle title="Projects" action={<Btn onClick={openNew} style={{ padding: "8px 16px", fontSize: 13 }}>+ New</Btn>} />
        {projects.map(p => {
          const pTasks = p.tasks || [];
          const pct = pTasks.length ? Math.round(pTasks.filter(t => t.done).length / pTasks.length * 100) : 0;
          return (
            <Card key={p.id} className="tap-card" onClick={() => open(p)} style={{ marginBottom: 12, cursor: "pointer", border: activeId === p.id ? `1.5px solid ${G.accent}` : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontWeight: 700 }}>{p.name || "Unnamed"}</div>
                <Badge color={STATUS_C[p.status] || G.muted}>{p.status}</Badge>
              </div>
              <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>{p.client} · {p.phase}</div>
              <div style={{ background: G.bg, borderRadius: 4, height: 5 }}>
                <div style={{ width: pct + "%", height: "100%", background: G.green, borderRadius: 4 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5, fontSize: 12, color: G.muted }}>
                <span>{pct}% complete</span>
                <span style={{ color: G.accent, fontFamily: "'JetBrains Mono'" }}>{fmt(p.budget)}</span>
              </div>
            </Card>
          );
        })}
      </div>
      {(activeId || view === "form") && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <SectionTitle title={form.name || "New Project"} sub={form.client} />
            <Btn variant="ghost" onClick={save}>💾 Save</Btn>
          </div>
          <SubTabs />
          <div style={{ marginTop: 16 }}>
            {subView === "details" && <DetailsTab />}
            {subView === "tasks" && <TasksTab />}
            {subView === "changes" && <ChangesTab />}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INVOICES
// ═══════════════════════════════════════════════════════════════════════════════
const InvoicesView = ({ invoices, setInvoices, estimates }) => {
  const isMobile = useIsMobile();
  const [view, setView] = useState("list");
  const [activeId, setActiveId] = useState(null);
  const [form, setForm] = useState({});

  const calcTotal = (inv) => (inv.items || []).reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.unitCost) || 0) * (1 + (parseFloat(i.markup) || 0) / 100), 0);
  const fTotal = calcTotal(form);
  const fBalance = fTotal - parseFloat(form.paidAmount || 0);

  const openNew = () => {
    const num = "INV-" + String(invoices.length + 1001);
    setForm({ clientName: "", address: "", invoiceNum: num, date: today(), dueDate: "", items: [emptyItem()], notes: "", status: "Draft", paidAmount: 0 });
    setActiveId(null); setView("form");
  };
  const openFromEst = (est) => {
    const num = "INV-" + String(invoices.length + 1001);
    setForm({ clientName: est.clientName, address: est.projectAddress, invoiceNum: num, date: today(), dueDate: "", items: est.items.map(i => ({ ...i, id: uid() })), notes: est.notes || "", status: "Draft", paidAmount: 0 });
    setActiveId(null); setView("form");
  };
  const open = (inv) => { setForm({ ...inv }); setActiveId(inv.id); setView("form"); };
  const save = () => {
    if (!activeId) {
      const ni = { ...form, id: uid() };
      setInvoices(p => [ni, ...p]);
      setActiveId(ni.id);
    } else {
      setInvoices(p => p.map(i => i.id === activeId ? { ...i, ...form } : i));
    }
    if (isMobile) setView("list");
  };

  const updateItem = (id, key, val) => setForm(f => ({ ...f, items: f.items.map(i => i.id === id ? { ...i, [key]: val } : i) }));

  const printInvoice = () => {
    const c = form;
    const total = fTotal;
    const invSub = (c.items || []).reduce((s, i) => s + (parseFloat(i.qty)||0)*(parseFloat(i.unitCost)||0), 0);
    const invMkp = total - invSub;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${c.invoiceNum}</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:Georgia,serif;max-width:820px;margin:40px auto;color:#111;line-height:1.7;font-size:14px;padding:0 20px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #222;padding-bottom:16px;margin-bottom:24px}
      h1{font-size:36px;letter-spacing:3px;margin:0}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#222;color:#fff;padding:10px 13px;text-align:left;font-size:13px}
      td{border-bottom:1px solid #eee;padding:9px 13px;font-size:13px}
      .totals{width:300px;float:right;border:1px solid #eee;padding:16px;border-radius:4px}
      .totals div{display:flex;justify-content:space-between;margin-bottom:6px}
      .big{font-size:18px;font-weight:bold;border-top:2px solid #222;padding-top:8px;margin-top:8px}
      .status{display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:bold}
      @media print{body{margin:20px auto}}
    </style></head><body>
    <div class="header">
      <div><h1>INVOICE</h1><p style="margin:8px 0 0;color:#666">${c.invoiceNum}</p></div>
      <div style="text-align:right">
        <span class="status" style="background:${c.status === "Paid" ? "#22c55e" : c.status === "Overdue" ? "#ef4444" : "#94a3b8"};color:white">${c.status}</span>
        <p style="margin:8px 0 0"><strong>Date:</strong> ${c.date}</p>
        <p><strong>Due:</strong> ${c.dueDate || "Upon Receipt"}</p>
      </div>
    </div>
    <p><strong>Bill To:</strong><br>${c.clientName}<br>${(c.address || "").replace(/\n/g, "<br>")}</p>
    <table>
      <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Unit Cost</th><th>Markup</th><th>Total</th></tr></thead>
      <tbody>${(c.items || []).map(i => `<tr>
        <td>${i.description || ""}</td><td>${i.qty}</td><td>${i.unit}</td>
        <td>${fmtExact(i.unitCost)}</td><td>${i.markup}%</td>
        <td><strong>${fmtExact((parseFloat(i.qty)||0)*(parseFloat(i.unitCost)||0)*(1+(parseFloat(i.markup)||0)/100))}</strong></td>
      </tr>`).join("")}</tbody>
    </table>
    <div class="totals">
      <div><span>Subtotal</span><span>${fmtExact(invSub)}</span></div>
      <div><span>Markup</span><span>${fmtExact(invMkp)}</span></div>
      <div><span>Invoice Total</span><span>${fmtExact(total)}</span></div>
      ${c.paidAmount > 0 ? `<div><span>Amount Paid</span><span>(${fmtExact(c.paidAmount)})</span></div>` : ""}
      <div class="big"><span>Balance Due</span><span>${fmtExact(total - (parseFloat(c.paidAmount)||0))}</span></div>
    </div>
    <div style="clear:both"></div>
    ${c.notes ? `<p style="margin-top:40px;font-size:13px;color:#666;border-top:1px solid #eee;padding-top:16px">${c.notes}</p>` : ""}
    </body></html>`;
    openDocWindow(html, `Invoice_${c.invoiceNum}_${c.clientName||"Client"}`);
  };

  const totalInvoiced = invoices.reduce((s, i) => s + calcTotal(i), 0);
  const totalPaid = invoices.reduce((s, i) => s + parseFloat(i.paidAmount || 0), 0);
  const outstanding = totalInvoiced - totalPaid;

  const FormContent = () => (
    <div style={{ padding: isMobile ? 16 : 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card>
          <Field label="Invoice #" value={form.invoiceNum || ""} onChange={v => setForm(f => ({ ...f, invoiceNum: v }))} />
          <Field label="Client Name" value={form.clientName || ""} onChange={v => setForm(f => ({ ...f, clientName: v }))} />
          <Field label="Client Address" value={form.address || ""} onChange={v => setForm(f => ({ ...f, address: v }))} />
          <div>
            <Label>Status</Label>
            <select value={form.status || "Draft"} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {["Draft", "Sent", "Partially Paid", "Paid", "Overdue"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </Card>
        <Card>
          <Field label="Invoice Date" value={form.date || today()} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" />
          <Field label="Due Date" value={form.dueDate || ""} onChange={v => setForm(f => ({ ...f, dueDate: v }))} type="date" />
          <Field label="Amount Paid to Date ($)" value={form.paidAmount || ""} onChange={v => setForm(f => ({ ...f, paidAmount: v }))} type="number" min="0" />
          <div style={{ background: G.bg, borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: G.muted }}>Invoice Total</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700 }}>{fmtExact(fTotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Balance Due</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 18, fontWeight: 700, color: fBalance > 0 ? G.red : G.green }}>{fmtExact(fBalance)}</span>
            </div>
          </div>
        </Card>
      </div>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <Label style={{ marginBottom: 0 }}>Line Items ({(form.items || []).length})</Label>
          <Btn variant="ghost" onClick={() => setForm(f => ({ ...f, items: [...(f.items || []), emptyItem()] }))} style={{ padding: "8px 14px", fontSize: 13 }}>+ Item</Btn>
        </div>
        {(form.items || []).map(item => (
          <LineItemRow key={item.id} item={item} isMobile={isMobile}
            onChange={(k, v) => updateItem(item.id, k, v)}
            onRemove={() => setForm(f => ({ ...f, items: f.items.filter(i => i.id !== item.id) }))}
          />
        ))}
        {!isMobile && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 24, marginTop: 16, paddingTop: 12, borderTop: `1px solid ${G.border}` }}>
            <AmountPill label="Subtotal" value={(form.items || []).reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.unitCost) || 0), 0)} />
            <AmountPill label="Markup" value={(form.items || []).reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.unitCost) || 0) * ((parseFloat(i.markup) || 0) / 100), 0)} color={G.blue} />
            <AmountPill label="Total" value={fTotal} color={G.accent} />
          </div>
        )}
      </Card>
      <Card>
        <Field label="Notes / Payment Instructions" value={form.notes || ""} onChange={v => setForm(f => ({ ...f, notes: v }))} placeholder="Thank you! Please pay within 30 days." multiline rows={3} />
      </Card>
    </div>
  );

  if (isMobile && view === "list") return (
    <div style={{ paddingBottom: 80 }}>
      <MobileHeader title="Invoices" right={<Btn onClick={openNew} style={{ padding: "8px 16px", fontSize: 14 }}>+ New</Btn>} />
      <div style={{ padding: "16px 16px 0" }}>
        {/* Summary */}
        <Card style={{ marginBottom: 16, background: `linear-gradient(135deg, ${G.accent}12, transparent)`, border: `1px solid ${G.accent}33` }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <AmountPill label="Invoiced" value={totalInvoiced} />
            <AmountPill label="Collected" value={totalPaid} color={G.green} />
            <AmountPill label="Outstanding" value={outstanding} color={outstanding > 0 ? G.red : G.green} />
          </div>
        </Card>
        {estimates.length > 0 && (
          <Card style={{ marginBottom: 16 }}>
            <Label>Quick Invoice from Estimate</Label>
            <select onChange={e => { const est = estimates.find(x => x.id === e.target.value); if (est) openFromEst(est); e.target.value = ""; }} style={{ marginTop: 4 }}>
              <option value="">Select estimate…</option>
              {estimates.map(e => <option key={e.id} value={e.id}>{e.clientName} – {fmt(e.items?.reduce((s, i) => s + i.qty * i.unitCost * (1 + i.markup / 100), 0))}</option>)}
            </select>
          </Card>
        )}
        {invoices.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: G.muted }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>No invoices yet</div>
          </div>
        )}
        {invoices.map(inv => {
          const total = calcTotal(inv);
          const bal = total - parseFloat(inv.paidAmount || 0);
          return (
            <Card key={inv.id} className="tap-card" onClick={() => open(inv)} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14, marginBottom: 2, color: G.muted }}>{inv.invoiceNum}</div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{inv.clientName}</div>
                  <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>Due: {inv.dueDate || "Upon receipt"}</div>
                  <Badge color={inv.status === "Paid" ? G.green : inv.status === "Overdue" ? G.red : inv.status === "Sent" ? G.blue : G.muted}>{inv.status}</Badge>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 20, fontWeight: 700, color: G.accent }}>{fmt(total)}</div>
                  {bal > 0 && <div style={{ fontSize: 12, color: G.red, marginTop: 3 }}>Balance: {fmt(bal)}</div>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if (isMobile && view === "form") return (
    <div style={{ paddingBottom: 100 }} className="slide-up">
      <MobileHeader
        title={form.invoiceNum || "New Invoice"}
        onBack={() => setView("list")}
        right={
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={save} style={{ padding: "8px 14px", fontSize: 13 }}>💾 Save</Btn>
            <Btn variant="blue" onClick={printInvoice} style={{ padding: "8px 14px", fontSize: 13 }}>🖨️</Btn>
          </div>
        }
      />
      <FormContent />
    </div>
  );

  // Desktop
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ width: 280, flexShrink: 0, overflowY: "auto" }}>
        <SectionTitle title="Invoices" action={<Btn onClick={openNew} style={{ padding: "8px 16px", fontSize: 13 }}>+ New</Btn>} />
        <Card style={{ marginBottom: 16 }}>
          {[["Invoiced", totalInvoiced, G.text], ["Collected", totalPaid, G.green], ["Outstanding", outstanding, outstanding > 0 ? G.red : G.text]].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: G.muted }}>{l}</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: c }}>{fmtExact(v)}</span>
            </div>
          ))}
        </Card>
        {estimates.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <Label>From Estimate</Label>
            <select onChange={e => { const est = estimates.find(x => x.id === e.target.value); if (est) openFromEst(est); e.target.value = ""; }} style={{ marginTop: 4 }}>
              <option value="">Select estimate…</option>
              {estimates.map(e => <option key={e.id} value={e.id}>{e.clientName} – {fmt(e.items?.reduce((s, i) => s + i.qty * i.unitCost * (1 + i.markup / 100), 0))}</option>)}
            </select>
          </div>
        )}
        {invoices.map(inv => {
          const total = calcTotal(inv);
          return (
            <Card key={inv.id} className="tap-card" onClick={() => open(inv)} style={{ marginBottom: 10, cursor: "pointer", border: activeId === inv.id ? `1.5px solid ${G.accent}` : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: G.muted, fontFamily: "'JetBrains Mono'" }}>{inv.invoiceNum}</span>
                <Badge color={inv.status === "Paid" ? G.green : inv.status === "Overdue" ? G.red : G.muted}>{inv.status}</Badge>
              </div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{inv.clientName}</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 16, fontWeight: 700, color: G.accent }}>{fmtExact(total)}</div>
            </Card>
          );
        })}
      </div>
      {(activeId || view === "form") && (
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <SectionTitle title={form.invoiceNum || "New Invoice"} sub={form.clientName} />
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" onClick={save}>💾 Save</Btn>
              <Btn variant="blue" onClick={printInvoice}>🖨️ Print / PDF</Btn>
            </div>
          </div>
          <FormContent />
        </div>
      )}
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
const load = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};

const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.warn("localStorage write failed:", e); }
};

const usePersisted = (key, initial = []) => {
  const [state, setState] = useState(() => load(key, initial));
  const set = (updater) => {
    setState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      save(key, next);
      return next;
    });
  };
  return [state, set];
};

// ─── SYNC DOT ─────────────────────────────────────────────────────────────────
const SyncDot = ({ status }) => {
  const colors = { saved: G.green, saving: G.accent };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: colors[status] || G.muted }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: colors[status] || G.green }} />
      {status === "saving" ? "Saving…" : "Saved locally"}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState("estimate");
  const [syncStatus, setSyncStatus] = useState("saved");

  const [estimates, _setEstimates] = usePersisted("bp_estimates");
  const [contracts, _setContracts] = usePersisted("bp_contracts");
  const [projects, _setProjects]   = usePersisted("bp_projects");
  const [invoices, _setInvoices]   = usePersisted("bp_invoices");

  // Flash "Saving…" briefly on every write so user knows data is persisted
  const withSync = (setter) => (updater) => {
    setSyncStatus("saving");
    setter(updater);
    setTimeout(() => setSyncStatus("saved"), 600);
  };

  const setEstimates = withSync(_setEstimates);
  const setContracts = withSync(_setContracts);
  const setProjects  = withSync(_setProjects);
  const setInvoices  = withSync(_setInvoices);

  const handleCreateContract = (estimateForm) => {
    const existing = contracts.find(c => c.estimateId === estimateForm.id);
    if (existing) { setTab("contract"); return; }
    const nc = {
      ...estimateForm,
      id: uid(),
      estimateId: estimateForm.id,
      date: today(),
      status: "Draft",
      depositPct: 30,
      progressPct: 40,
    };
    setContracts(p => [nc, ...p]);
    setTab("contract");
  };

  // Auto-sync estimate changes → linked unsigned contracts
  useEffect(() => {
    _setContracts(prev => {
      const next = prev.map(contract => {
        if (contract.status === "Signed" || contract.status === "Void") return contract;
        if (!contract.estimateId) return contract;
        const source = estimates.find(e => e.id === contract.estimateId);
        if (!source) return contract;
        return {
          ...contract,
          clientName: source.clientName,
          projectAddress: source.projectAddress,
          notes: source.notes,
          items: source.items,
          lastSynced: new Date().toISOString(),
        };
      });
      save("bp_contracts", next);
      return next;
    });
  }, [estimates]);

  const counts = {
    estimate: estimates.length,
    contract: contracts.length,
    projects: projects.length,
    invoices: invoices.length,
  };

  const StorageBar = () => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 24px", borderTop: `1px solid ${G.border}`,
    }}>
      <SyncDot status={syncStatus} />
      <button
        onClick={() => {
          if (window.confirm("Clear ALL local data? This cannot be undone.")) {
            ["bp_estimates","bp_contracts","bp_projects","bp_invoices"].forEach(k => localStorage.removeItem(k));
            window.location.reload();
          }
        }}
        style={{ background: "none", border: "none", color: G.muted, fontSize: 11, cursor: "pointer", textDecoration: "underline" }}
      >
        Clear data
      </button>
    </div>
  );

  const views = {
    estimate: <EstimatorView estimates={estimates} setEstimates={setEstimates} onCreateContract={handleCreateContract} />,
    contract: <ContractView contracts={contracts} setContracts={setContracts} />,
    projects: <ProjectsView projects={projects} setProjects={setProjects} />,
    invoices: <InvoicesView invoices={invoices} setInvoices={setInvoices} estimates={estimates} />,
  };

  if (isMobile) return (
    <>
      <style>{globalStyles}</style>
      <div style={{ minHeight: "100vh", background: G.bg, paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: 96 }}>
        <div className="fade-in">{views[tab]}</div>
      </div>
      {/* Thin sync bar just above bottom nav */}
      <div style={{
        position: "fixed", bottom: 72, left: 0, right: 0, zIndex: 99,
        background: G.surface, borderTop: `1px solid ${G.border}`,
        padding: "5px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <SyncDot status={syncStatus} />
        <span style={{ fontSize: 11, color: G.muted }}>Data saved on this device</span>
      </div>
      <BottomNav active={tab} setActive={setTab} counts={counts} />
    </>
  );

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <div style={{
          width: 230, background: G.surface, borderRight: `1px solid ${G.border}`,
          display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, flexShrink: 0,
        }}>
          <Sidebar active={tab} setActive={setTab} counts={counts} />
          <StorageBar />
        </div>
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }} className="fade-in">
          {views[tab]}
        </main>
      </div>
    </>
  );
}

