"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

/* ─── Torus-knot 3D canvas ──────────────────────────────────────────────── */
function TorusKnotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Core Object (Torus Knot)
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 16, 2, 5);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00f2fe, 
        emissive: 0x051a3a, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.15
    });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    // Particle System
    const starGeo = new THREE.BufferGeometry();
    const starsCount = 1000;
    const positions = new Float32Array(starsCount * 3);
    for(let i=0; i<starsCount*3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.05, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Lights
    const light = new THREE.PointLight(0x00f2fe, 2, 100);
    light.position.set(0, 0, 2);
    scene.add(light);
    
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambient);
    
    camera.position.z = 6;

    // Mouse Interactivity
    let mouseX = 0; let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX - windowHalfX) * 0.001;
        mouseY = (e.clientY - windowHalfY) * 0.001;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let time = 0;
    let animId: number;
    function animate3D() {
        animId = requestAnimationFrame(animate3D);
        time += 0.002;
        
        knot.rotation.y += 0.005;
        knot.rotation.x += 0.002;
        
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        stars.rotation.y = time * 0.5;

        renderer.render(scene, camera);
    }
    animate3D();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        geometry.dispose();
        material.dispose();
        starGeo.dispose();
        starMat.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Floating 3-D dashboard mockup ─────────────────────────────────────── */
function DashboardMockup({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const rotX = (mouseY - 0.5) * -12;
  const rotY = (mouseX - 0.5) * 16;

  return (
    <div
      style={{
        perspective: "1200px",
        width: "100%",
        maxWidth: "560px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: "transform 0.12s ease-out",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(139,92,246,0.35)",
          boxShadow: `
            0 40px 80px rgba(0,0,0,0.6),
            0 0 0 1px rgba(139,92,246,0.2),
            0 0 60px rgba(139,92,246,0.15),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
          background: "rgba(17,13,27,0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Window chrome */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px",
          padding: "10px 14px",
          background: "rgba(139,92,246,0.08)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
        }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(139,92,246,0.15)", marginLeft: 8 }} />
        </div>

        {/* Fake dashboard content */}
        <div style={{ padding: "16px", display: "flex", gap: "12px" }}>
          {/* Mini sidebar */}
          <div style={{ width: 40, display: "flex", flexDirection: "column", gap: 6 }}>
            {["#8B5CF6","#6B7280","#6B7280","#6B7280","#6B7280"].map((c, i) => (
              <div key={i} style={{
                height: 8, borderRadius: 4,
                background: i === 0 ? c : "rgba(107,114,128,0.3)",
                width: i === 0 ? "100%" : "70%",
              }} />
            ))}
          </div>

          {/* Content area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {/* KPI row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                { color: "#8B5CF6", val: "2,847", label: "Assets" },
                { color: "#10B981", val: "87%", label: "Util." },
                { color: "#F59E0B", val: "23", label: "Maint." },
              ].map((k, i) => (
                <div key={i} style={{
                  background: `rgba(${i===0?"139,92,246":i===1?"16,185,129":"245,158,11"},0.08)`,
                  border: `1px solid rgba(${i===0?"139,92,246":i===1?"16,185,129":"245,158,11"},0.2)`,
                  borderRadius: 8, padding: "8px 10px",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: k.color }}>{k.val}</div>
                  <div style={{ fontSize: 9, color: "#6B5F85", marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div style={{
              height: 60, borderRadius: 8,
              background: "rgba(139,92,246,0.05)",
              border: "1px solid rgba(139,92,246,0.12)",
              display: "flex", alignItems: "flex-end", gap: 3, padding: "8px",
              overflow: "hidden",
            }}>
              {[45, 62, 55, 80, 72, 90, 68, 85, 78, 92, 70, 88].map((h, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: "3px 3px 0 0",
                  height: `${h}%`,
                  background: `linear-gradient(to top, #8B5CF6, #A78BFA)`,
                  opacity: 0.7 + i * 0.025,
                }} />
              ))}
            </div>

            {/* Table rows */}
            {[
              { name: "MacBook Pro 16\"", status: "Allocated", color: "#3B82F6" },
              { name: "Conference Room A", status: "Available", color: "#10B981" },
              { name: "Dell UltraSharp", status: "Maintenance", color: "#F59E0B" },
            ].map((row, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "5px 8px", borderRadius: 6,
                background: "rgba(139,92,246,0.04)",
                border: "1px solid rgba(139,92,246,0.08)",
              }}>
                <div style={{ fontSize: 9, color: "#A89EC8", fontWeight: 500 }}>{row.name}</div>
                <div style={{
                  fontSize: 8, fontWeight: 600,
                  padding: "2px 6px", borderRadius: 99,
                  background: `${row.color}22`, color: row.color,
                }}>{row.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Animated feature highlight ─────────────────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    color: "#A78BFA",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.25)",
    title: "Real-time Asset Tracking",
    desc: "Live overview of all assets, allocations, and lifecycle states across your organization.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: "#34D399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
    title: "Enterprise-grade Security",
    desc: "Row-level security, role-based access, MFA and full audit trail for compliance.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    color: "#FBBF24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.25)",
    title: "Powerful Analytics",
    desc: "Deep insights with utilization heatmaps, trend charts and exportable reports.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.25)",
    title: "Multi-tenant Architecture",
    desc: "Fully isolated per-org with shared infrastructure. Scale to hundreds of tenants.",
  },
];

/* ─── Main Login Page ────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("admin@assetflow.io");
  const [password, setPassword] = useState("demo1234");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featureIdx, setFeatureIdx] = useState(0);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [activeModal, setActiveModal] = useState<"terms" | "privacy" | "dmca" | "contact" | null>(null);

  /* Feature carousel auto-advance */
  useEffect(() => {
    const id = setInterval(() => setFeatureIdx(i => (i + 1) % FEATURES.length), 3200);
    return () => clearInterval(id);
  }, []);

  /* Mouse parallax tracking */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);



  const handleOAuth = async (provider: string) => {
    setLoading(provider);
    setError(null);
    await signIn(provider.toLowerCase(), { callbackUrl: "/" });
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password. Try admin@assetflow.io / demo1234");
      setLoading(null);
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  const feat = FEATURES[featureIdx];

  return (
    <div className="login-container">
      {/* ── Full-screen torus knot canvas ── */}
      <TorusKnotCanvas />

      {/* ── Gradient orbs ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 60% 50% at ${30 + mouse.x * 8}% ${30 + mouse.y * 8}%, rgba(139,92,246,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 40% 40% at ${70 - mouse.x * 6}% ${70 - mouse.y * 6}%, rgba(56,189,248,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 50% 50% at 50% 50%, rgba(8,4,16,0.4) 0%, transparent 80%)
        `,
      }} />

      {/* ── LEFT PANEL ── */}
      <div className="left-panel">
        {/* Brand header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/assets/logo.png"
            alt="AssetFlow"
            style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: "22px", color: "#F1EEFF", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.5px" }}>
              AssetFlow
            </div>
            <div style={{ fontSize: "10px", color: "#6B5F85", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Multi-Tenant ERP
            </div>
          </div>
          <span style={{
            marginLeft: 4, fontSize: 10, fontWeight: 700,
            background: "linear-gradient(135deg,#8B5CF6,#6C3BAF)",
            color: "#fff", padding: "3px 8px", borderRadius: 99, letterSpacing: "0.05em",
          }}>
            v2.0
          </span>
        </div>

        {/* ── 3D Dashboard Mockup ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", gap: 32,
          paddingTop: 24, paddingBottom: 16,
        }}>
          <div>
            <h1 style={{
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 14,
              fontFamily: "'Sora', sans-serif",
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #F1EEFF 20%, #A78BFA 60%, #38BDF8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Smart Asset Management<br />for Every Organization
            </h1>
            <p style={{ fontSize: 15, color: "#A89EC8", lineHeight: 1.65, maxWidth: 440 }}>
              Track, allocate, maintain and optimize your assets — schools, hospitals,
              factories, agencies — all in one platform.
            </p>
          </div>

          {/* Floating mockup */}
          <div className="mockup-container">
            <DashboardMockup mouseX={mouse.x} mouseY={mouse.y} />
          </div>

          {/* Animated feature card */}
          <div
            key={featureIdx}
            style={{
              display: "flex", gap: 16, alignItems: "flex-start",
              padding: "16px 20px",
              background: feat.bg,
              border: `1px solid ${feat.border}`,
              borderRadius: 14,
              animation: "fadeSlideIn 0.4s ease-out both",
              maxWidth: 480,
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: feat.bg, border: `1px solid ${feat.border}`,
              color: feat.color, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {feat.icon}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#F1EEFF", fontSize: 14, marginBottom: 4 }}>
                {feat.title}
              </div>
              <div style={{ fontSize: 13, color: "#A89EC8", lineHeight: 1.5 }}>{feat.desc}</div>
            </div>
          </div>

          {/* Feature dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {FEATURES.map((_, i) => (
              <button
                key={i}
                onClick={() => setFeatureIdx(i)}
                style={{
                  width: i === featureIdx ? 24 : 6, height: 6,
                  borderRadius: 99, border: "none", cursor: "pointer",
                  background: i === featureIdx ? "#8B5CF6" : "rgba(139,92,246,0.3)",
                  transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="bottom-stats-row">
          {[
            { val: "2,847", label: "Assets Tracked", color: "#A78BFA" },
            { val: "99.98%", label: "Uptime SLA", color: "#34D399" },
            { val: "<42ms", label: "API Response", color: "#FBBF24" },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontWeight: 800, fontSize: 20, color: m.color, fontFamily: "'Sora', sans-serif" }}>{m.val}</div>
              <div style={{ fontSize: 11, color: "#6B5F85", marginTop: 3, letterSpacing: "0.05em" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Login Card ── */}
      <div className="right-panel">
        <div className="right-panel-content" style={{ animation: "fadeUp 0.6s ease-out both" }}>
          {/* Card */}
          <div style={{
            background: "rgba(26,20,40,0.72)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: 20,
            padding: "40px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.08), 0 0 40px rgba(139,92,246,0.12)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}>
            {/* Card header */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: "#F1EEFF", margin: "0 0 8px", fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}>
                {isLogin ? "Welcome back" : "Join AssetFlow"}
              </h2>
              <p style={{ color: "#A89EC8", fontSize: 14, margin: 0 }}>
                {isLogin
                  ? "Sign in to your workspace"
                  : "Create your organization account"}
              </p>
            </div>



            {/* ── OAuth buttons ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {/* Google */}
              <OAuthBtn
                onClick={() => handleOAuth("Google")}
                disabled={!!loading}
                loading={loading === "google"}
                label="Google"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                }
                accentColor="#4285F4"
              />
              {/* GitHub */}
              <OAuthBtn
                onClick={() => handleOAuth("GitHub")}
                disabled={!!loading}
                loading={loading === "github"}
                label="GitHub"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#F1EEFF">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                }
                accentColor="#6E40C9"
              />
              {/* Discord */}
              <OAuthBtn
                onClick={() => handleOAuth("Discord")}
                disabled={!!loading}
                loading={loading === "discord"}
                label="Discord"
                icon={
                  <svg width="16" height="16" viewBox="0 0 127.14 96.36" fill="#5865F2">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96,46,95.91,53,91,65.69,84.69,65.69Z"/>
                  </svg>
                }
                accentColor="#5865F2"
              />
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.15)" }} />
              <span style={{ fontSize: 11, color: "#6B5F85", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                or with email
              </span>
              <span style={{ flex: 1, height: 1, background: "rgba(139,92,246,0.15)" }} />
            </div>

            {/* Form */}
            {isLogin ? (
              <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <FloatLabel label="Email address">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </FloatLabel>

                <FloatLabel label="Password">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </FloatLabel>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, margin: "2px 0" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 7, color: "#A89EC8", cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: "#8B5CF6" }} />
                    Remember me
                  </label>
                  <a href="#" style={{ color: "#A78BFA", textDecoration: "none" }}>Forgot password?</a>
                </div>

                {error && (
                  <div style={{
                    padding: "10px 14px", borderRadius: 8, fontSize: 12,
                    background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)",
                    color: "#FB7185",
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!!loading}
                  style={{
                    width: "100%", padding: "14px",
                    background: loading === "credentials"
                      ? "rgba(139,92,246,0.5)"
                      : "linear-gradient(135deg, #8B5CF6 0%, #6C3BAF 100%)",
                    color: "#fff", border: "none", borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                    marginTop: 4, letterSpacing: "0.02em",
                    boxShadow: loading ? "none" : "0 4px 20px rgba(139,92,246,0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  {loading === "credentials" ? "Signing in…" : "Sign In →"}
                </button>

                <div style={{
                  textAlign: "center", fontSize: 11, color: "#6B5F85",
                  padding: "8px 12px", borderRadius: 8,
                  background: "rgba(139,92,246,0.06)",
                  border: "1px solid rgba(139,92,246,0.1)",
                }}>
                  Demo: <span style={{ color: "#A78BFA" }}>admin@assetflow.io</span> / <span style={{ color: "#A78BFA" }}>demo1234</span>
                </div>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <FloatLabel label="Full name">
                  <input type="text" placeholder="Sarah Chen" style={inputStyle} />
                </FloatLabel>
                <FloatLabel label="Work email">
                  <input type="email" placeholder="name@company.com" style={inputStyle} />
                </FloatLabel>
                <FloatLabel label="Organization name">
                  <input type="text" placeholder="Acme Corp" style={inputStyle} />
                </FloatLabel>
                <button
                  onClick={() => setIsLogin(true)}
                  style={{
                    width: "100%", padding: "14px",
                    background: "linear-gradient(135deg, #8B5CF6 0%, #6C3BAF 100%)",
                    color: "#fff", border: "none", borderRadius: 12,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
                  }}
                >
                  Create Account →
                </button>
              </div>
            )}

            {/* Toggle */}
            <div style={{ textAlign: "center", fontSize: 13, marginTop: 24, color: "#A89EC8" }}>
              {isLogin ? "New here? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                style={{ color: "#A78BFA", background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13 }}
              >
                {isLogin ? "Create an account" : "Sign In"}
              </button>
            </div>
          </div>

          {/* Footer links */}
          <div style={{
            textAlign: "center", marginTop: 24, fontSize: 11, color: "#4A3F60",
            display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap",
            alignItems: "center"
          }}>
            <span style={{ color: "#6B5F85" }}>By signing in, you agree to our</span>
            <button
              onClick={() => setActiveModal("terms")}
              style={{ color: "#A78BFA", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, fontWeight: 500 }}
            >
              Terms
            </button>
            <span style={{ color: "#4A3F60" }}>&</span>
            <button
              onClick={() => setActiveModal("privacy")}
              style={{ color: "#A78BFA", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, fontWeight: 500 }}
            >
              Privacy Policy
            </button>
            <span style={{ color: "#4A3F60" }}>•</span>
            <button
              onClick={() => setActiveModal("dmca")}
              style={{ color: "#A78BFA", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, fontWeight: 500 }}
            >
              DMCA Notice
            </button>
            <span style={{ color: "#4A3F60" }}>•</span>
            <button
              onClick={() => setActiveModal("contact")}
              style={{ color: "#A78BFA", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 11, fontWeight: 500 }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* ── MODALS (Terms, Privacy, DMCA, Contact) ── */}
      {activeModal && (
        <LegalModal type={activeModal} onClose={() => setActiveModal(null)} />
      )}

      {/* ── Global CSS style block ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
        
        .login-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #080410;
          position: relative;
        }

        .left-panel {
          flex: 0 0 52%;
          display: flex;
          flex-direction: column;
          padding: 40px 52px;
          position: relative;
          z-index: 5;
          border-right: 1px solid rgba(139,92,246,0.12);
          justify-content: space-between;
          overflow-y: auto;
        }

        .bottom-stats-row {
          display: flex;
          gap: 40px;
          padding-top: 24px;
          border-top: 1px solid rgba(139,92,246,0.12);
        }

        .right-panel {
          flex: 0 0 48%;
          display: flex;
          flex-direction: column;
          padding: 40px 48px;
          overflow-y: auto;
          position: relative;
          z-index: 5;
        }

        .right-panel-content {
          margin: auto;
          width: 100%;
          max-width: 440px;
          padding: 24px 0;
        }

        .mockup-container {
          transition: transform 0.3s ease;
        }

        /* Screen height dynamic scaling to prevent cutting elements off */
        @media (max-height: 900px) {
          .left-panel {
            padding: 24px 32px;
          }
          .bottom-stats-row {
            padding-top: 16px;
          }
          .mockup-container {
            transform: scale(0.9);
            margin: -8px 0;
          }
        }

        @media (max-height: 800px) {
          .mockup-container {
            transform: scale(0.8);
            margin: -24px 0;
          }
          .left-panel h1 {
            font-size: 28px !important;
          }
        }

        @media (max-height: 700px) {
          .mockup-container {
            transform: scale(0.7);
            margin: -40px 0;
          }
          .left-panel h1 {
            font-size: 24px !important;
          }
        }

        /* Responsive Layouts */
        @media (max-width: 1024px) {
          .login-container {
            flex-direction: column;
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }
          .left-panel {
            flex: none;
            width: 100%;
            padding: 32px 24px;
            border-right: none;
            border-bottom: 1px solid rgba(139,92,246,0.12);
          }
          .bottom-stats-row {
            gap: 20px;
            flex-wrap: wrap;
          }
          .right-panel {
            flex: none;
            width: 100%;
            padding: 32px 24px;
            overflow-y: visible;
          }
          .right-panel-content {
            padding: 12px 0;
          }
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px rgba(10,6,18,0.8) inset !important;
          -webkit-text-fill-color: #F1EEFF !important;
          caret-color: #F1EEFF !important;
        }
      `}</style>
    </div>
  );
}

/* ─── Legal Modal Wrapper Component ──────────────────────────────────────── */
function LegalModal({ type, onClose }: { type: "terms" | "privacy" | "dmca" | "contact"; onClose: () => void }) {
  const getModalContent = () => {
    switch (type) {
      case "terms":
        return {
          title: "Terms of Service",
          date: "Last updated: July 12, 2026",
          body: (
            <>
              <h3>1. Agreement to Terms</h3>
              <p>By accessing or using AssetFlow ERP, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the services.</p>

              <h3>2. Account Registration and Security</h3>
              <p>You must provide accurate, complete, and current information when registering. You are responsible for safeguarding your account password and authorizing access under your tenant workspace.</p>

              <h3>3. Multi-Tenant Organization Scope</h3>
              <p>Data isolation is enforced at the database level via Row-Level Security (RLS). You retain ownership of all data created under your tenant id. We do not sell or cross-share tenant data.</p>

              <h3>4. Acceptable Use</h3>
              <p>You agree not to exploit our platform, bypass authentication guards, or inject malicious payloads into audit logs or asset registry entities.</p>

              <h3>5. Limitation of Liability</h3>
              <p>AssetFlow is provided "as is". In no event shall AssetFlow be liable for any discrepancies, booking conflicts, or maintenance delays.</p>
            </>
          )
        };
      case "privacy":
        return {
          title: "Privacy Policy",
          date: "Last updated: July 12, 2026",
          body: (
            <>
              <h3>1. Data Collection</h3>
              <p>We collect registration details (name, email) and OAuth profile tokens when you sign in via Google, Discord, or GitHub.</p>

              <h3>2. Row-Level Security & Tenants</h3>
              <p>Every asset, maintenance ticket, and booking created is explicitly bounded by a <code>tenantId</code> column. Only authorized personnel from your tenant can access this data.</p>

              <h3>3. Third Party Auth Integration</h3>
              <p>We use secure OAuth 2.0 protocols to authenticate your credentials. We do not store your Google, GitHub, or Discord account passwords.</p>

              <h3>4. Cookie Consent</h3>
              <p>We use session tokens to keep you logged in. You can clear them from local storage at any time.</p>
            </>
          )
        };
      case "dmca":
        return {
          title: "DMCA Policy",
          date: "Last updated: July 12, 2026",
          body: (
            <>
              <h3>DMCA Notice & Policy</h3>
              <p>To report copyright infringement, please contact our support team at <a href="mailto:dmca@assetflow.io" style={{ color: "#A78BFA" }}>dmca@assetflow.io</a> with details about the copyrighted material, location of the asset description, and authorization proof.</p>
            </>
          )
        };
      case "contact":
        return {
          title: "Contact Support",
          date: "We typically reply within 2 hours",
          body: (
            <>
              <h3>Contact AssetFlow Support</h3>
              <p>Need assistance with your multi-tenant tenant administration, workspace migration, or RBAC custom controls? We are here to help!</p>
              <p>Reach out to us directly at: <a href="mailto:support@assetflow.io" style={{ color: "#A78BFA" }}>support@assetflow.io</a></p>
            </>
          )
        };
    }
  };

  const { title, date, body } = getModalContent();

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(6, 3, 12, 0.75)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      animation: "fadeUp 0.3s ease-out"
    }}>
      <div style={{
        background: "rgba(28, 22, 44, 0.95)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 24px 80px rgba(0,0,0,0.8), 0 0 40px rgba(139, 92, 246, 0.15)",
        position: "relative",
        color: "#F1EEFF"
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#A89EC8",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(139,92,246,0.15)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: "24px", borderBottom: "1px solid rgba(139, 92, 246, 0.15)", paddingBottom: "16px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 6px", fontFamily: "'Sora', sans-serif" }}>{title}</h2>
          <span style={{ fontSize: "12px", color: "#6B5F85" }}>{date}</span>
        </div>

        {/* Modal Body */}
        <div style={{ fontSize: "14px", lineHeight: "1.65", color: "#A89EC8" }} className="modal-rich-text">
          {body}
        </div>
      </div>
      <style>{`
        .modal-rich-text h3 {
          font-family: 'Sora', sans-serif;
          color: #F1EEFF;
          font-size: 16px;
          margin-top: 24px;
          margin-bottom: 8px;
        }
        .modal-rich-text p {
          margin-bottom: 16px;
        }
        .modal-rich-text code {
          background: rgba(139,92,246,0.15);
          color: #A78BFA;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}

/* ─── OAuth button component ─────────────────────────────────────────────── */
function OAuthBtn({
  onClick, disabled, loading, label, icon, accentColor,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  label: string;
  icon: React.ReactNode;
  accentColor: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "11px 8px",
        background: hovered ? `${accentColor}18` : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? `${accentColor}55` : "rgba(139,92,246,0.15)"}`,
        borderRadius: 10,
        color: "#F1EEFF",
        fontSize: 12,
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled && !loading ? 0.6 : 1,
        transition: "all 0.2s",
        boxShadow: hovered ? `0 4px 16px ${accentColor}25` : "none",
      }}
    >
      {loading ? (
        <div style={{
          width: 16, height: 16, borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.2)",
          borderTopColor: accentColor,
          animation: "spin 0.7s linear infinite",
        }} />
      ) : icon}
      <span style={{ fontSize: 11 }}>{label}</span>
    </button>
  );
}

/* ─── Floating label wrapper ─────────────────────────────────────────────── */
function FloatLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: "#A89EC8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Shared input style ─────────────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(8,4,16,0.5)",
  border: "1px solid rgba(139,92,246,0.18)",
  borderRadius: 10,
  color: "#F1EEFF",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
