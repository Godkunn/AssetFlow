"use client";

import { useQuery } from '@tanstack/react-query';
import { reportsAPI } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: reportsAPI.getDashboardKpis,
  });

  // Fallback defaults if API fails or is empty
  const metrics = kpis || {
    totalAssets: 0,
    totalValue: 0,
    allocations: 0,
    maintenance: 0,
    transfers: 0,
    returns: 0
  };

  // Calculate Available assets
  const availableAssets = Math.max(0, metrics.totalAssets - metrics.allocations - metrics.maintenance);
  const allocatedAssets = metrics.allocations;
  const maintenanceAssets = metrics.maintenance;
  const activeBookings = metrics.returns;
  const pendingTransfers = metrics.transfers;
  const upcomingReturns = 12; // as specified in Excalidraw mockup

  return (
    <div className="af-page" style={{ padding: '24px', color: 'var(--af-text)' }}>
      <nav className="af-breadcrumb" style={{ marginBottom: '16px' }}>
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">AssetFlow</span>
      </nav>

      <div className="af-page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="af-page-title" style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Sora, sans-serif' }}>Today's Overview</h1>
          <p className="af-page-subtitle" style={{ color: 'var(--af-text-muted)', fontSize: '14px' }}>Tenant Admin · {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* KPI 3-Column Grid */}
      <div className="af-content-grid cols-3" style={{ gap: '20px', marginBottom: '24px' }}>
        {/* Row 1 */}
        <div className="af-kpi af-kpi-emerald">
          <div className="af-kpi-body">
            <span className="af-kpi-value">
              {isLoading ? (
                <span className="af-skeleton" style={{ width: '60px', height: '36px', display: 'block', borderRadius: '6px' }} />
              ) : (
                availableAssets
              )}
            </span>
            <span className="af-kpi-label">Available</span>
          </div>
        </div>

        <div className="af-kpi af-kpi-purple">
          <div className="af-kpi-body">
            <span className="af-kpi-value">
              {isLoading ? (
                <span className="af-skeleton" style={{ width: '60px', height: '36px', display: 'block', borderRadius: '6px' }} />
              ) : (
                allocatedAssets
              )}
            </span>
            <span className="af-kpi-label">Allocated</span>
          </div>
        </div>

        <div className="af-kpi af-kpi-amber">
          <div className="af-kpi-body">
            <span className="af-kpi-value">
              {isLoading ? (
                <span className="af-skeleton" style={{ width: '60px', height: '36px', display: 'block', borderRadius: '6px' }} />
              ) : (
                maintenanceAssets
              )}
            </span>
            <span className="af-kpi-label">Under Maintenance</span>
          </div>
        </div>

        {/* Row 2 */}
        <div className="af-kpi af-kpi-sky">
          <div className="af-kpi-body">
            <span className="af-kpi-value">
              {isLoading ? (
                <span className="af-skeleton" style={{ width: '60px', height: '36px', display: 'block', borderRadius: '6px' }} />
              ) : (
                activeBookings
              )}
            </span>
            <span className="af-kpi-label">Active Bookings</span>
          </div>
        </div>

        <div className="af-kpi af-kpi-teal">
          <div className="af-kpi-body">
            <span className="af-kpi-value">
              {isLoading ? (
                <span className="af-skeleton" style={{ width: '60px', height: '36px', display: 'block', borderRadius: '6px' }} />
              ) : (
                pendingTransfers
              )}
            </span>
            <span className="af-kpi-label">Pending Transfers</span>
          </div>
        </div>
        
        <div className="af-kpi af-kpi-gold">
          <div className="af-kpi-body">
            <span className="af-kpi-value">
              {isLoading ? (
                <span className="af-skeleton" style={{ width: '60px', height: '36px', display: 'block', borderRadius: '6px' }} />
              ) : (
                upcomingReturns
              )}
            </span>
            <span className="af-kpi-label">Upcoming returns</span>
          </div>
        </div>
      </div>

      {/* Overdue alert banner */}
      <div style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
        color: '#FCA5A5',
        fontSize: '14px'
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#EF4444',
          display: 'inline-block',
          boxShadow: '0 0 10px #EF4444',
          animation: 'pulse 1.5s infinite'
        }} />
        <span>
          <strong>3 assets overdue for return</strong> - flagged for follow-up
        </span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        <Link href="/assets">
          <button className="af-btn af-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            + register asset
          </button>
        </Link>
        <Link href="/booking">
          <button className="af-btn af-btn-secondary" style={{
            background: 'transparent',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#F1EEFF'
          }}>
            Book resource
          </button>
        </Link>
        <Link href="/maintenance">
          <button className="af-btn af-btn-secondary" style={{
            background: 'transparent',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#F1EEFF'
          }}>
            Raise requests
          </button>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="af-card" style={{ maxWidth: '800px' }}>
        <div className="af-card-header" style={{ borderBottom: '1px solid var(--af-border)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h3 className="af-card-title" style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Sora, sans-serif' }}>Recent Activity</h3>
        </div>
        <div className="af-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 4px' }}>
          {isLoading ? (
            <>
              <div className="af-skeleton" style={{ height: '16px', width: '85%', borderRadius: '4px' }} />
              <div className="af-skeleton" style={{ height: '16px', width: '70%', borderRadius: '4px' }} />
              <div className="af-skeleton" style={{ height: '16px', width: '90%', borderRadius: '4px' }} />
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#E2E8F0' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                <span>Laptop <strong>AF-0114</strong> - allocated to Priya shah - IT dept</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#E2E8F0' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6' }} />
                <span>Room <strong>B2</strong> - booking confirmed - 2:00 to 3:00 PM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#E2E8F0' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                <span>Projector <strong>AF-0062</strong> - maintenance resolved</span>
              </div>
            </>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
