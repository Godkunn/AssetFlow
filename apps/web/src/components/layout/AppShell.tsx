"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (status === "loading") return; // still loading, wait

    if (!isLoginPage && status === "unauthenticated") {
      router.replace("/login");
    }

    if (isLoginPage && status === "authenticated") {
      router.replace("/");
    }
  }, [status, isLoginPage, router]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show loading spinner while session is being checked
  if (status === "loading") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--af-bg)",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "3px solid var(--af-border)",
            borderTopColor: "var(--af-primary)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <span style={{ color: "var(--af-text-muted)", fontSize: "14px" }}>
          Loading AssetFlow...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Login page — render without shell
  if (isLoginPage) {
    if (status === "authenticated") return null; // redirecting
    return <>{children}</>;
  }

  // Protected pages — redirect if not authenticated
  if (status === "unauthenticated") {
    return null; // redirecting to /login
  }

  // Authenticated app shell
  return (
    <div id="app" className="af-app">
      <Topbar session={session} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="af-app-body">
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <main className="af-main" id="mainContent">
          {children}
        </main>
      </div>
    </div>
  );
}
