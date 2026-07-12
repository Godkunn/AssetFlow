"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceAPI, assetsAPI } from '@/lib/api';
import { useState } from 'react';

export default function MaintenancePage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({ assetId: '', issue: '', priority: 'Medium' });

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceAPI.getTickets,
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['assets', 'All'],
    queryFn: () => assetsAPI.getAssets('All Assets'),
  });

  const createMutation = useMutation({
    mutationFn: maintenanceAPI.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
      setShowModal(false);
      setNewTicket({ assetId: '', issue: '', priority: 'Medium' });
    }
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) => maintenanceAPI.updateTicketStage(id, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newTicket);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#f87171';
      case 'Critical': return '#ef4444';
      case 'Low': return '#4ade80';
      default: return '#fbbf24';
    }
  };

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Maintenance</span>
      </nav>

      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Maintenance Logs</h1>
          <p className="af-page-subtitle">Track and manage asset maintenance tickets.</p>
        </div>
        <button className="af-btn af-btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Report Issue
        </button>
      </div>

      <div className="af-card">
        <div className="af-card-body af-card-body-flush">
          <table className="af-table af-table-hover">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Asset</th>
                <th>Issue</th>
                <th>Priority</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="af-empty-state">Loading...</td></tr> : tickets.length === 0 ? (
                <tr><td colSpan={6} className="af-empty-state">No maintenance tickets.</td></tr>
              ) : tickets.map((t: any) => (
                <tr key={t.id}>
                  <td><span className="af-text-mono af-text-muted">{t.id.substring(0, 8).toUpperCase()}</span></td>
                  <td><strong>{t.asset?.name}</strong> <span className="af-tag-chip" style={{ marginLeft: '8px' }}>{t.asset?.tag}</span></td>
                  <td>{t.issue}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="af-priority-dot" style={{ background: getPriorityColor(t.priority) }}></span>
                      <span style={{ fontWeight: 600 }}>{t.priority}</span>
                    </div>
                  </td>
                  <td>
                    <select 
                      className="af-select" 
                      value={t.stage} 
                      onChange={e => updateStageMutation.mutate({ id: t.id, stage: e.target.value })}
                      disabled={updateStageMutation.isPending}
                      style={{ padding: '6px 12px', height: 'auto', minHeight: '32px' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td>
                    <button className="af-btn af-btn-sm af-btn-ghost">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="af-modal-overlay" onClick={() => setShowModal(false)} style={{ cursor: 'pointer' }}>
          <div className="af-modal" onClick={e => e.stopPropagation()} style={{ cursor: 'default' }}>
            <div className="af-modal-header">
              <h3 className="af-modal-title">Report Maintenance Issue</h3>
              <button className="af-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="af-modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="af-field">
                  <label className="af-label">Select Asset</label>
                  <select required className="af-select" value={newTicket.assetId} onChange={e => setNewTicket({...newTicket, assetId: e.target.value})}>
                    <option value="">-- All Assets --</option>
                    {assets.map((a: any) => <option key={a.id} value={a.id}>{a.tag} - {a.name}</option>)}
                  </select>
                </div>
                <div className="af-field">
                  <label className="af-label">Issue Description</label>
                  <input required type="text" className="af-input" value={newTicket.issue} onChange={e => setNewTicket({...newTicket, issue: e.target.value})} placeholder="Describe the problem..." />
                </div>
                <div className="af-field">
                  <label className="af-label">Priority</label>
                  <select required className="af-select" value={newTicket.priority} onChange={e => setNewTicket({...newTicket, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="af-modal-footer">
                  <button type="button" className="af-btn af-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="af-btn af-btn-primary" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
