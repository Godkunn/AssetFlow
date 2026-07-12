"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@assetflow.io");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("af-profile-name");
    const savedEmail = localStorage.getItem("af-profile-email");
    if (savedName) setName(savedName);
    else if (session?.user?.name) setName(session.user.name);

    if (savedEmail) setEmail(savedEmail);
    else if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("af-profile-name", name);
    localStorage.setItem("af-profile-email", email);
    
    // Dispatch event to update Topbar in real-time
    window.dispatchEvent(new Event("profile-updated"));

    setToastMessage("Profile settings updated successfully!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "AU";

  return (
    <div className="af-page" style={{ padding: "24px", color: "var(--af-text-primary)" }}>
      {/* Breadcrumbs */}
      <nav className="af-breadcrumb" style={{ marginBottom: "16px" }}>
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Profile</span>
      </nav>

      {/* Header */}
      <div className="af-page-header" style={{ marginBottom: "24px" }}>
        <div>
          <h1 className="af-page-title" style={{ fontSize: "24px", fontWeight: 700, fontFamily: "Sora, sans-serif" }}>
            Profile Settings
          </h1>
          <p className="af-page-subtitle" style={{ color: "var(--af-text-muted)", fontSize: "14px" }}>
            Customize your account identity and system preferences.
          </p>
        </div>
      </div>

      {/* Profile Form Details */}
      <div className="af-content-grid cols-3-1">
        {/* Main Details Form */}
        <div className="af-card">
          <div className="af-card-header" style={{ borderBottom: "1px solid var(--af-border)", paddingBottom: "12px", marginBottom: "20px" }}>
            <h3 className="af-card-title" style={{ fontSize: "18px", fontWeight: 600, fontFamily: "Sora, sans-serif" }}>
              Personal Identity
            </h3>
          </div>
          <form onSubmit={handleSave} className="af-card-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--af-text-secondary)" }}>
                Full Name
              </label>
              <input
                type="text"
                className="af-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", maxWidth: "480px" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--af-text-secondary)" }}>
                Email Address
              </label>
              <input
                type="email"
                className="af-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", maxWidth: "480px" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--af-text-secondary)" }}>
                System Role
              </label>
              <input
                type="text"
                className="af-input"
                value="Tenant Administrator"
                disabled
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  background: "var(--af-surface-hover)",
                  cursor: "not-allowed",
                  opacity: 0.8
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--af-text-secondary)" }}>
                Organization
              </label>
              <input
                type="text"
                className="af-input"
                value="Acme India Corporate Headquarters"
                disabled
                style={{
                  width: "100%",
                  maxWidth: "480px",
                  background: "var(--af-surface-hover)",
                  cursor: "not-allowed",
                  opacity: 0.8
                }}
              />
            </div>

            <div style={{ marginTop: "12px" }}>
              <button type="submit" className="af-btn af-btn-primary" style={{ padding: "10px 24px" }}>
                Save Settings
              </button>
            </div>
          </form>
        </div>

        {/* User Card Sidebar */}
        <div className="af-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "30px 20px" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "var(--af-gradient-primary)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "16px",
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
            border: "2px solid rgba(255,255,255,0.1)"
          }}>
            {initials}
          </div>
          <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "4px" }}>{name}</h4>
          <p style={{ fontSize: "13px", color: "var(--af-text-muted)", marginBottom: "20px" }}>{email}</p>
          
          <div style={{ borderTop: "1px solid var(--af-border)", width: "100%", paddingTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" }}>
              <span style={{ color: "var(--af-text-muted)" }}>Account Status</span>
              <span className="af-badge af-badge-approved" style={{ fontSize: "11px", padding: "2px 8px" }}>Active</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span style={{ color: "var(--af-text-muted)" }}>Membership</span>
              <span style={{ fontWeight: 600 }}>Standard Enterprise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating success Toast */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "var(--af-primary)",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: "0 10px 25px rgba(139, 92, 246, 0.4)",
          zIndex: 9999,
          animation: "slideIn 0.3s ease",
        }}>
          {toastMessage}
          <style>{`
            @keyframes slideIn {
              from { transform: translateY(100%) scale(0.9); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
