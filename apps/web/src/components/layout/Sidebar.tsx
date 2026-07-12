import Link from 'next/link';

export default function Sidebar() {
  const collapsed = false; // Add state logic later if needed
  
  return (
    <nav className={`af-sidebar ${collapsed ? 'collapsed' : ''} open`} id="sidebar">
      <button className="af-sidebar-toggle" id="sidebarToggleBtn" title="Toggle Sidebar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div className="af-side-nav">
        <div className="af-side-section">
          {!collapsed && <div className="af-side-section-label">Overview</div>}
          <Link href="/" className="af-side-link active" title="Dashboard">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Dashboard</span>}
            <span className="af-tooltip">Dashboard</span>
          </Link>
        </div>

        <div className="af-side-section">
          {!collapsed && <div className="af-side-section-label">Management</div>}
          <Link href="/org" className="af-side-link" title="Organization Setup">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Organization Setup</span>}
            <span className="af-tooltip">Organization Setup</span>
          </Link>
          <Link href="/assets" className="af-side-link" title="Assets">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Assets</span>}
            <span className="af-tooltip">Assets</span>
          </Link>
        </div>

        <div className="af-side-section">
          {!collapsed && <div className="af-side-section-label">Operations</div>}
          <Link href="/allocation" className="af-side-link" title="Allocation & Transfer">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Allocation & Transfer</span>}
            <span className="af-tooltip">Allocation & Transfer</span>
          </Link>
          <Link href="/booking" className="af-side-link" title="Resource Booking">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Resource Booking</span>}
            <span className="af-tooltip">Resource Booking</span>
          </Link>
          <Link href="/maintenance" className="af-side-link" title="Maintenance">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Maintenance</span>}
            <span className="af-tooltip">Maintenance</span>
          </Link>
          <Link href="/reports" className="af-side-link" title="Reports & Analytics">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Reports</span>}
            <span className="af-tooltip">Reports & Analytics</span>
          </Link>
          <Link href="/audit" className="af-side-link" title="Audit & Compliance">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Audit</span>}
            <span className="af-tooltip">Audit & Compliance</span>
          </Link>
          <Link href="/notifications" className="af-side-link" title="Notifications">
            <span className="af-side-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </span>
            {!collapsed && <span className="af-side-label">Notifications</span>}
            <span className="af-tooltip">Notifications</span>
          </Link>
        </div>
      </div>

      {!collapsed && (
        <div className="af-side-footer">
          <div className="af-sidebar-stats">
            <div className="af-sidebar-stat">
              <span className="af-sidebar-stat-val">0</span>
              <span className="af-sidebar-stat-label">Assets</span>
            </div>
            <div className="af-sidebar-stat">
              <span className="af-sidebar-stat-val">0</span>
              <span className="af-sidebar-stat-label">People</span>
            </div>
            <div className="af-sidebar-stat">
              <span className="af-sidebar-stat-val">0</span>
              <span className="af-sidebar-stat-label">Depts</span>
            </div>
          </div>
        </div>
      )}

      <div className="af-sidebar-resizer" id="sidebarResizer"></div>
    </nav>
  );
}
