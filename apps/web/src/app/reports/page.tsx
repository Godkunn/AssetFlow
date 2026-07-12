"use client";

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { assetsAPI, maintenanceAPI, bookingAPI, reportsAPI } from '@/lib/api';

export default function ReportsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: assets = [], isLoading: isLoadingAssets } = useQuery({
    queryKey: ['assets', 'All'],
    queryFn: () => assetsAPI.getAssets('All Assets'),
  });

  const { data: tickets = [], isLoading: isLoadingTickets } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceAPI.getTickets,
  });

  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingAPI.getBookings,
  });

  const exportMutation = useMutation({
    mutationFn: reportsAPI.exportReport,
    onSuccess: (data: any) => {
      // 1. Generate CSV content
      const headers = ['Asset Tag', 'Asset Name', 'Category', 'Cost', 'Status', 'Condition'];
      const rows = data.assets.map((a: any) => [
        `"${a.tag}"`,
        `"${a.name}"`,
        `"${a.category}"`,
        a.cost,
        `"${a.status}"`,
        `"${a.condition}"`
      ]);
      
      const csvContent = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
      
      // 2. Trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `AssetFlow_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 3. Show premium Toast notification
      setToastMessage('Report exported and downloaded successfully!');
      setTimeout(() => setToastMessage(null), 3000);
    },
    onError: () => {
      setToastMessage('Failed to export report. Please try again.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  });

  const isLoading = isLoadingAssets || isLoadingTickets || isLoadingBookings;

  // Process data
  const categoryCounts = assets.reduce((acc: any, asset: any) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;
    return acc;
  }, {});

  const byCategory = Object.keys(categoryCounts).map(name => ({
    name,
    total: categoryCounts[name],
    allocated: assets.filter((a: any) => a.category === name && a.status === 'Allocated').length
  }));

  const maxTotal = Math.max(...byCategory.map(c => c.total), 1);
  const totalAssets = assets.length;
  const portfolioValue = assets.reduce((sum: number, a: any) => sum + (a.cost || 0), 0);
  const activeTickets = tickets.filter((t: any) => t.stage !== 'Resolved').length;
  const activeBookings = bookings.filter((b: any) => b.status !== 'Cancelled').length;

  /* Maintenance trend data (mock for visual) */
  const maintTrend = [3, 5, 4, 7, 6, 8, 5];
  const maxTrend = Math.max(...maintTrend);
  const trendPoints = maintTrend.map((v, i) => `${10 + i * 48},${130 - (v / maxTrend * 100)}`).join(' ');
  const areaPoints = `${trendPoints} ${10 + 6 * 48},140 10,140`;

  /* Heatmap data (mock) */
  const heatData = [2, 4, 7, 9, 10, 8, 6, 3, 5, 7];

  /* Top assets (mock) */
  const topAssets = [
    { name: 'Conference Room B2', tag: 'RM-B2', usage: 34, unit: 'bookings this month' },
    { name: 'Delivery Van', tag: 'AF-0343', usage: 21, unit: 'trips this month' },
    { name: 'Projector', tag: 'AF-0062', usage: 18, unit: 'uses this month' },
  ];

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Reports</span>
      </nav>
      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Reports &amp; Analytics</h1>
          <p className="af-page-subtitle">Operational insight across utilization, maintenance, and bookings.</p>
        </div>
        <button className="af-btn af-btn-primary" onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {exportMutation.isPending ? 'Exporting...' : 'Export Report'}
        </button>
      </div>

      {isLoading ? (
        <div className="af-empty-state">Loading reports data...</div>
      ) : (
        <>
          {/* KPI summary row */}
          <div className="af-kpi-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
            <div className="af-kpi af-kpi-purple">
              <div className="af-kpi-value">{totalAssets}</div>
              <div className="af-kpi-label">Total Assets</div>
            </div>
            <div className="af-kpi af-kpi-emerald">
              <div className="af-kpi-value">${portfolioValue.toLocaleString()}</div>
              <div className="af-kpi-label">Portfolio Value</div>
            </div>
            <div className="af-kpi af-kpi-amber">
              <div className="af-kpi-value">{activeTickets}</div>
              <div className="af-kpi-label">Active Tickets</div>
            </div>
            <div className="af-kpi af-kpi-sky">
              <div className="af-kpi-value">{activeBookings}</div>
              <div className="af-kpi-label">Active Bookings</div>
            </div>
          </div>

          <div className="af-grid-2col">
            {/* Utilization by category */}
            <div className="af-card">
              <div className="af-card-header"><h3>Utilization by Category</h3></div>
              <div className="af-card-body">
                <div className="af-chart-bars">
                  {byCategory.map(c => {
                    const pct = (c.total / maxTotal * 100) || 4;
                    const utilPct = c.total > 0 ? Math.round(c.allocated / c.total * 100) : 0;
                    return (
                      <div key={c.name} className="af-chart-bar-item">
                        <div className="af-chart-bar-label">{c.name}</div>
                        <div className="af-chart-bar-track">
                          <div className="af-chart-bar-fill" style={{ width: `${pct}%` }}>
                            <div className="af-chart-bar-alloc" style={{ width: `${utilPct}%` }}></div>
                          </div>
                        </div>
                        <div className="af-chart-bar-val">{c.allocated}/{c.total}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="af-chart-legend" style={{ marginTop: '12px' }}>
                  <span><span className="af-legend-dot" style={{ background: 'var(--af-purple)' }}></span>Total</span>
                  <span><span className="af-legend-dot" style={{ background: 'var(--af-gold)' }}></span>Allocated</span>
                </div>
              </div>
            </div>

            {/* Maintenance trend */}
            <div className="af-card">
              <div className="af-card-header"><h3>Maintenance Frequency (7 weeks)</h3></div>
              <div className="af-card-body">
                <svg viewBox="0 0 340 155" width="100%" height="155" className="af-chart-svg">
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--af-teal)" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="var(--af-teal)" stopOpacity="0.02"/>
                    </linearGradient>
                  </defs>
                  <polygon fill="url(#trendGrad)" points={areaPoints}/>
                  <polyline fill="none" stroke="var(--af-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    points={trendPoints}/>
                  {maintTrend.map((v, i) => (
                    <g key={i}>
                      <circle cx={10 + i * 48} cy={130 - (v / maxTrend * 100)} r="4" fill="var(--af-bg-secondary)" stroke="var(--af-teal)" strokeWidth="2"/>
                      <text x={10 + i * 48} y={130 - (v / maxTrend * 100) - 10} textAnchor="middle" fill="var(--af-text-secondary)" fontSize="10" fontWeight="600">{v}</text>
                    </g>
                  ))}
                  {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'].map((w, i) => (
                    <text key={w} x={10 + i * 48} y="152" textAnchor="middle" fill="var(--af-text-muted)" fontSize="10">{w}</text>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          <div className="af-grid-2col" style={{ marginTop: '16px' }}>
            {/* Most used assets */}
            <div className="af-card">
              <div className="af-card-header"><h3>Most Used Assets</h3></div>
              <div className="af-card-body">
                {topAssets.map((a, i) => (
                  <div key={a.tag} className="af-activity-item" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="af-rank-badge">{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>{a.name}</div>
                      <div className="af-activity-meta"><span className="af-tag-chip">{a.tag}</span> · {a.usage} {a.unit}</div>
                    </div>
                    <div className="af-usage-bar">
                      <div className="af-usage-fill" style={{ width: `${(a.usage / 40 * 100)}%` }}></div>
                    </div>
                  </div>
                ))}

                <h4 style={{ fontSize: '13px', margin: '20px 0 10px', color: 'var(--af-text-secondary)' }}>Idle Assets</h4>
                <div className="af-activity-item">
                  <span className="af-tag-chip">AF-0301</span>
                  <span style={{ marginLeft: '8px', fontSize: '13px' }}>Camera — unused 60+ days</span>
                </div>
                <div className="af-activity-item">
                  <span className="af-tag-chip">AF-0410</span>
                  <span style={{ marginLeft: '8px', fontSize: '13px' }}>Chair — unused 45 days</span>
                </div>
              </div>
            </div>

            {/* Heatmap & upcoming */}
            <div className="af-card">
              <div className="af-card-header"><h3>Upcoming Maintenance & Retirement</h3></div>
              <div className="af-card-body">
                <div className="af-activity-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="af-priority-dot" style={{ background: 'var(--af-amber)' }}></span>
                    <span>Forklift AF-0087 — service due in 5 days</span>
                  </div>
                </div>
                <div className="af-activity-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="af-priority-dot" style={{ background: 'var(--af-rose)' }}></span>
                    <span>ThinkPad AF-0020 — 4 years old, nearing retirement</span>
                  </div>
                </div>

                <h4 style={{ fontSize: '13px', margin: '20px 0 10px', color: 'var(--af-text-secondary)' }}>Booking Heatmap — Peak Hours</h4>
                <div className="af-heatmap-grid">
                  {heatData.map((v, i) => (
                    <div key={i} className="af-heatmap-cell" style={{ background: `rgba(139,92,246,${v / 10})` }} title={`${v} bookings at ${8 + i}:00`}>
                      <span className="af-heatmap-val">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="af-hint" style={{ marginTop: '6px' }}>8am → 5pm across shared rooms</div>
              </div>
            </div>
          </div>
        </>
      )}

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
