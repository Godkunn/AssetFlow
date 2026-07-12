"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("admin@assetflow.io");
  const [password, setPassword] = useState("demo1234");
  const [isLogin, setIsLogin] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Torus Knot background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const points: any[] = [];
    const mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    canvas.parentElement?.addEventListener("mousemove", handleMouseMove);

    // Torus knot formula (p=2, q=3)
    const torusKnot = (val: number, R = 140, r = 50, p = 2, q = 3) => {
      const phi = val;
      const theta = (q * phi) / p;
      const x = Math.cos(phi) * (R + r * Math.cos(theta));
      const y = Math.sin(phi) * (R + r * Math.cos(theta));
      const z = r * Math.sin(theta);
      return { x, y, z };
    };

    // Project 3D to 2D
    const project = (x: number, y: number, z: number, cx: number, cy: number, fov = 600, rotX = 0, rotY = 0) => {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const rx = x * cosY - z * sinY;
      const rz = x * sinY + z * cosY;

      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const ry = y * cosX - rz * sinX;
      const rz2 = y * sinX + rz * cosX;

      const scale = fov / (fov + rz2 + 200);
      return {
        sx: cx + rx * scale,
        sy: cy + ry * scale,
        scale,
        depth: rz2,
      };
    };

    // Build points
    const steps = 320;
    for (let i = 0; i <= steps; i++) {
      const val = (i / steps) * Math.PI * 2;
      const p = torusKnot(val);
      const hue = (i / steps) * 360;
      points.push({ val, ...p, hue });
    }

    // Sparks
    const sparks = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.3,
      color: Math.random() > 0.6 ? "rgba(139,92,246," : "rgba(245,158,11,",
      a: Math.random() * 0.4 + 0.05,
    }));

    const animate = () => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const rotY = t * 0.008 + mouse.x * 0.0008;
      const rotX = Math.sin(t * 0.003) * 0.4 + mouse.y * 0.0006;

      ctx.fillStyle = "rgba(10, 6, 18, 0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const projected = points.map((p) => ({
        ...project(p.x, p.y, p.z, cx, cy, 700, rotX, rotY),
        hue: p.hue,
      }));

      projected.sort((a, b) => a.depth - b.depth);

      for (let i = 0; i < projected.length - 1; i++) {
        const p1 = projected[i];
        const p2 = projected[(i + 1) % projected.length];

        const brightness = Math.max(0.3, (p1.depth + 250) / 500);
        const alpha = Math.min(1, brightness * 0.85);
        const lineW = Math.max(0.4, p1.scale * 2.5);

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);

        const h = (p1.hue + t * 0.3) % 360;
        let r, g, b;
        if (h < 120) {
          const mix = h / 120;
          r = Math.round(139 + (245 - 139) * mix);
          g = Math.round(92 + (158 - 92) * mix);
          b = Math.round(246 + (11 - 246) * mix);
        } else if (h < 240) {
          const mix = (h - 120) / 120;
          r = Math.round(245 + (56 - 245) * mix);
          g = Math.round(158 + (189 - 158) * mix);
          b = Math.round(11 + (248 - 11) * mix);
        } else {
          const mix = (h - 240) / 120;
          r = Math.round(56 + (139 - 56) * mix);
          g = Math.round(189 + (92 - 189) * mix);
          b = Math.round(248 + (246 - 248) * mix);
        }

        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth = lineW;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + s.a + ")";
        ctx.fill();
      }

      t++;
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const handleOAuthSignIn = async (provider: string) => {
    setLoading(provider);
    await signIn(provider.toLowerCase(), { callbackUrl: "/" });
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#0A0612",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── LEFT PANEL: BRAND & TORUS KNOT ANIMATION ── */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          padding: "48px 64px",
          position: "relative",
          overflow: "hidden",
          borderRight: "1px solid rgba(139, 92, 246, 0.15)",
          justifyContent: "space-between",
          background: "radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 40%)",
        }}
      >
        {/* Parametric Canvas background */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 5 }}>
          <img
            src="/assets/icons/logo.png"
            alt="AssetFlow logo"
            style={{ width: "40px", height: "40px", borderRadius: "8px" }}
            onError={(e) => {
              // fallback if logo is not placed in public folder yet
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <span style={{ fontWeight: 800, fontSize: "24px", color: "#F1EEFF", fontFamily: "Sora, sans-serif" }}>
            AssetFlow
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              background: "#8B5CF6",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            ERP
          </span>
        </div>

        {/* Hero Content */}
        <div style={{ zIndex: 5, maxWidth: "520px", marginTop: "auto", marginBottom: "auto" }}>
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: "24px",
              color: "#F1EEFF",
              fontFamily: "Sora, sans-serif",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #F1EEFF 30%, #A78BFA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Smart Asset Management for Every Organization
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#A89EC8",
              lineHeight: 1.6,
              marginBottom: "40px",
            }}
          >
            Track, allocate, maintain and optimize your assets — all in one powerful platform.
          </p>

          {/* Core features listing */}
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
                color: "#A78BFA",
                bg: "rgba(139, 92, 246, 0.08)",
                title: "Real-time Tracking",
                desc: "Live overview of all assets and lifecycle states.",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                color: "#34D399",
                bg: "rgba(52, 211, 153, 0.08)",
                title: "Secure & Reliable",
                desc: "Enterprise-grade security & role-based RLS access.",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                ),
                color: "#FBBF24",
                bg: "rgba(251, 191, 36, 0.08)",
                title: "Powerful Analytics",
                desc: "Insights that help you make better decision models.",
              },
            ].map((item, idx) => (
              <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: item.bg,
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(139, 92, 246, 0.1)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "#F1EEFF", fontSize: "14px", marginBottom: "2px" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "13px", color: "#A89EC8" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Metrics */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(139, 92, 246, 0.12)",
            zIndex: 5,
          }}
        >
          {[
            { val: "2,482", label: "Assets Tracked" },
            { val: "98%", label: "Uptime SLA" },
            { val: "< 1s", label: "Avg Response" },
          ].map((m, idx) => (
            <div key={idx}>
              <div style={{ fontWeight: 700, fontSize: "20px", color: "#F1EEFF" }}>{m.val}</div>
              <div style={{ fontSize: "12px", color: "#A89EC8", marginTop: "2px" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL: CENTERED LOGIN CARD ── */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px",
          background: "rgba(17, 13, 27, 0.6)",
          backdropFilter: "blur(4px)",
          position: "relative",
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "440px",
            background: "rgba(36, 30, 48, 0.7)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            borderRadius: "14px",
            padding: "40px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(139, 92, 246, 0.15)",
          }}
        >
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#F1EEFF", margin: "0 0 6px" }}>
            {isLogin ? "Welcome back 👋" : "Create account ✨"}
          </h2>
          <p style={{ color: "#A89EC8", fontSize: "14px", marginBottom: "32px" }}>
            {isLogin ? "Sign in to your tenant account" : "Get started with a free workspace"}
          </p>

          {isLogin ? (
            <form onSubmit={handleCredentialsSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#A89EC8", marginBottom: "6px" }}>
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(10, 6, 18, 0.4)",
                    border: "1px solid rgba(139, 92, 246, 0.15)",
                    borderRadius: "8px",
                    color: "#F1EEFF",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#A89EC8", marginBottom: "6px" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(10, 6, 18, 0.4)",
                    border: "1px solid rgba(139, 92, 246, 0.15)",
                    borderRadius: "8px",
                    color: "#F1EEFF",
                    fontSize: "14px",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", margin: "4px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#A89EC8", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "#8B5CF6" }} />
                  Remember me
                </label>
                <a href="#" style={{ color: "#A78BFA", textDecoration: "none" }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading !== null}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #8B5CF6 0%, #6C3BAF 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "8px",
                }}
              >
                {loading === "credentials" ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Simple Signup View */}
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#A89EC8", marginBottom: "6px" }}>
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(10, 6, 18, 0.4)",
                    border: "1px solid rgba(139, 92, 246, 0.15)",
                    borderRadius: "8px",
                    color: "#F1EEFF",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", color: "#A89EC8", marginBottom: "6px" }}>
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(10, 6, 18, 0.4)",
                    border: "1px solid rgba(139, 92, 246, 0.15)",
                    borderRadius: "8px",
                    color: "#F1EEFF",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>
              <button
                onClick={() => setIsLogin(true)}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #8B5CF6 0%, #6C3BAF 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginTop: "8px",
                }}
              >
                Create Account
              </button>
            </div>
          )}

          {/* Social login divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "24px 0", gap: "10px" }}>
            <span style={{ flex: 1, height: "1px", background: "rgba(139, 92, 246, 0.15)" }}></span>
            <span style={{ fontSize: "12px", color: "#6B5F85", textTransform: "uppercase" }}>or continue with</span>
            <span style={{ flex: 1, height: "1px", background: "rgba(139, 92, 246, 0.15)" }}></span>
          </div>

          {/* Social login buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => handleOAuthSignIn("Google")}
              disabled={loading !== null}
              style={{
                flex: 1,
                padding: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(139, 92, 246, 0.15)",
                borderRadius: "8px",
                color: "#F1EEFF",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>

            <button
              onClick={() => handleOAuthSignIn("GitHub")}
              disabled={loading !== null}
              style={{
                flex: 1,
                padding: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(139, 92, 246, 0.15)",
                borderRadius: "8px",
                color: "#F1EEFF",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>

            <button
              onClick={() => handleOAuthSignIn("Discord")}
              disabled={loading !== null}
              style={{
                flex: 1,
                padding: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(139, 92, 246, 0.15)",
                borderRadius: "8px",
                color: "#F1EEFF",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 127.14 96.36" fill="currentColor">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96,46,95.91,53,91,65.69,84.69,65.69Z" />
              </svg>
              Discord
            </button>
          </div>

          {/* Toggle form link */}
          <div style={{ marginTop: "28px", textAlign: "center", fontSize: "13px" }}>
            {isLogin ? (
              <span style={{ color: "#A89EC8" }}>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  style={{ color: "#A78BFA", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span style={{ color: "#A89EC8" }}>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  style={{ color: "#A78BFA", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
