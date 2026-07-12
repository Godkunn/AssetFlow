"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditAPI } from '@/lib/api';
import { useState } from 'react';

export default function AuditPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [newAudit, setNewAudit] = useState({ name: '', auditors: ['admin'] });
  const [selectedCycle, setSelectedCycle] = useState<any>(null);

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['audits'],
    queryFn: auditAPI.getAuditCycles,
  });

  const createMutation = useMutation({
    mutationFn: auditAPI.createAuditCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      setShowModal(false);
      setNewAudit({ name: '', auditors: ['admin'] });
    }
  });

  const verifyMutation = useMutation({
    mutationFn: ({ itemId, verdict }: { itemId: string; verdict: string }) => auditAPI.verifyAuditItem(itemId, verdict),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
    }
  });

  const closeMutation = useMutation({
    mutationFn: auditAPI.closeAuditCycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audits'] });
      setSelectedCycle(null);
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newAudit);
  };

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Audit</span>
      </nav>

      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Asset Audit & Compliance</h1>
          <p className="af-page-subtitle">Verify physical asset locations and conditions.</p>
        </div>
        <button className="af-btn af-btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Start Audit Cycle
        </button>
      </div>

      <div className="af-grid-2col">
        {/* Audit Cycles List */}
        <div className="af-card">
          <div className="af-card-header">
            <h3>Audit Cycles</h3>
          </div>
          <div className="af-card-body">
            {isLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="af-skeleton" style={{ height: '48px', borderRadius: '8px' }} />
                <div className="af-skeleton" style={{ height: '48px', borderRadius: '8px' }} />
                <div className="af-skeleton" style={{ height: '48px', borderRadius: '8px' }} />
              </div>
            ) : audits.length === 0 ? (
              <div className="af-empty-state">
                <p>No audit cycles created yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {audits.map((a: any) => (
                  <div 
                    key={a.id} 
                    className="af-activity-item" 
                    style={{ 
                      cursor: 'pointer',
                      border: selectedCycle?.id === a.id ? '1px solid var(--af-primary)' : '1px solid transparent',
                      padding: '12px',
                      borderRadius: 'var(--af-radius-md)',
                      backgroundColor: selectedCycle?.id === a.id ? 'var(--af-primary-light)' : 'transparent'
                    }}
                    onClick={() => setSelectedCycle(a)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{a.name}</div>
                        <div className="af-activity-meta">Items: {a.items?.length || 0}</div>
                      </div>
                      <span className={`af-badge ${a.closed ? 'af-badge-cancelled' : 'af-badge-approved'}`}>
                        {a.closed ? 'Closed' : 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Audit Details */}
        {selectedCycle ? (
          <div className="af-card">
            <div className="af-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ marginBottom: '4px' }}>{selectedCycle.name}</h3>
                <div className="af-text-muted af-text-sm">Audit Items</div>
              </div>
              {!selectedCycle.closed && (
                <button className="af-btn af-btn-danger af-btn-sm" onClick={() => closeMutation.mutate(selectedCycle.id)} disabled={closeMutation.isPending}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                  {closeMutation.isPending ? 'Closing...' : 'Close Cycle'}
                </button>
              )}
            </div>
            
            <div className="af-card-body af-card-body-flush" style={{ overflowX: 'auto' }}>
              <table className="af-table">
                <thead>
                  <tr>
                    <th>Asset Tag</th>
                    <th>Expected Location</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCycle.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td><span className="af-tag-chip">{item.asset?.tag}</span></td>
                      <td>{item.expected}</td>
                      <td>
                        {selectedCycle.closed ? (
                          <span className={`af-badge ${item.verdict === 'Verified' ? 'af-badge-approved' : item.verdict === 'Missing' ? 'af-badge-cancelled' : 'af-badge-warning'}`}>
                            {item.verdict}
                          </span>
                        ) : (
                          <div className="af-verdict-group">
                            <button 
                              className={`af-btn af-btn-sm ${item.verdict === 'Verified' ? 'af-btn-success' : 'af-btn-ghost'}`}
                              onClick={() => verifyMutation.mutate({ itemId: item.id, verdict: 'Verified' })}
                            >
                              Verified
                            </button>
                            <button 
                              className={`af-btn af-btn-sm ${item.verdict === 'Missing' ? 'af-btn-danger' : 'af-btn-ghost'}`}
                              onClick={() => verifyMutation.mutate({ itemId: item.id, verdict: 'Missing' })}
                            >
                              Missing
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!selectedCycle.items || selectedCycle.items.length === 0) && (
                    <tr><td colSpan={3} className="af-empty-state">No items in this audit.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="af-empty-state" style={{ height: '100%' }}>
            Select an audit cycle to view details.
          </div>
        )}
      </div>

      {showModal && (
        <div className="af-modal-overlay" onClick={() => setShowModal(false)} style={{ cursor: 'pointer' }}>
          <div className="af-modal" onClick={e => e.stopPropagation()} style={{ cursor: 'default' }}>
            <div className="af-modal-header">
              <h3 className="af-modal-title">Start New Audit Cycle</h3>
              <button className="af-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="af-modal-body">
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="af-field">
                  <label className="af-label">Cycle Name</label>
                  <input required type="text" className="af-input" value={newAudit.name} onChange={e => setNewAudit({...newAudit, name: e.target.value})} placeholder="e.g. Q3 Global Audit" />
                </div>
                <div className="af-modal-footer">
                  <button type="button" className="af-btn af-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="af-btn af-btn-primary" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Starting...' : 'Start Audit'}
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
