"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsAPI, orgAPI } from '@/lib/api';
import { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface Allocation {
  user?: {
    name?: string;
    email?: string;
  };
}

interface Asset {
  id: string;
  tag: string;
  name: string;
  status: 'AVAILABLE' | 'ALLOCATED' | 'MAINTENANCE' | string;
  category?: Category;
  allocations?: Allocation[];
}

export default function AssetsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('All Assets');
  
  // Add Asset Modal State
  const [showModal, setShowModal] = useState(false);
  const [newAsset, setNewAsset] = useState({ tag: '', name: '', categoryId: '', cost: 0 });

  const { data: assets = [], isLoading } = useQuery<Asset[]>({
    queryKey: ['assets', filter],
    queryFn: () => assetsAPI.getAssets(filter),
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: orgAPI.getCategories,
  });

  const addAssetMutation = useMutation({
    mutationFn: assetsAPI.createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
      setShowModal(false);
      setNewAsset({ tag: '', name: '', categoryId: '', cost: 0 });
    }
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAssetMutation.mutate({
      ...newAsset,
      cost: parseFloat(newAsset.cost.toString()),
    });
  };

  const getStatusClass = (status: string) => {
    if (status === 'AVAILABLE') return 'status-available';
    if (status === 'ALLOCATED') return 'status-allocated';
    if (status === 'MAINTENANCE') return 'status-maintenance';
    return '';
  };

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Assets</span>
      </nav>

      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Asset Registry</h1>
          <p className="af-page-subtitle">{assets.length} assets</p>
        </div>
        <button className="af-btn af-btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Register Asset
        </button>
      </div>

      <div className="af-filter-bar">
        <div className="af-filter-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="af-filter-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" className="af-input af-input-search" placeholder="Search by tag, name, or holder…" />
        </div>
        <select className="af-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="All Assets">All Assets</option>
          <option value="Available">Available</option>
          <option value="Allocated">Allocated</option>
          <option value="Maintenance">Maintenance</option>
        </select>
        <span className="af-filter-count">{assets.length} results</span>
      </div>

      <div className="af-card">
        <div className="af-card-body af-card-body-flush">
          <table className="af-table af-table-hover">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Name / Model</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td><div className="af-skeleton" style={{ width: '65px', height: '22px', borderRadius: '4px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '160px', height: '18px', borderRadius: '4px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '90px', height: '18px', borderRadius: '4px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '80px', height: '22px', borderRadius: '99px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '120px', height: '18px', borderRadius: '4px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '50px', height: '18px', borderRadius: '4px' }} /></td>
                  </tr>
                ))
              ) : assets.length === 0 ? (
                <tr><td colSpan={6} className="af-empty-state">No assets match your filters.</td></tr>
              ) : (
                assets.map((asset) => {
                  const activeAllocation = asset.allocations?.[0];

                  return (
                    <tr key={asset.id} className="af-row-clickable">
                      <td>
                        <span className="af-tag-chip">{asset.tag}</span>
                      </td>

                      <td>
                        <strong>{asset.name}</strong>
                      </td>

                      <td>{asset.category?.name || 'Uncategorized'}</td>

                      <td>
                        <span className={`af-badge ${getStatusClass(asset.status)}`}>
                          {asset.status}
                        </span>
                      </td>

                      <td>
                        {asset.status === 'ALLOCATED' && activeAllocation ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="af-avatar af-avatar-xs">
                              {activeAllocation.user?.name?.charAt(0) || 'U'}
                            </span>
                            <span>
                              {activeAllocation.user?.name || activeAllocation.user?.email}
                            </span>
                          </div>
                        ) : (
                          <span className="af-text-muted">—</span>
                        )}
                      </td>

                      <td>
                        <button className="af-btn af-btn-ghost af-btn-sm" title="View details">
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showModal && (
        <div className="af-modal-overlay">
          <div className="af-modal">
            <div className="af-modal-header">
              <h3 className="af-modal-title">Register Asset</h3>
              <button className="af-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="af-modal-body">
              <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="af-field">
                  <label className="af-label">Asset Tag (e.g. LPT-001)</label>
                  <input required type="text" className="af-input" value={newAsset.tag} onChange={e => setNewAsset({...newAsset, tag: e.target.value})} />
                </div>
                <div className="af-field">
                  <label className="af-label">Name / Model</label>
                  <input required type="text" className="af-input" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} />
                </div>
                <div className="af-field">
                  <label className="af-label">Category</label>
                  <select className="af-select" value={newAsset.categoryId} onChange={e => setNewAsset({...newAsset, categoryId: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="af-field">
                  <label className="af-label">Cost ($)</label>
                  <input required type="number" className="af-input" value={newAsset.cost} onChange={e => setNewAsset({...newAsset, cost: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="af-modal-footer">
                  <button type="button" className="af-btn af-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="af-btn af-btn-primary" disabled={addAssetMutation.isPending}>
                    {addAssetMutation.isPending ? 'Saving...' : 'Register Asset'}
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