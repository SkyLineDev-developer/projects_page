"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const ACCENT = "#F69B02";

const content = {
  es: {
    label: "Portafolio de Proyectos",
    heading1: "Mi trabajo,",
    heading2: "en un solo lugar.",
    sub: "Proyectos personales y empresariales de SkylineDev.",
    cta: "Ver Proyectos →",
    translateBtn: "EN",
  },
  en: {
    label: "Project Portfolio",
    heading1: "My work,",
    heading2: "in one place.",
    sub: "Personal and business projects by SkylineDev.",
    cta: "View Projects →",
    translateBtn: "ES",
  },
};

export default function Landing() {
  const [lang, setLang]       = useState<"es" | "en">("es");
  const [fading, setFading]   = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef             = useRef<HTMLCanvasElement>(null);
  const t = content[lang];

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  function toggleLang() {
    setFading(true);
    setTimeout(() => { setLang(l => l === "es" ? "en" : "es"); setFading(false); }, 250);
  }

  // Canvas dot grid con parallax al mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let mx = -9999, my = -9999;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onTouch = (e: TouchEvent) => { mx = e.touches[0].clientX; my = e.touches[0].clientY; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });

    const GAP = 70;

    const loop = (ts: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width  / GAP) + 1;
      const rows = Math.ceil(canvas.height / GAP) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const bx   = i * GAP;
          const by   = j * GAP;
          const dx   = bx - mx;
          const dy   = by - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = Math.max(0, 1 - dist / 200);
          const x    = bx + dx * pull * -0.15 + Math.sin(ts * 0.0004 + i * 0.8) * 1;
          const y    = by + dy * pull * -0.15 + Math.cos(ts * 0.0004 + j * 0.8) * 1;
          const a    = 0.035 + pull * 0.5;
          const r    = 0.6   + pull * 2.6;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = pull > 0.05
            ? `rgba(246,155,2,${a})`
            : `rgba(255,255,255,${a * 0.4})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const fade: React.CSSProperties = {
    opacity:    fading ? 0 : 1,
    transform:  fading ? "translateY(6px)" : "translateY(0)",
    transition: "opacity 0.25s ease, transform 0.25s ease",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@800;900&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #060606; height: 100%; }


        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { opacity: 0; animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.25s; }
        .d3 { animation-delay: 0.4s; }
        .d4 { animation-delay: 0.55s; }
        .d5 { animation-delay: 0.7s; }

        @keyframes glow {
          0%,100% { box-shadow: 0 0 0px rgba(246,155,2,0); }
          50%      { box-shadow: 0 0 60px rgba(246,155,2,0.2); }
        }

        @keyframes scan {
          from { top: 0; }
          to   { top: 100vh; }
        }
        .scan-line {
          position: fixed; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(246,155,2,0.08), transparent);
          animation: scan 14s linear infinite;
          pointer-events: none; z-index: 1;
        }

        @media (min-width: 641px) {
          .main-layout {
            height: 100vh;
            max-height: 100vh;
            overflow: hidden;
            padding: 0 clamp(24px,8vw,100px);
          }
        }
        @media (max-width: 640px) {
          .main-layout {
            min-height: 100vh;
            padding: 80px 24px 48px;
          }
        }
      `}</style>

      {/* Canvas de fondo */}
      <canvas
        ref={canvasRef}
        style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }}
      />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Corner brackets */}
      {[
        { top:16,    left:16,    borderTop:`1px solid ${ACCENT}`,    borderLeft:`1px solid ${ACCENT}` },
        { top:16,    right:16,   borderTop:`1px solid ${ACCENT}`,    borderRight:`1px solid ${ACCENT}` },
        { bottom:16, left:16,    borderBottom:`1px solid ${ACCENT}`, borderLeft:`1px solid ${ACCENT}` },
        { bottom:16, right:16,   borderBottom:`1px solid ${ACCENT}`, borderRight:`1px solid ${ACCENT}` },
      ].map((s, i) => (
        <div key={i} style={{ position:"fixed", width:28, height:28, opacity:0.2, pointerEvents:"none", zIndex:50, ...s }} />
      ))}

      {/* ── MAIN ── */}
      <main className="main-layout" style={{
        background:"#060606",
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        position:"relative",
        zIndex:10,
        opacity: mounted ? 1 : 0,
        transition:"opacity 0.6s ease",
      }}>

        {/* Centro: todo el contenido */}
        <div style={{
          display:"flex",
          flexDirection:"column",
          alignItems:"center",
          textAlign:"center",
          maxWidth:700,
          width:"100%",
          gap:0,
        }}>

          {/* Label + translate */}
          <div
            className="reveal d1"
            style={{
              display:"flex", alignItems:"center", gap:12,
              marginBottom:"clamp(16px,2.5vh,48px)",
              ...fade,
            }}
          >
            <span style={{
              width:5, height:5, borderRadius:"50%",
              background: ACCENT, display:"inline-block",
              boxShadow:`0 0 8px ${ACCENT}`,
              flexShrink:0,
            }} />
            <span style={{
              fontFamily:"'DM Mono',monospace",
              fontSize:10, letterSpacing:"0.28em", color:"#444",
            }}>
              {t.label}
            </span>
            <button
              onClick={toggleLang}
              style={{
                fontFamily:"'DM Mono',monospace",
                fontSize:9, letterSpacing:"0.18em",
                padding:"5px 12px",
                border:"1px solid #202020",
                background:"transparent",
                color:"#383838",
                cursor:"pointer",
              }}
              onMouseEnter={e => {
                const b = e.currentTarget;
                b.style.borderColor = ACCENT;
                b.style.color = ACCENT;
              }}
              onMouseLeave={e => {
                const b = e.currentTarget;
                b.style.borderColor = "#202020";
                b.style.color = "#383838";
              }}
            >
              {t.translateBtn}
            </button>
          </div>

          {/* Logo placeholder */}
          <div
            className="reveal d2"
            style={{
              marginBottom:"clamp(18px,3vh,56px)",
              ...fade,
            }}
          >
            {/*
              ── REEMPLAZA CON TU LOGO:
              <img src="/logo.png" alt="SkylineDev" style={{ height:72, width:"auto" }} />
            */}
            <div style={{
              width:"clamp(72px,10vw,96px)",
              height:"clamp(72px,10vw,96px)",
              borderRadius:"50%",
              border:"1px solid #1c1c1c",
              background:"#0d0d0d",
              display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center",
              margin:"0 auto",
              animation:"glow 5s ease-in-out infinite",
            }}>
              <span style={{
                fontFamily:"'Syne',sans-serif", fontWeight:900,
                fontSize:"clamp(24px,4vw,36px)", color:"#f0f0f0", lineHeight:1,
              }}>S</span>
            </div>
          </div>

          {/* Heading */}
          <h1
            className="reveal d3"
            style={{
              fontFamily:"'Syne',sans-serif",
              fontWeight:900,
              fontSize: lang === "es" ? "clamp(36px,5.5vw,72px)" : "clamp(42px,8vw,100px)",
              lineHeight:0.9,
              letterSpacing:"-0.03em",
              color:"#f0f0f0",
              marginBottom:"clamp(12px,2vh,32px)",
              ...fade,
            }}
          >
            {t.heading1}<br />
            <span style={{ color: ACCENT }}>{t.heading2}</span>
          </h1>

          {/* Sub */}
          <p
            className="reveal d4"
            style={{
              fontFamily:"'DM Mono',monospace",
              fontSize:"clamp(11px,1.2vw,13px)",
              letterSpacing:"0.06em",
              lineHeight:1.8,
              color:"#444",
              marginBottom:"clamp(20px,3vh,60px)",
              ...fade,
            }}
          >
            {t.sub}
          </p>

          {/* CTA */}
          <div className="reveal d5" style={{ ...fade }}>
            <Link
              href="/projects"
              style={{
                fontFamily:"'DM Mono',monospace",
                fontSize:11,
                letterSpacing:"0.2em",
                fontWeight:500,
                padding:"16px 44px",
                background: ACCENT,
                color:"#000",
                textDecoration:"none",
                display:"inline-block",
                transition:"transform 0.2s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={e => {
                const a = e.currentTarget;
                a.style.transform  = "translateY(-3px)";
                a.style.boxShadow  = `0 16px 48px rgba(246,155,2,0.3)`;
              }}
              onMouseLeave={e => {
                const a = e.currentTarget;
                a.style.transform = "translateY(0)";
                a.style.boxShadow = "none";
              }}
            >
              {t.cta}
            </Link>
          </div>

        </div>

        {/* Bottom: firma */}
        <div style={{
          position:"absolute",
          bottom:"clamp(16px,3vh,28px)",
          left:0, right:0,
          display:"flex",
          justifyContent:"center",
        }}>
          <span style={{
            fontFamily:"'DM Mono',monospace",
            fontSize:9,
            letterSpacing:"0.25em",
            color:"#F69B02",
          }}>
            SKYLINEDEV © {new Date().getFullYear()}
          </span>
        </div>
      </main>
    </>
  );
}