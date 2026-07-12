"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingAPI, assetsAPI, orgAPI } from '@/lib/api';
import { useState } from 'react';

export default function BookingPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [newBooking, setNewBooking] = useState({ assetId: '', userId: '', startTime: '', endTime: '' });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingAPI.getBookings,
  });

  const { data: sharedAssets = [] } = useQuery({
    queryKey: ['assets', 'All'],
    queryFn: () => assetsAPI.getAssets('All Assets'),
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: orgAPI.getEmployees,
  });

  const bookMutation = useMutation({
    mutationFn: bookingAPI.createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      setShowModal(false);
      setNewBooking({ assetId: '', userId: '', startTime: '', endTime: '' });
    }
  });

  const cancelMutation = useMutation({
    mutationFn: bookingAPI.cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    bookMutation.mutate(newBooking);
  };

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Booking</span>
      </nav>

      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Resource Booking</h1>
          <p className="af-page-subtitle">Schedule time slots for shared equipment and vehicles.</p>
        </div>
        <button className="af-btn af-btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          New Booking
        </button>
      </div>

      <div className="af-card">
        <div className="af-card-body af-card-body-flush">
          <table className="af-table af-table-hover">
            <thead>
              <tr>
                <th>Asset</th>
                <th>User</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx}>
                    <td><div className="af-skeleton" style={{ width: '130px', height: '18px', borderRadius: '4px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '100px', height: '18px', borderRadius: '4px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '140px', height: '18px', borderRadius: '4px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '140px', height: '18px', borderRadius: '4px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '80px', height: '22px', borderRadius: '99px' }} /></td>
                    <td><div className="af-skeleton" style={{ width: '50px', height: '22px', borderRadius: '4px' }} /></td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} className="af-empty-state">No bookings found.</td></tr>
              ) : bookings.map((b: any) => (
                <tr key={b.id}>
                  <td><strong>{b.asset?.name}</strong> <span className="af-tag-chip" style={{ marginLeft: '8px' }}>{b.asset?.tag}</span></td>
                  <td>{b.user?.name || b.user?.email}</td>
                  <td>{new Date(b.startTime).toLocaleString()}</td>
                  <td>{new Date(b.endTime).toLocaleString()}</td>
                  <td><span className={`af-badge ${b.status === 'Cancelled' ? 'af-badge-cancelled' : 'af-badge-upcoming'}`}>{b.status}</span></td>
                  <td>
                    {b.status !== 'Cancelled' && (
                      <button className="af-btn af-btn-sm af-btn-danger" onClick={() => cancelMutation.mutate(b.id)} disabled={cancelMutation.isPending}>
                        Cancel
                      </button>
                    )}
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
              <h3 className="af-modal-title">Schedule Booking</h3>
              <button className="af-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="af-modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="af-field">
                  <label className="af-label">Select Asset</label>
                  <select required className="af-select" value={newBooking.assetId} onChange={e => setNewBooking({...newBooking, assetId: e.target.value})}>
                    <option value="">-- Available Assets --</option>
                    {sharedAssets.map((a: any) => <option key={a.id} value={a.id}>{a.tag} - {a.name}</option>)}
                  </select>
                </div>
                <div className="af-field">
                  <label className="af-label">Employee</label>
                  <select required className="af-select" value={newBooking.userId} onChange={e => setNewBooking({...newBooking, userId: e.target.value})}>
                    <option value="">-- Select Employee --</option>
                    {employees.map((u: any) => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
                  </select>
                </div>
                <div className="af-field">
                  <label className="af-label">Start Time</label>
                  <input required type="datetime-local" className="af-input" value={newBooking.startTime} onChange={e => setNewBooking({...newBooking, startTime: e.target.value})} />
                </div>
                <div className="af-field">
                  <label className="af-label">End Time</label>
                  <input required type="datetime-local" className="af-input" value={newBooking.endTime} onChange={e => setNewBooking({...newBooking, endTime: e.target.value})} />
                </div>
                <div className="af-modal-footer">
                  <button type="button" className="af-btn af-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="af-btn af-btn-primary" disabled={bookMutation.isPending}>
                    {bookMutation.isPending ? 'Saving...' : 'Book Asset'}
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
