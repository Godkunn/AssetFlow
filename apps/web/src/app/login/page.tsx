"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleDiscordSignIn = async () => {
    setLoading(true);
    await signIn("discord", { callbackUrl: "/" });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "var(--af-bg)",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT BRAND PANEL ── */}
      <div
        style={{
          flex: "0 0 50%",
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(56,189,248,0.08) 100%)",
          borderRight: "1px solid var(--af-border)",
          display: "flex",
          flexDirection: "column",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "auto" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #8B5CF6, #38BDF8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "16px",
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            AF
          </div>
          <span style={{ fontWeight: 700, fontSize: "20px", color: "var(--af-text)" }}>
            AssetFlow
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              background: "var(--af-primary)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            ERP
          </span>
        </div>

        {/* Hero Content */}
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <h1
            style={{
              fontSize: "38px",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: "20px",
              background: "linear-gradient(135deg, var(--af-text) 0%, var(--af-text-secondary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Smart Asset Management for Every Organization
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "var(--af-text-muted)",
              lineHeight: 1.7,
              marginBottom: "40px",
            }}
          >
            Track, allocate, maintain and optimize your assets — all in one
            powerful platform.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
                color: "var(--af-primary)",
                bg: "rgba(139,92,246,0.12)",
                title: "Real-time Tracking",
                desc: "Live overview of all assets across your organization",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                color: "#34d399",
                bg: "rgba(52,211,153,0.12)",
                title: "Secure & Role-Based",
                desc: "Enterprise-grade access control for every team member",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                ),
                color: "#fbbf24",
                bg: "rgba(251,191,36,0.12)",
                title: "Powerful Analytics",
                desc: "Insights that help you make better operational decisions",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    minWidth: "40px",
                    borderRadius: "10px",
                    background: item.bg,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: "4px", fontSize: "14px" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--af-text-muted)", lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            paddingTop: "32px",
            borderTop: "1px solid var(--af-border)",
          }}
        >
          {[
            { val: "2,482", label: "Assets tracked" },
            { val: "98%", label: "Uptime SLA" },
            { val: "< 1s", label: "Avg response" },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, fontSize: "20px", color: "var(--af-text)" }}>
                {s.val}
              </div>
              <div style={{ fontSize: "12px", color: "var(--af-text-muted)", marginTop: "2px" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT AUTH PANEL ── */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          background: "var(--af-surface)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "400px" }}>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              marginBottom: "8px",
              color: "var(--af-text)",
            }}
          >
            Welcome back 👋
          </h2>
          <p
            style={{
              color: "var(--af-text-muted)",
              marginBottom: "40px",
              fontSize: "15px",
            }}
          >
            Sign in to your AssetFlow workspace
          </p>

          {/* Discord Button */}
          <button
            onClick={handleDiscordSignIn}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: loading ? "#4752c4" : "#5865F2",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 24px rgba(88,101,242,0.35)",
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Connecting to Discord...
              </>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 127.14 96.36" fill="white">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96,46,95.91,53,91,65.69,84.69,65.69Z" />
                </svg>
                Continue with Discord
              </>
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          <div
            style={{
              marginTop: "32px",
              padding: "16px",
              background: "rgba(139,92,246,0.06)",
              border: "1px solid rgba(139,92,246,0.15)",
              borderRadius: "10px",
              fontSize: "13px",
              color: "var(--af-text-muted)",
              lineHeight: 1.6,
            }}
          >
            🔒 Your account is secured through Discord OAuth. AssetFlow never
            stores your Discord password.
          </div>

          <div
            style={{
              marginTop: "32px",
              textAlign: "center",
              fontSize: "12px",
              color: "var(--af-text-muted)",
            }}
          >
            By signing in you agree to our{" "}
            <span style={{ color: "var(--af-primary)", cursor: "pointer" }}>
              Terms of Service
            </span>{" "}
            &{" "}
            <span style={{ color: "var(--af-primary)", cursor: "pointer" }}>
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
