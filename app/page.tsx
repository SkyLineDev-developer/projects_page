"use client";

import { useState } from "react";
import Link from "next/link";
import { projects } from "@/lib/projects.data";

export default function Home() {
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@400;500;600;700;800&display=swap');

        .row-item {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .row-item:hover .row-name {
          color: var(--accent) !important;
        }
        .row-item:hover .row-arrow {
          transform: translateX(8px) !important;
          color: var(--accent) !important;
        }
        .row-item:hover .row-status-dot {
          box-shadow: 0 0 8px 2px #4ade8088 !important;
        }
        .row-item:hover .row-bg-num {
          opacity: 0.04 !important;
          transform: translateY(-50%) translateX(0px) scale(1) !important;
        }
        .row-item:hover {
          background: var(--accent-dim) !important;
        }

        .search-input:focus {
          border-color: var(--accent) !important;
          outline: none;
        }

        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-inner {
          display: inline-flex;
          animation: ticker 18s linear infinite;
          white-space: nowrap;
        }
        .ticker-inner:hover {
          animation-play-state: paused;
        }

        /* Desktop grid */
        .projects-grid {
          display: grid;
          grid-template-columns: 40px 2fr 3fr 1fr 48px;
          gap: 0;
        }
        .col-domain { display: flex; }
        .col-status { display: flex; }

        /* Mobile */
        @media (max-width: 640px) {
          .projects-grid {
            grid-template-columns: 32px 1fr 48px;
          }
          .col-domain { display: none; }
          .col-status { display: none; }
          .hero-pad { padding: 40px 20px 32px !important; }
          .table-pad { padding: 0 20px !important; }
          .row-pad {
            padding-left: 20px !important;
            padding-right: 20px !important;
            margin-left: -20px !important;
            margin-right: -20px !important;
          }
          .ticker-pad { padding: 8px 0 !important; }
          .bottom-pad { padding: 16px 20px !important; }
          .row-name-text { font-size: 20px !important; }
          .hero-title { font-size: 64px !important; }
        }

        /* Tablet */
        @media (min-width: 641px) and (max-width: 900px) {
          .projects-grid {
            grid-template-columns: 40px 2fr 2fr 48px;
          }
          .col-status { display: none; }
          .hero-pad { padding: 48px 32px 36px !important; }
          .table-pad { padding: 0 32px !important; }
          .row-pad {
            padding-left: 32px !important;
            padding-right: 32px !important;
            margin-left: -32px !important;
            margin-right: -32px !important;
          }
          .bottom-pad { padding: 18px 32px !important; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", display: "flex", flexDirection: "column" }}>

        {/* Ticker tape */}
        <div className="ticker-pad" style={{
          borderBottom: "1px solid var(--border)",
          overflow: "hidden",
          padding: "10px 0",
          background: "var(--surface)",
        }}>
          <div className="ticker-inner">
            {[...Array(2)].map((_, i) => (
              <span key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.2em" }}>
                {["RESTAURANT-TEMPLATE", "SKY-LINE-DEV", "AV-VITRALES", "READY", "DEPLOYED", "SKYLINEDEV"].map((t, j) => (
                  <span key={j}>
                    <span style={{ color: j % 3 === 0 ? "var(--accent)" : "var(--muted)" }}>{t}</span>
                    <span style={{ margin: "0 28px", color: "var(--dim)" }}>·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="hero-pad" style={{
          padding: "56px 48px 48px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.3em", marginBottom: "12px" }}>
              /{String(filtered.length).padStart(2, "0")} PROJECTS
            </p>
            <h1 className="hero-title" style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(64px, 9vw, 120px)",
              fontWeight: 800,
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              color: "var(--text)",
            }}>
              Portafolio
            </h1>
          </div>
          <input
            className="search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="BUSCAR..."
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontFamily: "'DM Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.1em",
              padding: "10px 18px",
              width: "200px",
              transition: "border-color 0.2s",
              alignSelf: "flex-end",
            }}
          />
        </div>

        {/* Column headers */}
        <div className="table-pad" style={{ padding: "0 48px", borderBottom: "1px solid var(--border)" }}>
          <div className="projects-grid" style={{ padding: "10px 0" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", color: "var(--dim)" }}>#</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", color: "var(--dim)" }}>PROYECTO</span>
            <span className="col-domain" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", color: "var(--dim)" }}>DOMINIO</span>
            <span className="col-status" style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.25em", color: "var(--dim)" }}>ESTADO</span>
            <span />
          </div>
        </div>

        {/* Project rows */}
        <div className="table-pad" style={{ flex: 1, padding: "0 48px" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "120px 0", textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "var(--muted)", letterSpacing: "0.2em" }}>
              SIN RESULTADOS
            </div>
          ) : (
            filtered.map((project, i) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div
                  className="row-item row-pad"
                  style={{
                    marginLeft: "-48px",
                    marginRight: "-48px",
                    paddingLeft: "48px",
                    paddingRight: "48px",
                    borderBottom: "1px solid var(--border)",
                    padding: "24px 0",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={() => setHovered(project.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Giant bg number */}
                  <span className="row-bg-num" style={{
                    position: "absolute",
                    right: "60px",
                    top: "50%",
                    transform: "translateY(-50%) translateX(20px) scale(1.1)",
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "96px",
                    fontWeight: 800,
                    color: "var(--text)",
                    opacity: 0,
                    transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                    pointerEvents: "none",
                    userSelect: "none",
                    lineHeight: 1,
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="projects-grid" style={{ paddingLeft: "48px", paddingRight: "48px", marginLeft: "-48px", marginRight: "-48px", paddingTop: "24px", paddingBottom: "24px", marginTop: "-24px", marginBottom: "-24px" }}>
                    {/* Number */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "11px",
                        color: "var(--accent)",
                        opacity: 0.5,
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Name */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span className="row-name row-name-text" style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: "22px",
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        color: "var(--text)",
                        transition: "color 0.3s ease",
                        lineHeight: 1.1,
                        wordBreak: "break-word",
                      }}>
                        {project.name}
                      </span>
                    </div>

                    {/* Domain */}
                    <div className="col-domain" style={{ alignItems: "center" }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "12px",
                        color: "var(--muted)",
                        transition: "color 0.3s ease",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {project.domain}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-status" style={{ alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="row-status-dot" style={{
                          width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                          background: project.status === "ready" ? "#4ade80" : project.status === "error" ? "#f87171" : "#fbbf24",
                          transition: "box-shadow 0.3s ease",
                        }} />
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.12em" }}>
                          {(project.status ?? "ready").toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <span className="row-arrow" style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "20px",
                        color: "var(--dim)",
                        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                        display: "inline-block",
                      }}>
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Bottom bar */}
        <div className="bottom-pad" style={{
          padding: "20px 48px",
          borderTop: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "var(--dim)", letterSpacing: "0.2em" }}>
            {filtered.length} / {projects.length} VISIBLE
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "var(--dim)", letterSpacing: "0.2em" }}>
            SKYLINEDEV — {new Date().getFullYear()}
          </span>
        </div>

      </main>
    </>
  );
}