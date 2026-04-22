import { useState, useEffect, useCallback, useRef } from "react";

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, w };
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const NEIGHBORHOODS = [
  "Arts District","Downtown LA","Silver Lake","Echo Park","Koreatown",
  "Culver City","Long Beach","Pasadena","Glendale","Burbank","Mid-City",
  "Highland Park","Atwater Village","Frogtown","El Segundo","Inglewood",
  "Santa Monica Adjacent","Hawthorne","Torrance","Alhambra"
];

const PROP_IMAGES = {
  loft: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80",
  ],
  apartment: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&q=80",
    "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  ],
  home: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  ],
};

const GALLERY_EXTRAS = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80",
  "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80",
  "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&q=80",
];

const LEAD_STATUSES = [
  { key:"new",       label:"New Lead",          color:"#4a9eff", bg:"#0a1a2e" },
  { key:"watching",  label:"Watching",          color:"#f0c040", bg:"#1e1800" },
  { key:"contacted", label:"Contacted",         color:"#c060ff", bg:"#180e24" },
  { key:"scheduled", label:"Viewing Scheduled", color:"#40d080", bg:"#081a10" },
  { key:"toured",    label:"Toured",            color:"#ff8040", bg:"#1e0c00" },
  { key:"passed",    label:"Passed",            color:"#888",    bg:"#141414" },
  { key:"hot",       label:"🔥 Top Pick",       color:"#ff4466", bg:"#1e0010" },
];

const SEED_LISTINGS = [
  { id:"s1",  type:"loft",      title:"Raw Concrete Loft — The Bloc",      neighborhood:"Arts District",   beds:1, price:2450, sqft:980,  floor:4,  walkscore:92, amenities:["Rooftop deck","Gym","Dog-friendly","Concierge"],       highlight:"14-ft ceilings, exposed brick & ductwork",   avail:"Now",    contact:"(213) 555-0191", imgKey:0 },
  { id:"s2",  type:"apartment", title:"Modern High-Rise — Grand Ave",       neighborhood:"Downtown LA",     beds:2, price:3400, sqft:1350, floor:18, walkscore:97, amenities:["Doorman","Pool","EV charging","City views"],           highlight:"Floor-to-ceiling glass, skyline panorama",   avail:"Nov 15", contact:"(213) 555-0342", imgKey:1 },
  { id:"s3",  type:"loft",      title:"Silver Lake Artist Live/Work",       neighborhood:"Silver Lake",     beds:1, price:2100, sqft:750,  floor:2,  walkscore:88, amenities:["Private patio","In-unit W/D","Skylights"],            highlight:"Steps from the reservoir path",              avail:"Now",    contact:"(323) 555-0185", imgKey:2 },
  { id:"s4",  type:"home",      title:"Craftsman Bungalow w/ Yard",         neighborhood:"Highland Park",   beds:2, price:2900, sqft:1100, floor:1,  walkscore:78, amenities:["Private yard","Parking","Laundry","Garage"],          highlight:"Original 1928 details, updated kitchen",     avail:"Dec 1",  contact:"(323) 555-0264", imgKey:3 },
  { id:"s5",  type:"apartment", title:"Echo Park Creative Flat",            neighborhood:"Echo Park",       beds:1, price:1950, sqft:820,  floor:3,  walkscore:85, amenities:["Balcony","Bike storage","Storage unit"],              highlight:"Lake views, vibrant murals district",        avail:"Now",    contact:"(323) 555-0417", imgKey:4 },
  { id:"s6",  type:"loft",      title:"Koreatown Tower Loft",               neighborhood:"Koreatown",       beds:2, price:2800, sqft:1180, floor:12, walkscore:95, amenities:["Gym","Rooftop","Metro 2 min","Doorman"],              highlight:"Panoramic city views, 24/7 building",        avail:"Now",    contact:"(213) 555-0533", imgKey:0 },
  { id:"s7",  type:"home",      title:"Mid-Century Modern — Culver City",   neighborhood:"Culver City",     beds:2, price:3200, sqft:1400, floor:1,  walkscore:82, amenities:["Pool","2-car garage","Updated baths","Smart home"],   highlight:"Designer reno, Expo Line nearby",            avail:"Now",    contact:"(310) 555-0628", imgKey:1 },
  { id:"s8",  type:"apartment", title:"Beachside 2BD — Long Beach",         neighborhood:"Long Beach",      beds:2, price:2500, sqft:1300, floor:5,  walkscore:79, amenities:["Ocean peek","Pool","Gym","Parking"],                  highlight:"Partial water views, open floor plan",       avail:"Now",    contact:"(562) 555-0771", imgKey:2 },
  { id:"s9",  type:"loft",      title:"Frogtown Warehouse Loft",            neighborhood:"Frogtown",        beds:1, price:1850, sqft:900,  floor:1,  walkscore:72, amenities:["Private entrance","Yard","Parking","High ceilings"],  highlight:"True warehouse conversion on river trail",   avail:"Now",    contact:"(323) 555-0844", imgKey:3 },
  { id:"s10", type:"home",      title:"Atwater Village Gem",                neighborhood:"Atwater Village", beds:2, price:2750, sqft:1050, floor:1,  walkscore:80, amenities:["Backyard","Driveway","Laundry","Quiet street"],       highlight:"Tree-lined block, steps to shops",           avail:"Jan 1",  contact:"(323) 555-0912", imgKey:4 },
  { id:"s11", type:"apartment", title:"Pasadena Old Town Flat",             neighborhood:"Pasadena",        beds:1, price:1800, sqft:700,  floor:2,  walkscore:81, amenities:["Walk to Shops","Parking","Laundry","Balcony"],        highlight:"1920s building, preserved character",        avail:"Now",    contact:"(626) 555-0103", imgKey:0 },
  { id:"s12", type:"loft",      title:"Arts District Penthouse",            neighborhood:"Arts District",   beds:2, price:3850, sqft:1650, floor:10, walkscore:92, amenities:["Private rooftop","Chef kitchen","2 parking","Doorman"],"highlight":"Top-floor loft w/ rooftop terrace",       avail:"Dec 15", contact:"(213) 555-0247", imgKey:2 },
];

const TYPE_ICONS  = { loft:"⬛", apartment:"🏢", home:"🏡" };
const TYPE_COLORS = { loft:"#c9a84c", apartment:"#4a9eff", home:"#40d080" };

function getImg(type, idx) {
  const arr = PROP_IMAGES[type] || PROP_IMAGES.apartment;
  return arr[idx % arr.length];
}
function galleryImgs(type, seed) {
  const base = PROP_IMAGES[type] || [];
  return [base[seed % base.length], ...GALLERY_EXTRAS.slice(0, 4)];
}

async function fetchMoreListings(existingIds, batch) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1400,
        messages: [{ role: "user", content: `Generate 6 fresh rental listings in Los Angeles / Southern California. Mix lofts, apartments, AND homes. Include 1BR ($1,700–$3,000) and 2BR ($2,200–$4,000). Neighborhoods: ${NEIGHBORHOODS.join(", ")}. ONLY return a raw JSON array, zero markdown or text outside it. Each object must have exactly: id (string "ai${batch}_N"), type ("loft"|"apartment"|"home"), title, neighborhood, beds (1|2), price (integer), sqft (integer), floor (integer), walkscore (60-98), amenities (array 3-4 strings), highlight (string), avail ("Now" or short date), contact (fake LA area code phone), imgKey (integer 0-4).` }]
      })
    });
    const data = await res.json();
    const txt = data.content?.find(b => b.type === "text")?.text || "[]";
    return JSON.parse(txt.replace(/```json|```/g, "").trim()).filter(l => !existingIds.has(l.id));
  } catch { return []; }
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const { isMobile, isTablet, isDesktop, w } = useBreakpoint();
  const [listings, setListings]   = useState(SEED_LISTINGS);
  const [leads, setLeads]         = useState({});
  const [nav, setNav]             = useState("discover");
  const [typeFilter, setTypeFilter] = useState("all");
  const [bedFilter, setBedFilter] = useState("all");
  const [selected, setSelected]   = useState(null);
  const [photoIdx, setPhotoIdx]   = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [autoOn, setAutoOn]       = useState(true);
  const [nextIn, setNextIn]       = useState(60);
  const [schedModal, setSchedModal] = useState(null);
  const [schedForm, setSchedForm] = useState({ date:"", time:"", note:"", type:"in-person" });
  const [toast, setToast]         = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteVal, setNoteVal]     = useState("");
  const [leadsTab, setLeadsTab]   = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const batchRef = useRef(1);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const showToast = (msg, color = "#40d080") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Storage ──
  useEffect(() => {
    (async () => {
      try { const r = await window.storage?.get("hf_leads"); if (r?.value) setLeads(JSON.parse(r.value)); } catch {}
      try { const r = await window.storage?.get("hf_listings"); if (r?.value) { const s = JSON.parse(r.value); if (s.length > 0) setListings(s); } } catch {}
    })();
  }, []);
  useEffect(() => { window.storage?.set("hf_leads", JSON.stringify(leads)).catch(()=>{}); }, [leads]);
  useEffect(() => { window.storage?.set("hf_listings", JSON.stringify(listings)).catch(()=>{}); }, [listings]);

  // ── Auto-refresh ──
  const doRefresh = useCallback(async () => {
    setRefreshing(true);
    const ids = new Set(listings.map(l => l.id));
    const fresh = await fetchMoreListings(ids, batchRef.current++);
    if (fresh.length > 0) {
      setListings(prev => [...fresh, ...prev].slice(0, 80));
      showToast(`✦ ${fresh.length} new properties added`);
    }
    setNextIn(60);
    setRefreshing(false);
  }, [listings]);

  useEffect(() => {
    if (!autoOn) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setNextIn(n => { if (n <= 1) { doRefresh(); return 60; } return n - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [autoOn, doRefresh]);

  // ── Lead helpers ──
  const saveLead    = id => { if (!leads[id]) { setLeads(p => ({ ...p, [id]: { status:"new", notes:"", added: new Date().toISOString() } })); showToast("♥ Saved to Leads"); } };
  const removeLead  = id => { setLeads(p => { const n={...p}; delete n[id]; return n; }); showToast("Removed", "#ff6666"); };
  const setStatus   = (id, status) => { setLeads(p => ({ ...p, [id]: { ...(p[id]||{}), status } })); showToast(LEAD_STATUSES.find(s=>s.key===status)?.label); };
  const saveNote    = id => { setLeads(p => ({ ...p, [id]: { ...(p[id]||{}), notes: noteVal } })); setEditingNote(null); showToast("Note saved"); };

  const scheduleViewing = () => {
    if (!schedForm.date || !schedForm.time) { showToast("Pick date & time", "#ff6666"); return; }
    const id = schedModal.id;
    setLeads(p => ({ ...p, [id]: { ...(p[id]||{}), status:"scheduled", viewingDate:schedForm.date, viewingTime:schedForm.time, viewingNote:schedForm.note, viewingType:schedForm.type } }));
    setSchedModal(null);
    showToast("📅 Viewing Scheduled!");
  };

  // ── Swipe for gallery ──
  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) setPhotoIdx(p => dx < 0 ? (p+1)%5 : (p-1+5)%5);
    touchStartX.current = null;
  };

  // ── Filter ──
  const visible = listings.filter(l => {
    const typeOk = typeFilter === "all" || l.type === typeFilter;
    if (bedFilter === "1") return typeOk && l.beds === 1 && l.price >= 1700 && l.price <= 3000;
    if (bedFilter === "2") return typeOk && l.beds === 2 && l.price >= 2200 && l.price <= 4000;
    return typeOk && l.price <= 4000;
  });

  const savedIds      = Object.keys(leads);
  const savedListings = listings.filter(l => savedIds.includes(l.id));
  const leadsFiltered = leadsTab === "scheduled" ? savedListings.filter(l => leads[l.id]?.status === "scheduled")
    : leadsTab === "hot"    ? savedListings.filter(l => leads[l.id]?.status === "hot")
    : leadsTab === "toured" ? savedListings.filter(l => leads[l.id]?.status === "toured")
    : savedListings;

  // ── Cols based on screen ──
  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  // ── Colors / shared styles ──
  const C = { bg:"#080810", card:"#0e0e1a", border:"#1e1e30", accent:"#c9a84c", text:"#e8e4dc", muted:"#555" };

  const navItems = [
    { k:"discover", icon:"◈", label:"Discover" },
    { k:"leads",    icon:"♥", label:"Leads" },
    { k:"schedule", icon:"📅", label:"Schedule" },
    { k:"map",      icon:"⊙", label:"Map" },
  ];

  const pct = (nextIn / 60) * 100;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"Georgia,serif" }}>

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position:"fixed", bottom: isMobile ? 84 : 28, left:"50%", transform:"translateX(-50%)", background:"#111", border:`1px solid ${toast.color}`, color:toast.color, padding:"10px 22px", borderRadius:30, fontSize:13, zIndex:9999, whiteSpace:"nowrap", boxShadow:"0 4px 24px #00000088", letterSpacing:"0.04em" }}>
          {toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{ background:"linear-gradient(180deg,#0e0e1a,#080810)", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ padding: isMobile ? "12px 16px" : "14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            <div style={{ width:34, height:34, background:"linear-gradient(135deg,#c9a84c,#8b5e14)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"bold", color:"#000", fontSize:16 }}>H</div>
            <div>
              <div style={{ fontSize: isMobile?16:20, fontWeight:"bold", letterSpacing:"0.06em" }}>HAUS<span style={{ color:C.accent }}>FIND</span></div>
              {!isMobile && <div style={{ fontSize:9, color:C.muted, letterSpacing:"0.14em", textTransform:"uppercase" }}>Southern California</div>}
            </div>
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display:"flex", gap:4 }}>
              {navItems.map(({ k, icon, label }) => (
                <button key={k} onClick={() => setNav(k)} style={{ background:nav===k?"#1a1a2e":"transparent", color:nav===k?C.accent:C.muted, border:`1px solid ${nav===k?"#c9a84c33":"transparent"}`, padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>
                  {icon} {label}
                </button>
              ))}
            </div>
          )}

          {/* Right controls */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
            {!isMobile && (
              <div style={{ fontSize:11, color: autoOn?"#40d080":C.muted, display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:autoOn?"#40d080":C.muted, boxShadow:autoOn?"0 0 6px #40d080":"" }} />
                {autoOn ? `${nextIn}s` : "Paused"}
              </div>
            )}
            <button onClick={() => setAutoOn(a => !a)} style={{ background:autoOn?"#0a1e0e":"#1a1a14", color:autoOn?"#40d080":C.muted, border:`1px solid ${autoOn?"#40d08033":C.border}`, padding:"6px 10px", borderRadius:14, cursor:"pointer", fontSize:11, fontFamily:"inherit" }}>
              {autoOn ? "⏸" : "▶"}
            </button>
            <button onClick={doRefresh} disabled={refreshing} style={{ background:"linear-gradient(135deg,#c9a84c,#8b5e14)", color:"#000", border:"none", padding: isMobile?"7px 10px":"7px 14px", borderRadius:14, cursor:"pointer", fontSize:12, fontWeight:"bold", fontFamily:"inherit", opacity:refreshing?0.6:1, whiteSpace:"nowrap" }}>
              {refreshing ? "⟳…" : isMobile ? "⟳" : "⟳ Pull Now"}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {autoOn && (
          <div style={{ height:2, background:"#111" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#c9a84c,#4a9eff)", transition:"width 1s linear" }} />
          </div>
        )}

        {/* Filter bar — desktop/tablet always visible; mobile toggle */}
        {(nav === "discover" || nav === "map") && (
          <>
            {isMobile && (
              <div style={{ padding:"8px 16px", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:12, color:C.muted }}>{visible.length} listings</div>
                <button onClick={() => setShowFilters(f => !f)} style={{ background:showFilters?"#c9a84c22":"transparent", color:C.accent, border:`1px solid #c9a84c44`, padding:"5px 14px", borderRadius:16, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                  ⚙ Filters {showFilters?"▲":"▼"}
                </button>
              </div>
            )}
            {(!isMobile || showFilters) && (
              <div style={{ padding: isMobile?"10px 16px 14px":"10px 24px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", background: isMobile?"#0a0a14":"transparent" }}>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", flex:1 }}>
                  {[["all","All Types"],["loft","⬛ Loft"],["apartment","🏢 Apt"],["home","🏡 Home"]].map(([v,l]) => (
                    <button key={v} onClick={() => { setTypeFilter(v); if(isMobile)setShowFilters(false); }} style={{ background:typeFilter===v?"#c9a84c22":"transparent", color:typeFilter===v?C.accent:C.muted, border:`1px solid ${typeFilter===v?"#c9a84c44":C.border}`, padding:"6px 12px", borderRadius:18, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>{l}</button>
                  ))}
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[["all","Any Budget"],["1","Solo 1BD"],["2","w/ Bro 2BD"]].map(([v,l]) => (
                    <button key={v} onClick={() => { setBedFilter(v); if(isMobile)setShowFilters(false); }} style={{ background:bedFilter===v?"#c9a84c22":"transparent", color:bedFilter===v?C.accent:C.muted, border:`1px solid ${bedFilter===v?"#c9a84c44":C.border}`, padding:"6px 12px", borderRadius:18, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>{l}</button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: isMobile ? "16px 12px" : "20px 24px", paddingBottom: isMobile ? 88 : 40, maxWidth: 1320, margin:"0 auto" }}>

        {/* ── DISCOVER ── */}
        {nav === "discover" && (
          <>
            {/* Stats row */}
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?3:6},1fr)`, gap: isMobile?8:12, marginBottom:20 }}>
              {[
                ["◈",visible.length,"Listings"],
                ["⬛",visible.filter(l=>l.type==="loft").length,"Lofts"],
                ["🏢",visible.filter(l=>l.type==="apartment").length,"Apts"],
                ["🏡",visible.filter(l=>l.type==="home").length,"Homes"],
                ["♥",savedIds.length,"Saved"],
                ["📅",Object.values(leads).filter(l=>l.status==="scheduled").length,"Sched."],
              ].map(([ic,v,lb],i) => (
                <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding: isMobile?"10px 8px":"14px 16px", textAlign:"center" }}>
                  <div style={{ fontSize: isMobile?14:18 }}>{ic}</div>
                  <div style={{ fontSize: isMobile?18:22, fontWeight:"bold", color:C.accent }}>{v}</div>
                  <div style={{ fontSize: isMobile?9:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>{lb}</div>
                </div>
              ))}
            </div>

            {/* Property grid */}
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap: isMobile?14:18 }}>
              {visible.map(l => {
                const lead   = leads[l.id];
                const status = LEAD_STATUSES.find(s => s.key === lead?.status);
                return (
                  <div key={l.id} onClick={() => { setSelected(l); setPhotoIdx(0); }} style={{ background:C.card, border:`1px solid ${lead?"#c9a84c33":C.border}`, borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"transform 0.18s", WebkitTapHighlightColor:"transparent" }}
                    onMouseEnter={e => !isMobile && (e.currentTarget.style.transform="translateY(-2px)")}
                    onMouseLeave={e => !isMobile && (e.currentTarget.style.transform="translateY(0)")}>
                    <div style={{ position:"relative", height: isMobile?180:195 }}>
                      <img src={getImg(l.type, l.imgKey)} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} loading="lazy" />
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 40%,#0e0e1a 100%)" }} />
                      <div style={{ position:"absolute", top:8, left:8, display:"flex", gap:5 }}>
                        <span style={{ background:TYPE_COLORS[l.type], color:"#000", fontSize:10, padding:"2px 7px", borderRadius:4, fontWeight:"bold" }}>{TYPE_ICONS[l.type]} {l.type.toUpperCase()}</span>
                        <span style={{ background:"#000a", color:"#e8e4dc", fontSize:10, padding:"2px 7px", borderRadius:4 }}>{l.beds}BD</span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); lead ? removeLead(l.id) : saveLead(l.id); }} style={{ position:"absolute", top:8, right:8, background:lead?"#c9a84c":"#000a", color:lead?"#000":"#fff", border:"none", width:32, height:32, borderRadius:"50%", cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent" }}>
                        {lead ? "♥" : "♡"}
                      </button>
                      {status && <div style={{ position:"absolute", bottom:8, left:8, background:status.bg, color:status.color, border:`1px solid ${status.color}44`, fontSize:10, padding:"2px 7px", borderRadius:4 }}>{status.label}</div>}
                      <div style={{ position:"absolute", bottom:8, right:8, background:"#000a", color:"#bbb", fontSize:10, padding:"2px 7px", borderRadius:4 }}>🚶{l.walkscore}</div>
                    </div>
                    <div style={{ padding: isMobile?"10px 12px 12px":"12px 14px 14px" }}>
                      <div style={{ fontSize:11, color:TYPE_COLORS[l.type], textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:3 }}>{l.neighborhood}</div>
                      <div style={{ fontSize: isMobile?14:15, fontWeight:"bold", color:C.text, marginBottom:4, lineHeight:1.3 }}>{l.title}</div>
                      <div style={{ fontSize:12, color:"#666", fontStyle:"italic", marginBottom:8 }}>"{l.highlight}"</div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize: isMobile?19:21, fontWeight:"bold" }}>${l.price.toLocaleString()}<span style={{ fontSize:11, color:C.muted, fontWeight:"normal" }}>/mo</span></div>
                          <div style={{ fontSize:10, color:C.muted }}>{l.sqft.toLocaleString()} sqft</div>
                        </div>
                        <div style={{ fontSize:10, color:l.avail==="Now"?"#40d080":"#aaa", background:l.avail==="Now"?"#081a10":"#111", padding:"3px 8px", borderRadius:4, border:`1px solid ${l.avail==="Now"?"#40d08033":"#222"}` }}>
                          {l.avail==="Now"?"● Now":"○ "+l.avail}
                        </div>
                      </div>
                      {!isMobile && (
                        <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:8 }}>
                          {l.amenities.slice(0,3).map(a => (<span key={a} style={{ background:"#111", color:"#666", fontSize:10, padding:"2px 7px", borderRadius:3, border:`1px solid ${C.border}` }}>{a}</span>))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {visible.length === 0 && (
              <div style={{ textAlign:"center", padding:"60px 20px", color:C.muted, border:`1px dashed ${C.border}`, borderRadius:12 }}>
                <div style={{ fontSize:32, marginBottom:10 }}>◎</div>
                <div>No listings match your filters.</div>
                <div style={{ fontSize:12, marginTop:6 }}>Adjust filters or pull new listings.</div>
              </div>
            )}
          </>
        )}

        {/* ── LEADS ── */}
        {nav === "leads" && (
          <div>
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize: isMobile?18:22, fontWeight:"bold", marginBottom:4 }}>My Leads</div>
              <div style={{ fontSize:12, color:C.muted }}>{savedIds.length} saved · Track, note & schedule viewings</div>
            </div>

            {/* Sub-tabs */}
            <div style={{ display:"flex", gap:6, marginBottom:18, overflowX:"auto", paddingBottom:4 }}>
              {[["all","All"],["hot","🔥 Hot"],["scheduled","📅 Scheduled"],["toured","Toured"]].map(([k,l]) => (
                <button key={k} onClick={() => setLeadsTab(k)} style={{ background:leadsTab===k?"#c9a84c22":"#0e0e1a", color:leadsTab===k?C.accent:C.muted, border:`1px solid ${leadsTab===k?"#c9a84c44":C.border}`, padding:"6px 14px", borderRadius:18, cursor:"pointer", fontSize:12, fontFamily:"inherit", whiteSpace:"nowrap", flexShrink:0 }}>{l}</button>
              ))}
            </div>

            {leadsFiltered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#333", border:`1px dashed ${C.border}`, borderRadius:14 }}>
                <div style={{ fontSize:38, marginBottom:10 }}>♡</div>
                <div style={{ color:C.muted }}>No leads here yet.</div>
                <div style={{ fontSize:12, color:"#444", marginTop:6 }}>Heart a property in Discover to start tracking.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {leadsFiltered.map(l => {
                  const lead   = leads[l.id] || {};
                  const status = LEAD_STATUSES.find(s => s.key === lead.status) || LEAD_STATUSES[0];
                  return (
                    <div key={l.id} style={{ background:C.card, border:`1px solid ${status.color}22`, borderRadius:12, overflow:"hidden" }}>
                      <div style={{ display:"flex", flexDirection: isMobile?"column":"row" }}>
                        {/* Image */}
                        <div style={{ width: isMobile?"100%":160, height: isMobile?160:"auto", position:"relative", flexShrink:0 }}>
                          <img src={getImg(l.type, l.imgKey)} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", minHeight: isMobile?0:130 }} />
                          <div style={{ position:"absolute", top:8, left:8, background:TYPE_COLORS[l.type], color:"#000", fontSize:10, padding:"2px 7px", borderRadius:3, fontWeight:"bold" }}>{l.type.toUpperCase()}</div>
                        </div>
                        {/* Body */}
                        <div style={{ flex:1, padding: isMobile?"12px":"16px 18px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:8, marginBottom:8 }}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:11, color:TYPE_COLORS[l.type], textTransform:"uppercase" }}>{l.neighborhood}</div>
                              <div style={{ fontSize: isMobile?15:17, fontWeight:"bold", color:C.text, marginTop:2 }}>{l.title}</div>
                              <div style={{ fontSize: isMobile?17:19, color:C.accent, marginTop:2, fontWeight:"bold" }}>${l.price.toLocaleString()}<span style={{ fontSize:11, color:C.muted, fontWeight:"normal" }}>/mo</span></div>
                            </div>
                            <select value={lead.status||"new"} onChange={e => setStatus(l.id, e.target.value)} style={{ background:status.bg, color:status.color, border:`1px solid ${status.color}44`, padding:"6px 10px", borderRadius:8, fontSize:12, cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>
                              {LEAD_STATUSES.map(s => (<option key={s.key} value={s.key}>{s.label}</option>))}
                            </select>
                          </div>

                          <div style={{ fontSize:12, color:C.muted, marginBottom:8, display:"flex", gap:12, flexWrap:"wrap" }}>
                            <span>📞 {l.contact}</span>
                            {lead.viewingDate && <span style={{ color:"#40d080" }}>📅 {lead.viewingDate} {lead.viewingTime}</span>}
                          </div>

                          {/* Note */}
                          {editingNote === l.id ? (
                            <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                              <textarea defaultValue={lead.notes} onChange={e => setNoteVal(e.target.value)} style={{ flex:1, background:"#111", border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"8px", fontSize:12, resize:"vertical", minHeight:56, fontFamily:"inherit" }} placeholder="Notes…" />
                              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                                <button onClick={() => saveNote(l.id)} style={{ background:C.accent, color:"#000", border:"none", padding:"6px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>✓</button>
                                <button onClick={() => setEditingNote(null)} style={{ background:"#1a1a24", color:C.muted, border:`1px solid ${C.border}`, padding:"6px 10px", borderRadius:6, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>✕</button>
                              </div>
                            </div>
                          ) : (
                            <div onClick={() => { setEditingNote(l.id); setNoteVal(lead.notes||""); }} style={{ fontSize:12, color:lead.notes?"#999":"#444", background:"#111", border:`1px dashed ${C.border}`, borderRadius:6, padding:"7px 10px", cursor:"text", fontStyle:lead.notes?"normal":"italic", marginBottom:10 }}>
                              {lead.notes || "Tap to add notes…"}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                            <button onClick={() => { setSchedModal(l); setSchedForm({ date:lead.viewingDate||"", time:lead.viewingTime||"", note:lead.viewingNote||"", type:lead.viewingType||"in-person" }); }} style={{ background:"#0a1e0e", color:"#40d080", border:"1px solid #40d08033", padding:"7px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>
                              📅 {lead.viewingDate?"Reschedule":"Schedule"}
                            </button>
                            <button onClick={() => { setSelected(l); setPhotoIdx(0); }} style={{ background:"#1a1a24", color:C.accent, border:`1px solid #c9a84c33`, padding:"7px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>Photos</button>
                            <a href={`https://maps.google.com/?q=${encodeURIComponent(l.title+" "+l.neighborhood+" Los Angeles")}`} target="_blank" rel="noreferrer" style={{ background:"#0e0e1a", color:"#4a9eff", border:"1px solid #4a9eff33", padding:"7px 12px", borderRadius:8, fontSize:12, textDecoration:"none" }}>📍 Map</a>
                            <a href={`tel:${l.contact}`} style={{ background:"#0e0e1a", color:C.muted, border:`1px solid ${C.border}`, padding:"7px 12px", borderRadius:8, fontSize:12, textDecoration:"none" }}>📞</a>
                            <button onClick={() => removeLead(l.id)} style={{ background:"#1a0808", color:"#ff4444", border:"1px solid #ff444422", padding:"7px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontFamily:"inherit" }}>✕</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {nav === "schedule" && (
          <div>
            <div style={{ fontSize: isMobile?18:22, fontWeight:"bold", marginBottom:4 }}>Viewing Schedule</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Full pipeline — outreach to decision</div>

            {/* Pipeline (horizontal scroll on mobile) */}
            <div style={{ display:"grid", gridTemplateColumns:`repeat(${isMobile?2:isTablet?4:7},1fr)`, gap:12, marginBottom:28, overflowX: isMobile?"auto":"visible" }}>
              {LEAD_STATUSES.map(s => {
                const inS = savedListings.filter(l => (leads[l.id]?.status||"new") === s.key);
                return (
                  <div key={s.key} style={{ background:"#0a0a12", border:`1px solid ${s.color}22`, borderRadius:10, padding:"12px", minWidth: isMobile?160:0 }}>
                    <div style={{ fontSize:11, color:s.color, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10, display:"flex", justifyContent:"space-between" }}>
                      <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.label}</span>
                      <span style={{ background:s.bg, padding:"1px 6px", borderRadius:8, flexShrink:0, marginLeft:4 }}>{inS.length}</span>
                    </div>
                    {inS.slice(0,3).map(l => (
                      <div key={l.id} onClick={() => { setSelected(l); setPhotoIdx(0); }} style={{ background:"#111", border:`1px solid ${s.color}22`, borderRadius:6, padding:"8px", marginBottom:6, cursor:"pointer" }}>
                        <div style={{ fontSize:10, color:TYPE_COLORS[l.type] }}>{l.neighborhood}</div>
                        <div style={{ fontSize:12, color:C.text, fontWeight:"bold", marginTop:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.title}</div>
                        <div style={{ fontSize:12, color:C.accent }}>${l.price.toLocaleString()}</div>
                        {leads[l.id]?.viewingDate && <div style={{ fontSize:9, color:"#40d080", marginTop:4, background:"#081a10", padding:"1px 5px", borderRadius:3 }}>{leads[l.id].viewingDate}</div>}
                      </div>
                    ))}
                    {inS.length === 0 && <div style={{ fontSize:10, color:"#333", fontStyle:"italic" }}>Empty</div>}
                  </div>
                );
              })}
            </div>

            {/* Upcoming viewings */}
            <div style={{ fontSize:16, fontWeight:"bold", marginBottom:14, color:C.text }}>📅 Upcoming Viewings</div>
            {savedListings.filter(l=>leads[l.id]?.viewingDate).length === 0 ? (
              <div style={{ color:"#333", fontSize:13, fontStyle:"italic", padding:24, border:`1px dashed ${C.border}`, borderRadius:10, textAlign:"center" }}>No viewings scheduled. Save leads and tap "Schedule" to book a viewing.</div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {savedListings.filter(l=>leads[l.id]?.viewingDate).sort((a,b) => new Date(leads[a.id].viewingDate) - new Date(leads[b.id].viewingDate)).map(l => {
                  const ld = leads[l.id];
                  return (
                    <div key={l.id} style={{ background:C.card, border:"1px solid #40d08022", borderRadius:10, display:"flex", overflow:"hidden" }}>
                      <div style={{ width:6, background:"#40d080", flexShrink:0 }} />
                      {!isMobile && <img src={getImg(l.type,l.imgKey)} alt="" style={{ width:90, objectFit:"cover" }} />}
                      <div style={{ flex:1, padding:"14px 16px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
                          <div>
                            <div style={{ fontSize:11, color:TYPE_COLORS[l.type], textTransform:"uppercase" }}>{l.neighborhood}</div>
                            <div style={{ fontSize:15, fontWeight:"bold", color:C.text, marginTop:2 }}>{l.title}</div>
                            <div style={{ fontSize:14, color:C.accent }}>${l.price.toLocaleString()}/mo</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:16, fontWeight:"bold", color:"#40d080" }}>{ld.viewingDate}</div>
                            <div style={{ fontSize:13, color:"#40d08099" }}>⏰ {ld.viewingTime}</div>
                            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", marginTop:2 }}>{ld.viewingType}</div>
                          </div>
                        </div>
                        {ld.viewingNote && <div style={{ fontSize:12, color:"#666", marginTop:8, background:"#111", padding:"6px 10px", borderRadius:6, fontStyle:"italic" }}>{ld.viewingNote}</div>}
                        <div style={{ display:"flex", gap:10, marginTop:10, flexWrap:"wrap", fontSize:12 }}>
                          <span style={{ color:C.muted }}>📞 {l.contact}</span>
                          <button onClick={() => { setSchedModal(l); setSchedForm({ date:ld.viewingDate, time:ld.viewingTime, note:ld.viewingNote||"", type:ld.viewingType||"in-person" }); }} style={{ background:"transparent", color:C.accent, border:"none", fontSize:12, cursor:"pointer", fontFamily:"inherit", padding:0 }}>✏️ Edit</button>
                          <button onClick={() => setStatus(l.id,"toured")} style={{ background:"transparent", color:"#40d080", border:"none", fontSize:12, cursor:"pointer", fontFamily:"inherit", padding:0 }}>✓ Toured</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MAP ── */}
        {nav === "map" && (
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":isTablet?"1fr":"1fr 300px", gap:16 }}>
            <div style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${C.border}`, minHeight:400 }}>
              <iframe title="LA Properties" width="100%" height={isMobile?340:520} style={{ border:0, display:"block" }} loading="lazy"
                src="https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=loft+apartment+homes+for+rent+Los+Angeles+California&center=34.0522,-118.2437&zoom=11"
              />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, overflowY:"auto", maxHeight: isMobile?"none":540 }}>
              {[...new Set(visible.map(l=>l.neighborhood))].map(nbh => {
                const cnt = visible.filter(l=>l.neighborhood===nbh).length;
                const types = [...new Set(visible.filter(l=>l.neighborhood===nbh).map(l=>l.type))];
                return (
                  <div key={nbh} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <div style={{ fontSize:14, fontWeight:"bold", color:C.text }}>{nbh}</div>
                      <div style={{ fontSize:11, color:C.accent, background:"#c9a84c11", padding:"2px 8px", borderRadius:10 }}>{cnt}</div>
                    </div>
                    <div style={{ display:"flex", gap:4, marginTop:5 }}>
                      {types.map(t => (<span key={t} style={{ fontSize:10, color:TYPE_COLORS[t], background:TYPE_COLORS[t]+"11", padding:"1px 6px", borderRadius:3 }}>{TYPE_ICONS[t]} {t}</span>))}
                    </div>
                    <a href={`https://maps.google.com/?q=apartments+${encodeURIComponent(nbh)}+Los+Angeles`} target="_blank" rel="noreferrer" style={{ display:"inline-block", marginTop:6, fontSize:10, color:"#4a9eff", textDecoration:"none" }}>Open Maps →</a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#0e0e1a", borderTop:`1px solid ${C.border}`, display:"flex", zIndex:100, paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
          {navItems.map(({ k, icon, label }) => (
            <button key={k} onClick={() => setNav(k)} style={{ flex:1, background:"transparent", color:nav===k?C.accent:C.muted, border:"none", padding:"10px 4px 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, fontFamily:"inherit", WebkitTapHighlightColor:"transparent", position:"relative" }}>
              {k === "leads" && savedIds.length > 0 && (
                <div style={{ position:"absolute", top:6, right:"18%", width:16, height:16, background:"#ff4466", borderRadius:"50%", fontSize:9, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"bold" }}>{savedIds.length}</div>
              )}
              <div style={{ fontSize:18 }}>{icon}</div>
              <div style={{ fontSize:10, letterSpacing:"0.04em", textTransform:"uppercase" }}>{label}</div>
              {nav === k && <div style={{ position:"absolute", top:0, left:"25%", right:"25%", height:2, background:C.accent, borderRadius:1 }} />}
            </button>
          ))}
        </div>
      )}

      {/* ── LISTING DETAIL MODAL ── */}
      {selected && (
        <div style={{ position:"fixed", inset:0, background:"#000000dd", zIndex:200, display:"flex", alignItems: isMobile?"flex-end":"center", justifyContent:"center", padding: isMobile?0:16 }} onClick={() => setSelected(null)}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius: isMobile?"16px 16px 0 0":16, width:"100%", maxWidth: isMobile?"100%":820, maxHeight: isMobile?"94vh":"92vh", overflow:"auto" }} onClick={e => e.stopPropagation()}>
            {/* Gallery */}
            <div style={{ position:"relative", height: isMobile?240:340 }} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <img src={galleryImgs(selected.type, selected.imgKey)[photoIdx]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius: isMobile?"16px 16px 0 0":"16px 16px 0 0" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 50%,#0e0e1a 100%)", borderRadius: isMobile?"16px 16px 0 0":"16px 16px 0 0" }} />
              <button onClick={() => setSelected(null)} style={{ position:"absolute", top:14, right:14, background:"#000a", color:"#fff", border:"none", width:34, height:34, borderRadius:"50%", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", WebkitTapHighlightColor:"transparent" }}>×</button>
              {/* Dots */}
              <div style={{ position:"absolute", bottom:14, left:"50%", transform:"translateX(-50%)", display:"flex", gap:5 }}>
                {galleryImgs(selected.type, selected.imgKey).map((_,i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)} style={{ width:i===photoIdx?20:7, height:7, background:i===photoIdx?"#c9a84c":"#ffffff44", border:"none", borderRadius:4, cursor:"pointer", transition:"all 0.2s" }} />
                ))}
              </div>
              {!isMobile && <>
                <button onClick={() => setPhotoIdx(p => (p-1+5)%5)} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", background:"#000a", color:"#fff", border:"none", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:20 }}>‹</button>
                <button onClick={() => setPhotoIdx(p => (p+1)%5)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"#000a", color:"#fff", border:"none", width:36, height:36, borderRadius:"50%", cursor:"pointer", fontSize:20 }}>›</button>
              </>}
              <div style={{ position:"absolute", top:14, left:14 }}>
                <span style={{ background:TYPE_COLORS[selected.type], color:"#000", fontSize:11, padding:"3px 10px", borderRadius:4, fontWeight:"bold" }}>{TYPE_ICONS[selected.type]} {selected.type.toUpperCase()}</span>
              </div>
              {isMobile && <div style={{ position:"absolute", bottom:22, width:"100%", textAlign:"center", fontSize:10, color:"#ffffff66" }}>Swipe to browse photos</div>}
            </div>

            {/* Detail body */}
            <div style={{ padding: isMobile?16:28 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:16 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, color:TYPE_COLORS[selected.type], textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>{selected.neighborhood}</div>
                  <div style={{ fontSize: isMobile?18:24, fontWeight:"bold", color:C.text, lineHeight:1.2 }}>{selected.title}</div>
                  <div style={{ fontSize:13, color:"#666", fontStyle:"italic", marginTop:4 }}>"{selected.highlight}"</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontSize: isMobile?24:30, fontWeight:"bold" }}>${selected.price.toLocaleString()}<span style={{ fontSize:12, color:C.muted, fontWeight:"normal" }}>/mo</span></div>
                  <div style={{ fontSize:11, color:C.muted }}>{selected.beds}BD · {selected.sqft.toLocaleString()} sqft</div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 }}>
                {[["🛏",selected.beds,"Beds"],["📐",selected.sqft.toLocaleString(),"Sqft"],["🚶",selected.walkscore,"Walk"],["📅",selected.avail,"Avail"]].map(([ic,v,lb]) => (
                  <div key={lb} style={{ background:"#111", border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 6px", textAlign:"center" }}>
                    <div style={{ fontSize:16 }}>{ic}</div>
                    <div style={{ fontSize: isMobile?13:15, fontWeight:"bold", color:C.accent, margin:"3px 0" }}>{v}</div>
                    <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase" }}>{lb}</div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:7 }}>Amenities</div>
                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  {selected.amenities.map(a => (<span key={a} style={{ background:"#111", color:"#aaa", fontSize:12, padding:"5px 12px", borderRadius:18, border:`1px solid ${C.border}` }}>✓ {a}</span>))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button onClick={() => { leads[selected.id] ? removeLead(selected.id) : saveLead(selected.id); }} style={{ flex:1, minWidth:120, background:leads[selected.id]?"#c9a84c":"#111", color:leads[selected.id]?"#000":"#c9a84c", border:"1px solid #c9a84c44", padding:"12px", borderRadius:8, cursor:"pointer", fontSize:14, fontFamily:"inherit" }}>
                  {leads[selected.id] ? "♥ In Leads" : "♡ Save"}
                </button>
                <button onClick={() => { saveLead(selected.id); setSchedModal(selected); setSchedForm({date:"",time:"",note:"",type:"in-person"}); setSelected(null); }} style={{ flex:1, minWidth:140, background:"#0a1e0e", color:"#40d080", border:"1px solid #40d08033", padding:"12px", borderRadius:8, cursor:"pointer", fontSize:14, fontFamily:"inherit" }}>
                  📅 Schedule
                </button>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(selected.title+" "+selected.neighborhood+" LA")}`} target="_blank" rel="noreferrer" style={{ flex:1, minWidth:100, background:"#111", color:"#4a9eff", border:"1px solid #4a9eff33", padding:"12px", borderRadius:8, fontSize:14, textDecoration:"none", textAlign:"center" }}>
                  📍 Map
                </a>
              </div>

              <div style={{ marginTop:14, padding:"12px 14px", background:"#0a0a14", border:"1px solid #c9a84c22", borderRadius:8, fontSize:12, color:"#666", lineHeight:1.6 }}>
                📞 Contact: <strong style={{ color:"#aaa" }}>{selected.contact}</strong> — Ask about move-in specials and availability.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE VIEWING MODAL ── */}
      {schedModal && (
        <div style={{ position:"fixed", inset:0, background:"#000000dd", zIndex:300, display:"flex", alignItems: isMobile?"flex-end":"center", justifyContent:"center", padding: isMobile?0:16 }} onClick={() => setSchedModal(null)}>
          <div style={{ background:C.card, border:"1px solid #40d08044", borderRadius: isMobile?"16px 16px 0 0":16, width:"100%", maxWidth: isMobile?"100%":520, padding: isMobile?"20px 16px 32px":32 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: isMobile?18:20, fontWeight:"bold", marginBottom:3 }}>📅 Schedule a Viewing</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>{schedModal.title} · {schedModal.neighborhood}</div>

            {/* Type toggle */}
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {[["in-person","🏠 In-Person"],["virtual","💻 Virtual"],["self-tour","🔑 Self-Tour"]].map(([t,l]) => (
                <button key={t} onClick={() => setSchedForm(f => ({...f, type:t}))} style={{ flex:1, background:schedForm.type===t?"#0a1e0e":"#111", color:schedForm.type===t?"#40d080":"#555", border:`1px solid ${schedForm.type===t?"#40d08044":C.border}`, padding:"9px 4px", borderRadius:8, cursor:"pointer", fontSize: isMobile?11:12, fontFamily:"inherit", textAlign:"center" }}>
                  {l}
                </button>
              ))}
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div>
                <label style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Date</label>
                <input type="date" value={schedForm.date} onChange={e => setSchedForm(f => ({...f, date:e.target.value}))} style={{ width:"100%", background:"#111", border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box" }} />
              </div>
              <div>
                <label style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Time</label>
                <input type="time" value={schedForm.time} onChange={e => setSchedForm(f => ({...f, time:e.target.value}))} style={{ width:"100%", background:"#111", border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"10px 12px", fontSize:14, fontFamily:"inherit", boxSizing:"border-box" }} />
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em", display:"block", marginBottom:6 }}>Notes</label>
              <textarea value={schedForm.note} onChange={e => setSchedForm(f => ({...f, note:e.target.value}))} style={{ width:"100%", background:"#111", border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"10px 12px", fontSize:13, resize:"vertical", minHeight:70, fontFamily:"inherit", boxSizing:"border-box" }} placeholder="Questions to ask, parking, pet policy…" />
            </div>

            <div style={{ background:"#0a1208", border:"1px solid #40d08022", borderRadius:8, padding:"10px 12px", marginBottom:16, fontSize:12, color:"#666" }}>
              <strong style={{ color:"#40d080" }}>Next step:</strong> Call {schedModal.contact} to confirm. Mention your preferred viewing type and any questions.
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setSchedModal(null)} style={{ flex:1, background:"#111", color:C.muted, border:`1px solid ${C.border}`, padding:"13px", borderRadius:8, cursor:"pointer", fontSize:14, fontFamily:"inherit" }}>Cancel</button>
              <button onClick={scheduleViewing} style={{ flex:2, background:"linear-gradient(135deg,#40d080,#20a060)", color:"#000", border:"none", padding:"13px", borderRadius:8, cursor:"pointer", fontSize:14, fontWeight:"bold", fontFamily:"inherit" }}>
                ✓ Confirm Viewing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
