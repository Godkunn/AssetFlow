"use client";

import { useQuery } from '@tanstack/react-query';
import { reportsAPI } from '@/lib/api';

export default function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: reportsAPI.getDashboardKpis,
  });

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400">Loading Dashboard...</div>;
  }

  // Fallback defaults if API fails or is empty
  const metrics = kpis || {
    totalAssets: 0,
    totalValue: 0,
    allocations: 0,
    maintenance: 0,
    transfers: 0,
    returns: 0
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">AssetFlow</span>
      </nav>

      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Welcome, Admin!</h1>
          <p className="af-page-subtitle">Tenant Admin · {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="af-kpi-grid">
        <div className="af-kpi af-kpi-emerald">
          <div className="af-kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div className="af-kpi-body">
            <span className="af-kpi-value">{metrics.totalAssets}</span>
            <span className="af-kpi-label">Total Assets</span>
          </div>
        </div>

        <div className="af-kpi af-kpi-purple">
          <div className="af-kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
          </div>
          <div className="af-kpi-body">
            <span className="af-kpi-value">{metrics.allocations}</span>
            <span className="af-kpi-label">Assets Allocated</span>
          </div>
        </div>

        <div className="af-kpi af-kpi-amber">
          <div className="af-kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div className="af-kpi-body">
            <span className="af-kpi-value">{metrics.maintenance}</span>
            <span className="af-kpi-label">Maintenance Active</span>
          </div>
        </div>

        <div className="af-kpi af-kpi-teal">
          <div className="af-kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
          </div>
          <div className="af-kpi-body">
            <span className="af-kpi-value">{metrics.transfers}</span>
            <span className="af-kpi-label">Pending Transfers</span>
          </div>
        </div>
        
        <div className="af-kpi af-kpi-gold">
          <div className="af-kpi-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </div>
          <div className="af-kpi-body">
            <span className="af-kpi-value">{metrics.returns}</span>
            <span className="af-kpi-label">Upcoming Returns</span>
          </div>
        </div>
      </div>

      <div className="af-overdue-banner">
        <span className="af-pulse-dot"></span>
        <span className="af-overdue-text">
          <strong>3 assets overdue</strong> for scheduled return. Please follow up with asset holders.
        </span>
        <button className="af-btn af-btn-sm af-btn-ghost">View assets</button>
      </div>

      <div className="af-quick-actions">
        <button className="af-btn af-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          Register Asset
        </button>
        <button className="af-btn af-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Book Resource
        </button>
        <button className="af-btn af-btn-secondary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          Raise Maintenance
        </button>
      </div>

      <div className="af-grid-2col">
        <div className="af-card">
          <div className="af-card-header">
            <h3 className="af-card-title">Recent Activity</h3>
            <span className="af-card-badge">3 entries</span>
          </div>
          <div className="af-card-body af-card-body-flush">
            <div className="af-activity-item">
              <div className="af-activity-dot"></div>
              <div className="af-activity-content">
                <span className="af-activity-text">
                  <strong>Sarah Jenkins</strong> assigned 
                  <span className="af-text-muted"> · MacBook Pro 16"</span>
                </span>
                <span className="af-activity-time">10 minutes ago</span>
              </div>
            </div>
            <div className="af-activity-item">
              <div className="af-activity-dot"></div>
              <div className="af-activity-content">
                <span className="af-activity-text">
                  <strong>System</strong> flagged for maintenance 
                  <span className="af-text-muted"> · Dell XPS 15</span>
                </span>
                <span className="af-activity-time">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="af-card">
          <div className="af-card-header">
            <h3 className="af-card-title">Notifications</h3>
            <span className="af-card-badge">0 unread</span>
          </div>
          <div className="af-card-body af-card-body-flush">
            <p className="af-empty-state">You're all caught up!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
