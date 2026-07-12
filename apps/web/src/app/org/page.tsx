"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orgAPI } from '@/lib/api';
import { useState } from 'react';

export default function OrganizationSetupPage() {
  const queryClient = useQueryClient();
  const [newDeptName, setNewDeptName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const { data: departments = [], isLoading: isLoadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: orgAPI.getDepartments,
  });

  const { data: categories = [], isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: orgAPI.getCategories,
  });

  const { data: employees = [], isLoading: isLoadingEmps } = useQuery({
    queryKey: ['employees'],
    queryFn: orgAPI.getEmployees,
  });

  const addDeptMutation = useMutation({
    mutationFn: orgAPI.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setNewDeptName('');
    }
  });

  const addCategoryMutation = useMutation({
    mutationFn: orgAPI.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategoryName('');
    }
  });

  return (
    <div className="af-page">
      <nav className="af-breadcrumb">
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Organization</span>
      </nav>

      <div className="af-page-header">
        <div>
          <h1 className="af-page-title">Organization Setup</h1>
          <p className="af-page-subtitle">Manage departments, categories, and the employee directory</p>
        </div>
        <button className="af-btn af-btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Department
        </button>
      </div>

      <div className="af-tabs">
        <button className="af-tab active">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
          Departments
        </button>
        <button className="af-tab">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Categories
        </button>
        <button className="af-tab">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Employee Directory
        </button>
      </div>

      <div className="af-card">
        <div className="af-card-body af-card-body-flush">
          <table className="af-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Head</th>
                <th>Parent Dept</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingDepts ? (
                <tr><td colSpan={4} className="af-empty-state">Loading departments...</td></tr>
              ) : departments.length === 0 ? (
                <tr><td colSpan={4} className="af-empty-state">No departments yet.</td></tr>
              ) : (
                departments.map((dept: any) => (
                  <tr key={dept.id}>
                    <td><strong>{dept.name}</strong></td>
                    <td>{dept.head || 'Unassigned'}</td>
                    <td>{dept.parent || '-'}</td>
                    <td><span className="af-badge af-badge-active">Active</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Temporary input form for testing mutation functionality */}
      <div className="af-card" style={{ marginTop: '20px' }}>
         <div className="af-card-header">
            <h3 className="af-card-title">Quick Add (Dev)</h3>
         </div>
         <div className="af-card-body">
            <div className="af-field-row">
              <div className="af-field">
                <label className="af-label">New Department</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="New Department..." 
                    value={newDeptName}
                    onChange={e => setNewDeptName(e.target.value)}
                    className="af-input"
                  />
                  <button 
                    className="af-btn af-btn-primary" 
                    onClick={() => newDeptName && addDeptMutation.mutate({ name: newDeptName })}
                    disabled={addDeptMutation.isPending}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
