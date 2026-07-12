"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { allocationsAPI, transfersAPI, assetsAPI, orgAPI } from '@/lib/api';
import { useState } from 'react';

export default function AllocationPage() {
  const queryClient = useQueryClient();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newAllocation, setNewAllocation] = useState({ assetId: '', userId: '', notes: '' });

  const { data: allocations = [], isLoading: isLoadingAlloc } = useQuery({
    queryKey: ['allocations'],
    queryFn: allocationsAPI.getAllocations,
  });

  const { data: transfers = [], isLoading: isLoadingTrans } = useQuery({
    queryKey: ['transfers'],
    queryFn: transfersAPI.getTransfers,
  });

  const { data: availableAssets = [] } = useQuery({
    queryKey: ['assets', 'Available'],
    queryFn: () => assetsAPI.getAssets('Available'),
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: orgAPI.getEmployees,
  });

  const assignMutation = useMutation({
    mutationFn: allocationsAPI.createAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
      setShowAssignModal(false);
      setNewAllocation({ assetId: '', userId: '', notes: '' });
    }
  });

  const returnMutation = useMutation({
    mutationFn: allocationsAPI.returnAllocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    }
  });

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignMutation.mutate(newAllocation);
  };

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Allocation</span>
      </nav>

      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Allocation &amp; Transfer</h1>
          <p className="af-page-subtitle">Assign assets, manage transfers, and process returns</p>
        </div>
      </div>

      <div className="af-grid-2col">
        {/* Left: Allocate an Asset */}
        <div className="af-card">
          <div className="af-card-header">
            <h3 className="af-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              </svg>
              Allocate an Asset
            </h3>
          </div>
          <div className="af-card-body">
            <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="af-field">
                <label className="af-label">Select Asset</label>
                <select required className="af-select" value={newAllocation.assetId} onChange={e => setNewAllocation({...newAllocation, assetId: e.target.value})}>
                  <option value="">-- Available Assets --</option>
                  {availableAssets.map((a: any) => <option key={a.id} value={a.id}>{a.tag} - {a.name}</option>)}
                </select>
              </div>
              <div className="af-field">
                <label className="af-label">Assign To Employee</label>
                <select required className="af-select" value={newAllocation.userId} onChange={e => setNewAllocation({...newAllocation, userId: e.target.value})}>
                  <option value="">-- Select Employee --</option>
                  {employees.map((u: any) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                </select>
              </div>
              <div className="af-field">
                <label className="af-label">Notes (Optional)</label>
                <input type="text" className="af-input" value={newAllocation.notes} onChange={e => setNewAllocation({...newAllocation, notes: e.target.value})} placeholder="Reason or condition..." />
              </div>
              <button type="submit" className="af-btn af-btn-primary" disabled={assignMutation.isPending}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
                  <polyline points="17 11 19 13 23 9"/>
                </svg>
                {assignMutation.isPending ? 'Assigning...' : 'Allocate Asset'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Active Allocations */}
          <div className="af-card">
            <div className="af-card-header">
              <h3 className="af-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Active Allocations (Return)
              </h3>
            </div>
            <div className="af-card-body af-card-body-flush">
              {isLoadingAlloc ? (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="af-skeleton" style={{ height: '36px', borderRadius: '6px' }} />
                  <div className="af-skeleton" style={{ height: '36px', borderRadius: '6px' }} />
                  <div className="af-skeleton" style={{ height: '36px', borderRadius: '6px' }} />
                </div>
              ) : allocations.length === 0 ? (
                <p className="af-empty-state">No active allocations.</p>
              ) : (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {allocations.map((alloc: any) => (
                    <div key={alloc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--af-border)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                          <span className="af-tag-chip" style={{ marginRight: '8px' }}>{alloc.asset?.tag}</span>
                          {alloc.asset?.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--af-text-muted)' }}>
                          Held by: {alloc.user?.name || alloc.user?.email}
                        </div>
                      </div>
                      <button 
                        className="af-btn af-btn-sm af-btn-secondary"
                        onClick={() => returnMutation.mutate(alloc.id)}
                        disabled={returnMutation.isPending}
                      >
                        Return
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Transfer Requests */}
          <div className="af-card">
            <div className="af-card-header">
              <h3 className="af-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                  <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>
                Transfer Requests
              </h3>
              <span className="af-badge af-badge-pending">{transfers.filter((t:any) => t.status==='Pending').length} Pending</span>
            </div>
            <div className="af-card-body af-card-body-flush">
              {isLoadingTrans ? (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="af-skeleton" style={{ height: '70px', borderRadius: '8px' }} />
                  <div className="af-skeleton" style={{ height: '70px', borderRadius: '8px' }} />
                </div>
              ) : transfers.length === 0 ? (
                <p className="af-empty-state">No transfer requests.</p>
              ) : (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {transfers.map((tr: any) => (
                    <div key={tr.id} style={{ border: '1px solid var(--af-border)', borderRadius: 'var(--af-radius-md)', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div><strong>{tr.asset?.name}</strong> <span className="af-tag-chip" style={{ marginLeft: '8px' }}>{tr.asset?.tag}</span></div>
                        <span className={`af-badge ${tr.status === 'Pending' ? 'af-badge-pending' : 'af-badge-approved'}`}>{tr.status}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--af-text-secondary)', marginBottom: '12px' }}>
                        <span>{tr.from}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                        <span>{tr.to}</span>
                      </div>
                      {tr.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="af-btn af-btn-sm af-btn-ghost">Reject</button>
                          <button className="af-btn af-btn-sm af-btn-primary">Approve</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
