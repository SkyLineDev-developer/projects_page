"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/lib/projects.data";

export default function ProjectPageClient({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState("Deployments");

  const tabs = ["Deployments", "Analytics", "Logs", "Settings"];

  const statusColor = project.status === "ready" ? "#4ade80" : project.status === "error" ? "#f87171" : "#fbbf24";
  const statusLabel = (project.status ?? "ready").toUpperCase();

  return (
    <main className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* Top bar */}
      <header style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3" style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", letterSpacing: "0.12em" }}>
            <Link href="/" style={{ color: "var(--muted)", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              SKYLINEDEV
            </Link>
            <span style={{ color: "var(--dim)" }}>/</span>
            <span style={{ color: "var(--muted)" }}>PROJECTS</span>
            <span style={{ color: "var(--dim)" }}>/</span>
            <span style={{ color: "var(--accent)" }}>{project.name.toUpperCase()}</span>
          </div>
          <div style={{
            width: "28px", height: "28px",
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Mono', monospace", fontSize: "11px", fontWeight: 600, color: "#000",
          }}>
            S
          </div>
        </div>
      </header>

      {/* Project title bar */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto px-8 py-8 flex items-end justify-between">
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "var(--muted)", letterSpacing: "0.2em", marginBottom: "8px" }}>
              PROJECT DETAIL
            </p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {project.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: statusColor,
                animation: project.status === "building" ? "pulse-dot 1.8s ease infinite" : "none",
              }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: statusColor, letterSpacing: "0.15em" }}>
                {statusLabel}
              </span>
            </div>
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.12em",
                border: "1px solid var(--border-bright)",
                padding: "8px 16px",
                color: "var(--text)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#000";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-bright)";
              }}
            >
              VISIT SITE ↗
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-8 flex items-center gap-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.15em",
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid var(--accent)" : "2px solid transparent",
                color: activeTab === tab ? "var(--text)" : "var(--muted)",
                cursor: "pointer",
                transition: "color 0.15s",
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-8 py-8">

        {/* Back link */}
        <Link
          href="/"
          className="animate-slideIn"
          style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.12em", marginBottom: "32px", display: "inline-flex", transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
        >
          ← ALL PROJECTS
        </Link>

        <div className="grid gap-6 mt-8" style={{ gridTemplateColumns: "1fr 320px" }}>

          {/* Left: image preview */}
          <div className="animate-fadeUp stagger-1" style={{ border: "1px solid var(--border)" }}>
            {/* Browser chrome */}
            <div style={{
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <div className="flex gap-1.5">
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f57", display: "block" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#febc2e", display: "block" }} />
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840", display: "block" }} />
              </div>
              <div style={{
                flex: 1,
                background: "var(--bg)",
                border: "1px solid var(--border)",
                padding: "4px 12px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                color: "var(--muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                https://{project.domain}
              </div>
              <a
                href={`https://${project.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--muted)", transition: "color 0.15s", lineHeight: 1 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* Image */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "var(--bg)", overflow: "hidden" }}>
              {project.image ? (
                <Image
                  src={project.image}
                  alt={`Preview of ${project.name}`}
                  fill
                  style={{ objectFit: "cover", objectPosition: "top" }}
                  sizes="(max-width: 1280px) 70vw, 800px"
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  gap: "12px", color: "var(--dim)",
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", letterSpacing: "0.15em" }}>NO PREVIEW</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: info panel */}
          <div className="flex flex-col gap-4">

            {/* Domain */}
            <div className="animate-fadeUp stagger-2" style={{ border: "1px solid var(--border)", padding: "20px" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", color: "var(--muted)", marginBottom: "10px" }}>
                DOMAIN
              </p>
              <a
                href={`https://${project.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "var(--text)", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}
              >
                {project.domain} ↗
              </a>
            </div>

            {/* Status */}
            <div className="animate-fadeUp stagger-3" style={{ border: "1px solid var(--border)", padding: "20px" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", letterSpacing: "0.2em", color: "var(--muted)", marginBottom: "10px" }}>
                STATUS
              </p>
              <div className="flex items-center gap-2">
                <span style={{
                  width: "6px", height: "6px", borderRadius: "50%", background: statusColor, flexShrink: 0,
                  animation: project.status === "building" ? "pulse-dot 1.8s ease infinite" : "none",
                }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: statusColor, letterSpacing: "0.1em" }}>
                  {statusLabel}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="animate-fadeUp stagger-4" style={{
              border: "1px solid var(--border)",
              padding: "16px 20px",
              background: "var(--accent-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "auto",
            }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "var(--muted)", letterSpacing: "0.15em" }}>
                SKYLINEDEV PLATFORM
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "var(--accent)", letterSpacing: "0.15em" }}>
                v2.0
              </span>
            </div>

          </div>
        </div>
      </div>

    </main>
  );
}