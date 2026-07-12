"use client";

import { useQuery } from '@tanstack/react-query';
import { orgAPI } from '@/lib/api';
import { useState } from 'react';

export default function NotificationsPage() {
  const [filter, setFilter] = useState('All');
  
  // Use users to simulate actors in the system ledger
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: orgAPI.getEmployees,
  });

  // Mock notifications state since we don't have a notifications API
  const [notifications, setNotifications] = useState([
    { id: '1', type: 'Alerts', text: 'Low stock warning: Laptops (3 remaining)', time: '10 mins ago', read: false },
    { id: '2', type: 'Approvals', text: 'Pending approval for maintenance: AF-0087', time: '1 hour ago', read: false },
    { id: '3', type: 'Bookings', text: 'New booking: Projector by John Doe', time: '2 hours ago', read: true },
    { id: '4', type: 'Alerts', text: 'Missing asset reported: iPad Pro', time: '1 day ago', read: true },
  ]);

  // Mock activity log
  const systemLog = [
    { id: 'l1', time: '10:45 AM', actor: 'System', action: 'flagged low stock', target: 'Laptops' },
    { id: 'l2', time: '09:30 AM', actor: 'Alice Manager', action: 'approved maintenance', target: 'Ticket #4321' },
    { id: 'l3', time: 'Yesterday', actor: 'John Doe', action: 'booked', target: 'Projector' },
    { id: 'l4', time: 'Yesterday', actor: 'Jane Admin', action: 'added asset', target: 'iPad Pro' },
  ];

  const filtered = filter === 'All' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const tabs = ['All', 'Alerts', 'Approvals', 'Bookings'];
  const tabCounts = {
    All: notifications.length,
    Alerts: notifications.filter(n => n.type === 'Alerts').length,
    Approvals: notifications.filter(n => n.type === 'Approvals').length,
    Bookings: notifications.filter(n => n.type === 'Bookings').length,
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Notifications</span>
      </nav>
      
      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Notifications &amp; Activity Log</h1>
          <p className="af-page-subtitle">Every role stays informed without digging for updates.</p>
        </div>
        {unreadCount > 0 && (
          <button className="af-btn af-btn-ghost" onClick={markAllRead}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      <div className="af-tabs">
        {tabs.map(t => (
          <button 
            key={t}
            className={`af-tab ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
          >
            {t}
            <span className="af-tab-count">{(tabCounts as any)[t]}</span>
          </button>
        ))}
      </div>

      <div className="af-grid-2col">
        {/* Notification center */}
        <div className="af-card">
          <div className="af-card-header">
            <h3>Notification Center</h3>
          </div>
          <div className="af-card-body">
            {filtered.length > 0 ? filtered.map(n => (
              <div 
                key={n.id} 
                className={`af-notification-item ${!n.read ? 'af-notification-unread' : ''}`}
                onClick={() => !n.read && markAsRead(n.id)}
                style={{ cursor: !n.read ? 'pointer' : 'default' }}
              >
                <div className="af-notification-dot-wrap">
                  {!n.read ? <span className="af-notification-dot"></span> : <span className="af-notification-dot-empty"></span>}
                </div>
                <div className="af-notification-content">
                  <div className="af-notification-text">{n.text}</div>
                  <div className="af-notification-meta">
                    <span>{n.time}</span>
                    <span className={`af-badge ${n.type === 'Alerts' ? 'af-badge-cancelled' : n.type === 'Approvals' ? 'af-badge-approved' : 'af-badge-reserved'}`}>{n.type}</span>
                  </div>
                </div>
                {!n.read && (
                  <button 
                    className="af-btn af-btn-ghost af-btn-sm" 
                    onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                    title="Mark as read"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  </button>
                )}
              </div>
            )) : (
              <div className="af-empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--af-text-muted)" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p>No notifications in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity ledger */}
        <div className="af-card">
          <div className="af-card-header">
            <h3>System Activity Ledger</h3>
          </div>
          <div className="af-card-body">
            {systemLog.length > 0 ? systemLog.map(l => (
              <div key={l.id} className="af-ledger-item">
                <div className="af-ledger-time">{l.time}</div>
                <div className="af-ledger-content">
                  <span className="af-ledger-actor">{l.actor}</span>
                  <span className="af-ledger-action" style={{ margin: '0 4px', color: 'var(--af-text-muted)' }}>{l.action}</span>
                  <span className="af-ledger-target" style={{ fontWeight: 500 }}>{l.target}</span>
                </div>
              </div>
            )) : (
              <div className="af-empty-state">No activity recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
