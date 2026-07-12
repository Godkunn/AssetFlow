"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login") {
      router.push("/login");
    } else if (status === "authenticated" && pathname === "/login") {
      router.push("/");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--af-bg)' }}>
        <div className="af-empty-state">Loading...</div>
      </div>
    );
  }

  // If unauthenticated and not on login page, render nothing while redirecting
  if (status === "unauthenticated" && pathname !== "/login") {
    return null;
  }

  return <>{children}</>;
}
