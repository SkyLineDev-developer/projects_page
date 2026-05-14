"use client";

import { useState, useEffect } from "react";

interface ApiProject {
  id: number;
  project_name: string;
  project_link: string;
  project_description: string | null;
  category: string;
  technologies: string[];
  sector?: string;
  resultado?: string;
}

interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  sector: string;
  resultado: string;
}

const categoryLabel: Record<string, string> = {
  Company_Project: "Proyecto para cliente",
  Personal: "Proyecto personal",
};

function mapProject(p: ApiProject): Project {
  return {
    id: String(p.id),
    name: p.project_name,
    url: p.project_link,
    description: p.project_description ?? "Sitio web desarrollado por SkylineDev.",
    category: categoryLabel[p.category] ?? p.category,
    tags: p.technologies,
    sector: p.sector ?? "",
    resultado: p.resultado ?? "",
  };
}

export default function Home() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [active, setActive]       = useState(0);
  const [animating, setAnimating] = useState(false);
  const [ready, setReady]         = useState(false);
  const [iframeOk, setIframeOk]   = useState(false);

  useEffect(() => {
    fetch(
      process.env.NODE_ENV === "production"
        ? "https://www.api-projects.skylinedev.com.co/api/users"
        : "http://localhost:3001/api/users"
    )
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: ApiProject[]) => {
        setProjects(data.map(mapProject));
        setLoading(false);
        setTimeout(() => setReady(true), 60);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const total = projects.length;
  const proj  = projects[active];

  function go(i: number) {
    if (animating || i === active) return;
    setAnimating(true);
    setIframeOk(false);
    setTimeout(() => { setActive(i); setAnimating(false); }, 380);
  }
  function prev() { go((active - 1 + total) % total); }
  function next() { go((active + 1) % total); }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [active, animating, total]);

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"16px" }}>
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:"36px", height:"36px", border:"2px solid #222", borderTopColor:"#F69B02", borderRadius:"50%", animation:"sp 0.8s linear infinite" }} />
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", letterSpacing:"0.3em", color:"#555" }}>CARGANDO</span>
    </div>
  );

  if (error) return (
    <div style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", color:"#C0392B", letterSpacing:"0.2em" }}>{error}</span>
    </div>
  );

  if (!projects.length) return (
    <div style={{ minHeight:"100vh", background:"#080808", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"10px", color:"#555", letterSpacing:"0.25em" }}>SIN PROYECTOS</span>
    </div>
  );

  const pct = total ? Math.round(((active + 1) / total) * 100) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        :root {
          --bg:        #080808;
          --surface:   #0f0f0f;
          --card:      #111111;
          --border:    #1e1e1e;
          --text:      #f0f0f0;
          --muted:     #555;
          --dim:       #222;
          --gold:      #F69B02;
          --gold-dim:  rgba(246,155,2,0.08);
          --gold-glow: rgba(246,155,2,0.18);
        }

        html, body { height: 100%; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes slideOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(-24px)} }
        @keyframes slideIn  { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes sp       { to{transform:rotate(360deg)} }
        @keyframes ticker   { to{transform:translateX(-50%)} }

        /* ── móvil: slide vertical ── */
        @keyframes slideUpIn  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUpOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-20px)} }

        .page-enter .e1 { animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .page-enter .e2 { animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .page-enter .e3 { animation:fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .page-enter .e4 { animation:fadeIn 0.5s ease 0.38s both; }

        .out { animation:slideOut 0.36s cubic-bezier(0.4,0,1,1) both; }
        .in  { animation:slideIn  0.4s  cubic-bezier(0.16,1,0.3,1) both; }

        /* ═══════════════════════════════════════
           DESKTOP LAYOUT
        ═══════════════════════════════════════ */
        .root {
          min-height: 100vh;
          background: var(--bg);
          display: grid;
          grid-template-rows: auto 2px 1fr auto;
          color: var(--text);
          position: relative;
          overflow: hidden;
        }

        .root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(246,155,2,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(246,155,2,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* Header */
        .hdr {
          position: relative; z-index: 10;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px;
          height: 56px;
          border-bottom: 1px solid var(--border);
          background: rgba(8,8,8,0.92);
          backdrop-filter: blur(8px);
        }
        .logo {
          font-family: 'Syne', sans-serif;
          font-size: 17px; font-weight: 800;
          letter-spacing: 0.04em; color: var(--text);
        }
        .logo span { color: var(--gold); }
        .hdr-center {
          position: absolute; left: 50%; transform: translateX(-50%);
          font-family: 'DM Mono', monospace;
          font-size: 10px; letter-spacing: 0.3em; color: var(--muted);
        }
        .hdr-right { display: flex; align-items: center; gap: 10px; }
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 8px #4ade8066;
          animation: pulse 2.2s ease-in-out infinite;
        }
        .live-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.22em; color: #4ade80;
        }

        /* Progress */
        .prog-bar { background: var(--dim); position: relative; overflow: hidden; }
        .prog-fill {
          position: absolute; left: 0; top: 0; bottom: 0;
          background: var(--gold);
          transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
        }

        /* Main grid */
        .main {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }

        /* Left col */
        .list-col {
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column; overflow: hidden;
        }
        .hero-block {
          flex: 1; padding: 40px 40px 28px;
          display: flex; flex-direction: column; justify-content: space-between;
          position: relative; overflow: hidden;
        }
        .watermark {
          position: absolute; right: -10px; bottom: -30px;
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(140px,20vw,200px); line-height: 1;
          letter-spacing: -0.06em; color: var(--gold);
          opacity: 0.04; pointer-events: none; user-select: none;
        }
        .top-info {
          display: flex; align-items: flex-start; justify-content: space-between;
          margin-bottom: 20px;
        }
        .counter-big {
          font-family: 'Syne', sans-serif; font-size: 11px;
          font-weight: 700; letter-spacing: 0.22em; color: var(--muted);
        }
        .sector-tag {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px; font-family: 'DM Mono', monospace;
          font-size: 9px; letter-spacing: 0.2em; color: var(--gold);
          border: 1px solid var(--gold-glow); padding: 4px 12px;
          background: var(--gold-dim);
        }
        .cat-label {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.2em; color: var(--muted);
          border: 1px solid var(--border); padding: 4px 12px;
        }
        .accent-rule { width: 48px; height: 3px; background: var(--gold); margin-bottom: 18px; }
        .hero-name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px,4.5vw,56px); font-weight: 800;
          line-height: 0.9; letter-spacing: -0.04em; color: var(--text);
          margin-bottom: 20px; word-break: break-word;
        }
        .hero-desc {
          font-family: 'DM Mono', monospace; font-size: 12px;
          line-height: 1.9; color: #666; margin-bottom: 20px; max-width: 440px;
        }
        .result-band {
          display: flex; align-items: stretch;
          margin-bottom: 24px; border: 1px solid var(--border); overflow: hidden;
        }
        .result-accent { width: 4px; background: var(--gold); flex-shrink: 0; }
        .result-body { padding: 14px 18px; background: var(--card); flex: 1; }
        .result-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 8px;
          letter-spacing: 0.28em; color: var(--gold); margin-bottom: 6px;
        }
        .result-text {
          font-family: 'Syne', sans-serif; font-size: 14px;
          font-weight: 600; color: var(--text); line-height: 1.5;
        }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 28px; }
        .tag {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.16em; color: var(--muted);
          background: var(--dim); padding: 4px 10px;
        }
        .cta-row { display: flex; align-items: center; gap: 14px; }
        .cta-primary {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.18em; color: #080808; background: var(--gold);
          text-decoration: none; padding: 12px 24px;
          transition: opacity 0.18s; flex-shrink: 0;
        }
        .cta-primary:hover { opacity: 0.88; }
        .cta-ghost {
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: 0.18em; color: var(--muted);
          border: 1px solid var(--border); background: transparent;
          text-decoration: none; padding: 11px 20px;
          transition: border-color 0.18s, color 0.18s;
        }
        .cta-ghost:hover { border-color: var(--gold); color: var(--gold); }

        /* Project strip */
        .proj-list { border-top: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; }
        .proj-list-inner { display: flex; align-items: stretch; overflow-x: auto; }
        .proj-item {
          flex: 1; min-width: 120px; padding: 14px 18px;
          border-right: 1px solid var(--border);
          cursor: pointer; background: transparent; text-align: left;
          border-top: none; border-bottom: none; border-left: none;
          transition: background 0.16s; position: relative;
        }
        .proj-item:last-child { border-right: none; }
        .proj-item.active { background: var(--card); }
        .proj-item::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: var(--gold);
          transform: scaleX(0); transition: transform 0.24s cubic-bezier(0.16,1,0.3,1);
          transform-origin: left;
        }
        .proj-item.active::after, .proj-item:hover::after { transform: scaleX(1); }
        .proj-item-num {
          font-family: 'DM Mono', monospace; font-size: 8px;
          letter-spacing: 0.22em; color: var(--muted); margin-bottom: 5px;
        }
        .proj-item-name {
          font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700;
          color: var(--text); line-height: 1.2;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;
        }
        .proj-item.active .proj-item-name { color: var(--gold); }
        .proj-item-sector {
          font-family: 'DM Mono', monospace; font-size: 8px;
          letter-spacing: 0.16em; color: var(--muted); margin-top: 3px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* Right col */
        .preview-col { display: flex; flex-direction: column; background: #0a0a0a; }
        .preview-header {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 16px; border-bottom: 1px solid var(--border);
          background: var(--surface); flex-shrink: 0;
        }
        .traffic { display: flex; gap: 5px; }
        .tl { width: 10px; height: 10px; border-radius: 50%; }
        .url-pill {
          flex: 1; font-family: 'DM Mono', monospace; font-size: 10px;
          color: var(--muted); background: var(--dim); padding: 5px 12px;
          border-radius: 3px; overflow: hidden; text-overflow: ellipsis;
          white-space: nowrap; letter-spacing: 0.04em; border: 1px solid var(--border);
        }
        .open-btn {
          font-family: 'DM Mono', monospace; font-size: 9px;
          letter-spacing: 0.16em; color: #080808; background: var(--gold);
          text-decoration: none; padding: 6px 14px;
          white-space: nowrap; flex-shrink: 0; transition: opacity 0.18s;
        }
        .open-btn:hover { opacity: 0.85; }
        .iframe-zone { flex: 1; position: relative; overflow: hidden; min-height: 300px; }
        .iframe-loader {
          position: absolute; inset: 0; z-index: 5;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 12px; background: var(--bg); transition: opacity 0.3s;
        }
        .iframe-loader.gone { opacity: 0; pointer-events: none; }
        .spin { animation: sp 1s linear infinite; }

        /* Nav arrows */
        .nav-overlay {
          position: fixed; bottom: 72px; right: 36px; z-index: 20;
          display: flex; flex-direction: column; gap: 6px;
        }
        .nav-btn {
          width: 48px; height: 48px; border: 1.5px solid var(--border);
          background: rgba(8,8,8,0.9); backdrop-filter: blur(8px);
          color: var(--text); font-size: 18px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.18s, color 0.18s, transform 0.12s;
          font-family: 'DM Mono', monospace;
        }
        .nav-btn:hover  { border-color: var(--gold); color: var(--gold); }
        .nav-btn:active { transform: scale(0.9); }

        /* Footer */
        .footer {
          position: relative; z-index: 10;
          border-top: 1px solid var(--border);
          background: var(--surface); overflow: hidden;
        }
        .ticker-track {
          display: inline-flex; white-space: nowrap;
          animation: ticker 26s linear infinite; padding: 11px 0;
        }
        .ticker-track:hover { animation-play-state: paused; }
        .t-item { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.28em; color: var(--muted); }
        .t-item.hi { color: var(--gold); }
        .t-sep { margin: 0 22px; color: var(--dim); }

        /* ═══════════════════════════════════════
           MÓVIL — layout completamente diferente
        ═══════════════════════════════════════ */
        @media (max-width: 900px) {

          /* Ocultar todo lo de desktop que no aplica */
          .preview-col   { display: none; }
          .nav-overlay   { display: none; }
          .hdr-center    { display: none; }
          .cta-ghost     { display: none; }
          .hero-block    { display: none; }
          .proj-list     { display: none; }

          /* El root pasa a ser flex columna a pantalla completa */
          .root {
            grid-template-rows: auto 2px 1fr auto;
          }

          /* El main ocupa todo el ancho */
          .main {
            grid-template-columns: 1fr;
            overflow: visible;
          }

          /* La list-col en móvil es la pantalla completa */
          .list-col {
            border-right: none;
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
          }

          /* ── Tarjeta móvil ── */
          .mobile-card {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 28px 24px 24px;
            position: relative;
            overflow-y: auto;
          }

          .mobile-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
          }

          .mobile-counter {
            font-family: 'DM Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.24em;
            color: var(--muted);
          }

          .mobile-sector {
            font-family: 'DM Mono', monospace;
            font-size: 9px;
            letter-spacing: 0.2em;
            color: var(--gold);
            border: 1px solid var(--gold-glow);
            padding: 4px 12px;
            background: var(--gold-dim);
          }

          .mobile-cat {
            font-family: 'DM Mono', monospace;
            font-size: 9px;
            letter-spacing: 0.2em;
            color: var(--muted);
            border: 1px solid var(--border);
            padding: 4px 12px;
          }

          .mobile-accent { width: 40px; height: 3px; background: var(--gold); margin-bottom: 16px; }

          .mobile-name {
            font-family: 'Syne', sans-serif;
            font-size: clamp(38px, 11vw, 52px);
            font-weight: 800;
            line-height: 0.9;
            letter-spacing: -0.04em;
            color: var(--text);
            margin-bottom: 24px;
            word-break: break-word;
          }

          .mobile-desc {
            font-family: 'DM Mono', monospace;
            font-size: 12px;
            line-height: 1.85;
            color: #666;
            margin-bottom: 22px;
          }

          .mobile-result {
            display: flex;
            align-items: stretch;
            margin-bottom: 24px;
            border: 1px solid var(--border);
            overflow: hidden;
          }
          .mobile-result-bar { width: 4px; background: var(--gold); flex-shrink: 0; }
          .mobile-result-body { padding: 14px 16px; background: var(--card); flex: 1; }
          .mobile-result-label {
            font-family: 'DM Mono', monospace;
            font-size: 8px; letter-spacing: 0.28em;
            color: var(--gold); margin-bottom: 6px;
          }
          .mobile-result-text {
            font-family: 'Syne', sans-serif;
            font-size: 14px; font-weight: 600;
            color: var(--text); line-height: 1.5;
          }

          .mobile-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 32px; }
          .mobile-tag {
            font-family: 'DM Mono', monospace; font-size: 9px;
            letter-spacing: 0.16em; color: var(--muted);
            background: var(--dim); padding: 4px 10px;
          }

          .mobile-cta {
            font-family: 'DM Mono', monospace;
            font-size: 11px; letter-spacing: 0.2em;
            color: #080808; background: var(--gold);
            text-decoration: none;
            padding: 16px 28px;
            display: inline-block;
            align-self: flex-start;
            transition: opacity 0.18s;
          }
          .mobile-cta:hover { opacity: 0.88; }

          /* ── Nav inferior ── */
          .mobile-nav {
            display: flex;
            align-items: center;
            border-top: 1px solid var(--border);
            flex-shrink: 0;
          }

          .mobile-nav-btn {
            flex: 1;
            height: 56px;
            background: transparent;
            border: none;
            border-right: 1px solid var(--border);
            color: var(--muted);
            font-family: 'DM Mono', monospace;
            font-size: 18px;
            cursor: pointer;
            transition: background 0.16s, color 0.16s;
            display: flex; align-items: center; justify-content: center;
          }
          .mobile-nav-btn:last-child { border-right: none; }
          .mobile-nav-btn:active { background: var(--dim); color: var(--gold); }

          .mobile-nav-dots {
            flex: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            height: 56px;
            border-right: 1px solid var(--border);
          }

          .mobile-dot {
            height: 2px; border-radius: 1px;
            border: none; cursor: pointer; padding: 0;
            background: var(--dim);
            transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
          }
          .mobile-dot.on { background: var(--gold); }

          /* Watermark móvil */
          .mobile-watermark {
            position: fixed;
            right: -16px; bottom: 70px;
            font-family: 'Syne', sans-serif; font-weight: 800;
            font-size: 38vw; line-height: 1;
            letter-spacing: -0.06em; color: var(--gold);
            opacity: 0.03; pointer-events: none; user-select: none;
            z-index: 0;
          }

          /* Animaciones móvil */
          .mobile-anim-in  { animation: slideUpIn  0.4s cubic-bezier(0.16,1,0.3,1) both; }
          .mobile-anim-out { animation: slideUpOut 0.34s cubic-bezier(0.4,0,1,1) both; }
        }

        /* Ocultar elementos solo-móvil en desktop */
        @media (min-width: 901px) {
          .mobile-card     { display: none; }
          .mobile-nav      { display: none; }
          .mobile-watermark{ display: none; }
        }
      `}</style>

      <div className={`root ${ready ? "page-enter" : ""}`}>

        {/* HEADER */}
        <header className="hdr e1">
          <div className="logo">Skyline<span>Dev</span></div>
          <div className="hdr-center">PORTAFOLIO DE PROYECTOS</div>
          <div className="hdr-right">
            <span className="live-dot" />
            <span className="live-label">EN LÍNEA</span>
          </div>
        </header>

        {/* PROGRESS */}
        <div className="prog-bar" style={{ height:"2px" }}>
          <div className="prog-fill" style={{ width:`${pct}%` }} />
        </div>

        {/* MAIN */}
        <main className="main">
          <div className="list-col">

            {/* ══════════ DESKTOP hero ══════════ */}
            <div className="hero-block">
              <div className="watermark">{String(active+1).padStart(2,"00")}</div>
              <div>
                <div className="top-info e2">
                  <div>
                    <div className="counter-big">{String(active+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</div>
                    {proj.sector && <div className="sector-tag">● {proj.sector.toUpperCase()}</div>}
                  </div>
                  <div className="cat-label">{proj.category.toUpperCase()}</div>
                </div>
                <div className={animating ? "out" : "in"} key={proj.id}>
                  <div className="accent-rule" />
                  <h1 className="hero-name">{proj.name}</h1>
                  <p className="hero-desc">{proj.description}</p>
                  {proj.resultado && (
                    <div className="result-band">
                      <div className="result-accent" />
                      <div className="result-body">
                        <div className="result-eyebrow">✦ RESULTADO</div>
                        <div className="result-text">{proj.resultado}</div>
                      </div>
                    </div>
                  )}
                  {proj.tags.length > 0 && (
                    <div className="tags">{proj.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                  )}
                  <div className="cta-row">
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="cta-primary">VER SITIO ↗</a>
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" className="cta-ghost">ABRIR EN NUEVA PESTAÑA ↗</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop strip */}
            <div className="proj-list e3">
              <div className="proj-list-inner">
                {projects.map((p, i) => (
                  <button key={p.id} className={`proj-item ${i === active ? "active" : ""}`} onClick={() => go(i)}>
                    <div className="proj-item-num">{String(i+1).padStart(2,"0")}</div>
                    <div className="proj-item-name">{p.name}</div>
                    {p.sector && <div className="proj-item-sector">{p.sector}</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* ══════════ MÓVIL card ══════════ */}
            <div className="mobile-watermark">{String(active+1).padStart(2,"0")}</div>

            <div className="mobile-card">
              <div className="mobile-top">
                <span className="mobile-counter">{String(active+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</span>
                {proj.sector
                  ? <span className="mobile-sector">● {proj.sector.toUpperCase()}</span>
                  : <span className="mobile-cat">{proj.category.toUpperCase()}</span>
                }
              </div>

              <div className={animating ? "mobile-anim-out" : "mobile-anim-in"} key={"m-" + proj.id} style={{ display:"flex", flexDirection:"column", flex:1 }}>
                <div className="mobile-accent" />
                <h1 className="mobile-name">{proj.name}</h1>
                <p className="mobile-desc">{proj.description}</p>

                {proj.resultado && (
                  <div className="mobile-result">
                    <div className="mobile-result-bar" />
                    <div className="mobile-result-body">
                      <div className="mobile-result-label">✦ RESULTADO</div>
                      <div className="mobile-result-text">{proj.resultado}</div>
                    </div>
                  </div>
                )}

                {proj.tags.length > 0 && (
                  <div className="mobile-tags">{proj.tags.map(t => <span key={t} className="mobile-tag">{t}</span>)}</div>
                )}

                <a href={proj.url} target="_blank" rel="noopener noreferrer" className="mobile-cta">
                  VER SITIO ↗
                </a>
              </div>
            </div>

            {/* Nav inferior móvil */}
            <div className="mobile-nav">
              <button className="mobile-nav-btn" onClick={prev}>←</button>
              <div className="mobile-nav-dots">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    className={`mobile-dot ${i === active ? "on" : ""}`}
                    style={{ width: i === active ? "26px" : "8px" }}
                    onClick={() => go(i)}
                  />
                ))}
              </div>
              <button className="mobile-nav-btn" onClick={next}>→</button>
            </div>

          </div>

          {/* RIGHT COL desktop */}
          <div className="preview-col e4">
            <div className="preview-header">
              <div className="traffic">
                <span className="tl" style={{ background:"#ff5f57" }} />
                <span className="tl" style={{ background:"#febc2e" }} />
                <span className="tl" style={{ background:"#28c840" }} />
              </div>
              <span className="url-pill">{proj.url}</span>
              <a href={proj.url} target="_blank" rel="noopener noreferrer" className="open-btn">ABRIR ↗</a>
            </div>
            <div className="iframe-zone">
              <div className={`iframe-loader ${iframeOk ? "gone" : ""}`}>
                <svg className="spin" width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="10" stroke="#222" strokeWidth="2" />
                  <path d="M13 3 A10 10 0 0 1 23 13" stroke="#F69B02" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"9px", letterSpacing:"0.28em", color:"#555" }}>CARGANDO</span>
              </div>
              <iframe
                key={proj.id}
                src={proj.url}
                title={proj.name}
                onLoad={() => setIframeOk(true)}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                style={{ width:"100%", height:"100%", border:"none", display:"block" }}
              />
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="footer">
          <div style={{ overflow:"hidden" }}>
            <div className="ticker-track">
              {[...Array(2)].map((_,i) => (
                <span key={i}>
                  {[
                    {t:"Tu negocio en internet", hi:true},
                    {t:"Más clientes",           hi:false},
                    {t:"Más ventas",             hi:true},
                    {t:"SkylineDev",             hi:false},
                    {t:"Sitios que funcionan",   hi:true},
                    {t:"Resultados reales",      hi:false},
                    {t:"Diseño con propósito",   hi:true},
                    {t:"Colombia",               hi:false},
                  ].map((item,j) => (
                    <span key={j}>
                      <span className={`t-item${item.hi?" hi":""}`}>{item.t}</span>
                      <span className="t-sep">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </footer>

        {/* NAV ARROWS desktop */}
        <div className="nav-overlay">
          <button className="nav-btn" onClick={prev} aria-label="Anterior">↑</button>
          <button className="nav-btn" onClick={next} aria-label="Siguiente">↓</button>
        </div>

      </div>
    </>
  );
}