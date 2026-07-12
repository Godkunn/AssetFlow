"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface TopbarProps {
  session?: Session | null;
  onToggleSidebar?: () => void;
}

export default function Topbar({ session, onToggleSidebar }: TopbarProps) {
  const router = useRouter();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('af-theme') as 'dark' | 'light' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('af-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const userName = session?.user?.name || "Admin";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image || null;
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="af-topbar">
      <div className="af-topbar-left">
        <button className="af-topbar-hamburger" title="Toggle sidebar" onClick={onToggleSidebar}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="af-topbar-logo">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#0c0819", // premium dark tile background
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}>
              <img
                src="/assets/logo.png"
                alt="AssetFlow"
                style={{
                  width: "22px",
                  height: "22px",
                  objectFit: "cover",
                  mixBlendMode: "screen",
                  opacity: 1, // 100% opacity in both light and dark theme!
                }}
              />
            </div>
            <span style={{ fontWeight: 700, fontSize: "18px", color: "var(--af-text)", letterSpacing: "-0.5px" }}>
              AssetFlow
            </span>
            <span style={{
              fontSize: "10px",
              fontWeight: 600,
              background: "var(--af-primary)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              letterSpacing: "0.5px"
            }}>
              ERP
            </span>
          </Link>
        </div>
      </div>

      <div className="af-topbar-center">
        <div className="af-topbar-search">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search assets, bookings, people..."
            autoComplete="off"
          />
          <kbd className="search-kbd">Ctrl K</kbd>
        </div>
      </div>

      <div className="af-topbar-right">
        <button
          className="af-topbar-bell"
          onClick={toggleTheme}
          title="Toggle theme"
          style={{ cursor: "pointer", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {theme === "dark" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <Link href="/notifications" className="af-topbar-bell" title="Notifications">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </Link>

        <div className="af-topbar-user">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="af-topbar-user-avatar"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="af-topbar-user-avatar">{initials}</div>
          )}
          <div className="af-topbar-user-info">
            <span className="af-topbar-user-name">{userName}</span>
            <span className="af-topbar-user-role">
              {userEmail || "Tenant Admin"}
            </span>
          </div>
          <button
            className="af-topbar-bell"
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Sign out"
            style={{ width: "32px", height: "32px", borderRadius: "var(--af-radius-sm)", marginLeft: "8px" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
