"use client";

import { useState, useEffect } from "react";

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface ApiProject {
  id: number;
  project_name: string;
  project_link: string;
  project_description: string | null;
  category: string;
  technologies: string[];
}

interface Project {
  id: string;
  name: string;
  domain: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
}

const categoryLabel: Record<string, string> = {
  Company_Project: "Proyecto Empresarial",
  Personal:        "Proyecto Personal",
};

function mapProject(p: ApiProject): Project {
  let domain = p.project_link;
  try { domain = new URL(p.project_link).hostname.replace(/^www\./, ""); } catch {}
  return {
    id: String(p.id),
    name: p.project_name,
    domain,
    url: p.project_link,
    description: p.project_description ?? "Proyecto desarrollado por SkylineDev.",
    category: categoryLabel[p.category] ?? p.category,
    tags: p.technologies,
  };
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [current, setCurrent]   = useState(0);
  const [dir, setDir]           = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Fetch desde la API
  useEffect(() => {
    fetch(process.env.NODE_ENV === "production"
        ? "https://api-projects.skylinedev.com.co/api/users"
        : "http://localhost:3001/api/users")
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: ApiProject[]) => { setProjects(data.map(mapProject)); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const total   = projects.length;
  const project = projects[current];

  function goTo(index: number, direction?: "left" | "right") {
    if (animating || index === current) return;
    const d = direction ?? (index > current ? "right" : "left");
    setDir(d);
    setAnimating(true);
    setIframeLoading(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 380);
  }

  function prev() { goTo((current - 1 + total) % total, "left"); }
  function next() { goTo((current + 1) % total, "right"); }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, animating]);

  const dot = "#4ade80";

  // ── Estados de carga / error / vacío ──────────────────────────────────────
  if (loading) return (
    <main style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"16px" }}>
      <svg style={{ animation:"spin 1.2s linear infinite" }} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style>
        <circle cx="16" cy="16" r="12" stroke="#1c1c1c" strokeWidth="2"/>
        <path d="M16 4 A12 12 0 0 1 28 16" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px", letterSpacing:"0.25em", color:"#666" }}>CARGANDO PROYECTOS...</span>
    </main>
  );

  if (error) return (
    <main style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"12px" }}>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px", letterSpacing:"0.2em", color:"#f87171" }}>ERROR AL CARGAR</span>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", color:"#666" }}>{error}</span>
    </main>
  );

  if (projects.length === 0) return (
    <main style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px", letterSpacing:"0.25em", color:"#666" }}>SIN PROYECTOS</span>
    </main>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #080808; --surface: #0f0f0f; --border: #1c1c1c;
          --text: #efefef; --muted: #666; --dim: #2a2a2a;
          --accent: #4ade80; --accent-dim: rgba(74,222,128,0.06);
        }
        .syne { font-family: 'Syne', sans-serif; }
        .mono { font-family: 'DM Mono', monospace; }

        @keyframes slideInR  { from { opacity:0; transform:translateX(36px);  } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInL  { from { opacity:0; transform:translateX(-36px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideOutR { from { opacity:1; transform:translateX(0);     } to { opacity:0; transform:translateX(-36px); } }
        @keyframes slideOutL { from { opacity:1; transform:translateX(0);     } to { opacity:0; transform:translateX(36px); } }
        .anim-in-r  { animation: slideInR  0.38s cubic-bezier(0.16,1,0.3,1) forwards; }
        .anim-in-l  { animation: slideInL  0.38s cubic-bezier(0.16,1,0.3,1) forwards; }
        .anim-out-r { animation: slideOutR 0.38s cubic-bezier(0.16,1,0.3,1) forwards; }
        .anim-out-l { animation: slideOutL 0.38s cubic-bezier(0.16,1,0.3,1) forwards; }

        .nav-btn {
          font-family:'DM Mono',monospace; font-size:11px; letter-spacing:0.18em;
          padding:11px 20px; border:1px solid var(--border);
          background:transparent; color:var(--muted); cursor:pointer;
          transition:all 0.2s ease;
        }
        .nav-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-dim); }
        .nav-btn:active { transform:scale(0.97); }

        .dot-btn {
          height:3px; border-radius:2px; border:none; cursor:pointer; padding:0;
          background:var(--dim); transition:all 0.3s cubic-bezier(0.16,1,0.3,1);
        }
        .dot-btn.active { background:var(--accent); }
        .dot-btn:hover:not(.active) { background:var(--muted); }

        .tag {
          font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.2em;
          padding:3px 9px; border:1px solid var(--border); color:var(--muted);
        }

        .open-link {
          font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.15em;
          color:var(--muted); text-decoration:none; padding:5px 12px;
          border:1px solid var(--border); transition:all 0.2s ease; white-space:nowrap;
        }
        .open-link:hover { color:var(--accent); border-color:var(--accent); background:var(--accent-dim); }

        @keyframes ticker { to { transform:translateX(-50%); } }
        .ticker { display:inline-flex; animation:ticker 22s linear infinite; white-space:nowrap; }
        .ticker:hover { animation-play-state:paused; }

        @keyframes spin { to { transform:rotate(360deg); } }
        .spinner { animation:spin 1.2s linear infinite; }

        .progress-fill { height:100%; background:var(--accent); transition:width 0.4s cubic-bezier(0.16,1,0.3,1); }

        .layout { display:flex; flex:1; overflow:hidden; }
        .left { width:380px; min-width:380px; display:flex; flex-direction:column; border-right:1px solid var(--border); background:var(--surface); }
        .right { flex:1; display:flex; flex-direction:column; position:relative; min-height:0; }

        @media (max-width:860px) {
          .layout { flex-direction:column; }
          .left { width:100%; min-width:0; border-right:none; border-bottom:1px solid var(--border); }
          .right { min-height:300px; }
        }

        .big-num {
          position:absolute; right:28px; bottom:16px;
          font-family:'Syne',sans-serif; font-weight:800; font-size:130px;
          line-height:1; color:var(--text); opacity:0.025;
          pointer-events:none; user-select:none; letter-spacing:-0.06em;
        }
      `}</style>

      <main style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"var(--bg)", color:"var(--text)" }}>

        {/* Ticker */}
        <div style={{ overflow:"hidden", borderBottom:"1px solid var(--border)", padding:"8px 0", background:"var(--surface)", flexShrink:0 }}>
          <div className="ticker">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="mono" style={{ fontSize:"9px", letterSpacing:"0.3em" }}>
                {["PORTFOLIO","SKYLINEDEV","PROYECTOS","DEPLOYED","LIVE","READY"].map((t,j) => (
                  <span key={j}>
                    <span style={{ color: j%2===0 ? "var(--accent)" : "var(--muted)" }}>{t}</span>
                    <span style={{ margin:"0 22px", color:"var(--dim)" }}>·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <div className="layout">

          {/* ── LEFT PANEL ── */}
          <div className="left">
            <div style={{ flex:1, padding:"36px 32px", position:"relative", overflow:"hidden" }}>
              <div className="big-num">{String(current+1).padStart(2,"0")}</div>

              {/* Counter + status */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"32px" }}>
                <span className="mono" style={{ fontSize:"10px", letterSpacing:"0.25em", color:"var(--muted)" }}>
                  {String(current+1).padStart(2,"0")} / {String(total).padStart(2,"0")}
                </span>
                <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                  <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:dot, display:"inline-block", boxShadow:`0 0 6px 1px ${dot}55` }} />
                  <span className="mono" style={{ fontSize:"9px", letterSpacing:"0.2em", color:"var(--muted)" }}>
                    READY
                  </span>
                </div>
              </div>

              {/* Animated content */}
              <div
                key={project.id}
                className={animating
                  ? (dir==="right" ? "anim-out-l" : "anim-out-r")
                  : (dir==="right" ? "anim-in-r"  : "anim-in-l")}
              >
                <h1 className="syne" style={{ fontSize:"clamp(30px,3.5vw,50px)", fontWeight:800, lineHeight:0.92, letterSpacing:"-0.03em", color:"var(--text)", marginBottom:"16px", wordBreak:"break-word" }}>
                  {project.name}
                </h1>
                <p className="mono" style={{ fontSize:"12px", color:"var(--accent)", marginBottom:"18px", letterSpacing:"0.04em" }}>
                  {project.category}
                </p>
                <p className="mono" style={{ fontSize:"12px", lineHeight:1.85, color:"var(--muted)", marginBottom:"22px" }}>
                  {project.description}
                </p>
                {project.tags.length > 0 && (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"7px" }}>
                    {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div style={{ height:"2px", background:"var(--dim)", margin:"0 32px", flexShrink:0 }}>
              <div className="progress-fill" style={{ width:`${((current+1)/total)*100}%` }} />
            </div>

            {/* Nav */}
            <div style={{ padding:"18px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
              <button className="nav-btn" onClick={prev}>← PREV</button>
              <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                {projects.map((_,i) => (
                  <button key={i} className={`dot-btn ${i===current?"active":""}`} style={{ width: i===current ? "26px" : "8px" }} onClick={() => goTo(i)} />
                ))}
              </div>
              <button className="nav-btn" onClick={next}>NEXT →</button>
            </div>

            <div style={{ paddingBottom:"14px", textAlign:"center" }}>
              <span className="mono" style={{ fontSize:"9px", letterSpacing:"0.2em", color:"var(--dim)" }}>← → TECLADO</span>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right">
            {/* Browser bar */}
            <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 14px", borderBottom:"1px solid var(--border)", background:"var(--surface)", flexShrink:0 }}>
              <div style={{ display:"flex", gap:"5px" }}>
                <span style={{ width:"10px",height:"10px",borderRadius:"50%",background:"#ff5f57",display:"inline-block" }} />
                <span style={{ width:"10px",height:"10px",borderRadius:"50%",background:"#febc2e",display:"inline-block" }} />
                <span style={{ width:"10px",height:"10px",borderRadius:"50%",background:"#28c840",display:"inline-block" }} />
              </div>
              <span className="mono" style={{ flex:1, fontSize:"11px", color:"var(--muted)", background:"var(--dim)", padding:"4px 12px", borderRadius:"4px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", letterSpacing:"0.04em" }}>
                {project.url}
              </span>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="open-link">ABRIR ↗</a>
            </div>

            {/* iframe */}
            <div style={{ flex:1, position:"relative" }}>
              {iframeLoading && (
                <div style={{ position:"absolute",inset:0,zIndex:10,background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"12px" }}>
                  <svg className="spinner" width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <circle cx="13" cy="13" r="10" stroke="var(--dim)" strokeWidth="2"/>
                    <path d="M13 3 A10 10 0 0 1 23 13" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="mono" style={{ fontSize:"10px",letterSpacing:"0.25em",color:"var(--muted)" }}>CARGANDO</span>
                </div>
              )}
              <iframe
                key={project.id}
                src={project.url}
                title={project.name}
                style={{ width:"100%",height:"100%",border:"none",opacity:iframeLoading?0:1,transition:"opacity 0.3s ease",display:"block" }}
                onLoad={() => setIframeLoading(false)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ padding:"9px 32px",borderTop:"1px solid var(--border)",background:"var(--surface)",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
          <span className="mono" style={{ fontSize:"9px",letterSpacing:"0.2em",color:"var(--dim)" }}>{current+1} / {total} VISIBLE</span>
          <span className="mono" style={{ fontSize:"9px",letterSpacing:"0.2em",color:"var(--dim)" }}>SKYLINEDEV — {new Date().getFullYear()}</span>
        </div>

      </main>
    </>
  );
}