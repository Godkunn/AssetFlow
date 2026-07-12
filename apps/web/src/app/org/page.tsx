"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orgAPI } from '@/lib/api';
import { useState } from 'react';

export default function OrganizationSetupPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'departments' | 'categories' | 'employees'>('departments');
  const [showModal, setShowModal] = useState(false);

  // Form States
  const [deptForm, setDeptForm] = useState({ name: '', head: '', parentId: '' });
  const [catForm, setCatForm] = useState({ name: '', extra: '' });
  const [empForm, setEmpForm] = useState({ name: '', email: '', departmentId: '', role: 'EMPLOYEE' });

  // Queries
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

  // Mutations
  const addDeptMutation = useMutation({
    mutationFn: orgAPI.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setDeptForm({ name: '', head: '', parentId: '' });
      setShowModal(false);
    }
  });

  const addCategoryMutation = useMutation({
    mutationFn: orgAPI.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setCatForm({ name: '', extra: '' });
      setShowModal(false);
    }
  });

  const addEmployeeMutation = useMutation({
    mutationFn: orgAPI.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setEmpForm({ name: '', email: '', departmentId: '', role: 'EMPLOYEE' });
      setShowModal(false);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'departments') {
      addDeptMutation.mutate({
        name: deptForm.name,
        head: deptForm.head || undefined,
        parentId: deptForm.parentId || undefined
      });
    } else if (activeTab === 'categories') {
      addCategoryMutation.mutate({
        name: catForm.name,
        extra: catForm.extra || undefined
      });
    } else if (activeTab === 'employees') {
      addEmployeeMutation.mutate({
        name: empForm.name,
        email: empForm.email,
        departmentId: empForm.departmentId || undefined,
        role: empForm.role
      });
    }
  };

  return (
    <div className="af-page" style={{ padding: '24px', color: 'var(--af-text)' }}>
      <nav className="af-breadcrumb" style={{ marginBottom: '16px' }}>
        <span className="af-breadcrumb-item">My Account</span>
        <span className="af-breadcrumb-sep">/</span>
        <span className="af-breadcrumb-item active">Organization</span>
      </nav>

      <div className="af-page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="af-page-title" style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Sora, sans-serif' }}>Organization Setup</h1>
          <p className="af-page-subtitle" style={{ color: 'var(--af-text-muted)', fontSize: '14px' }}>Manage departments, categories, and the employee directory</p>
        </div>
      </div>

      {/* Tabs and Actions Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="af-tabs" style={{ margin: 0 }}>
          <button 
            className={`af-tab ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
            Departments
          </button>
          <button 
            className={`af-tab ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            Categories
          </button>
          <button 
            className={`af-tab ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Employee
          </button>
        </div>

        <button className="af-btn af-btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add {activeTab === 'departments' ? 'Department' : activeTab === 'categories' ? 'Category' : 'Employee'}
        </button>
      </div>

      {/* Main Table Card */}
      <div className="af-card" style={{ marginBottom: '24px' }}>
        <div className="af-card-body af-card-body-flush" style={{ overflowX: 'auto' }}>
          {activeTab === 'departments' && (
            <table className="af-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Head</th>
                  <th>Parent Dept</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingDepts ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td><div className="af-skeleton" style={{ width: '130px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '100px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '90px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '70px', height: '22px', borderRadius: '99px' }} /></td>
                    </tr>
                  ))
                ) : departments.length === 0 ? (
                  <tr><td colSpan={4} className="af-empty-state">No departments configured.</td></tr>
                ) : (
                  departments.map((dept: any) => (
                    <tr key={dept.id}>
                      <td><strong>{dept.name}</strong></td>
                      <td>{dept.head || 'Unassigned'}</td>
                      <td>{dept.parent?.name || dept.parentId || '--'}</td>
                      <td>
                        <span className={`af-badge ${dept.status === 'Inactive' ? 'af-badge-inactive' : 'af-badge-active'}`}>
                          {dept.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'categories' && (
            <table className="af-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Code</th>
                  <th>Total Assets</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingCats ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td><div className="af-skeleton" style={{ width: '120px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '60px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '80px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '70px', height: '22px', borderRadius: '99px' }} /></td>
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr><td colSpan={4} className="af-empty-state">No categories configured.</td></tr>
                ) : (
                  categories.map((cat: any) => (
                    <tr key={cat.id}>
                      <td><strong>{cat.name}</strong></td>
                      <td><code>{cat.extra || cat.name.slice(0, 3).toUpperCase()}</code></td>
                      <td>{cat._count?.assets ?? 0}</td>
                      <td><span className="af-badge af-badge-active">Active</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'employees' && (
            <table className="af-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingEmps ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx}>
                      <td><div className="af-skeleton" style={{ width: '130px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '160px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '110px', height: '18px', borderRadius: '4px' }} /></td>
                      <td><div className="af-skeleton" style={{ width: '90px', height: '18px', borderRadius: '4px' }} /></td>
                    </tr>
                  ))
                ) : employees.length === 0 ? (
                  <tr><td colSpan={4} className="af-empty-state">No employees in directory.</td></tr>
                ) : (
                  employees.map((emp: any) => (
                    <tr key={emp.id}>
                      <td><strong>{emp.name}</strong></td>
                      <td>{emp.email}</td>
                      <td>{emp.department?.name || '--'}</td>
                      <td><span className="af-tag-chip" style={{ fontSize: '11px' }}>{emp.role}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>



      {/* Add Modal */}
      {showModal && (
        <div className="af-modal-overlay" onClick={() => setShowModal(false)} style={{ cursor: 'pointer' }}>
          <div className="af-modal" onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
            <div className="af-modal-header">
              <h3 className="af-modal-title">
                Add {activeTab === 'departments' ? 'Department' : activeTab === 'categories' ? 'Category' : 'Employee'}
              </h3>
              <button className="af-modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="af-modal-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {activeTab === 'departments' && (
                  <>
                    <div className="af-field">
                      <label className="af-label">Department Name</label>
                      <input 
                        required 
                        type="text" 
                        className="af-input" 
                        value={deptForm.name} 
                        onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} 
                        placeholder="e.g. Engineering"
                      />
                    </div>
                    <div className="af-field">
                      <label className="af-label">Department Head</label>
                      <input 
                        type="text" 
                        className="af-input" 
                        value={deptForm.head} 
                        onChange={e => setDeptForm({ ...deptForm, head: e.target.value })} 
                        placeholder="e.g. Aditi Rao"
                      />
                    </div>
                    <div className="af-field">
                      <label className="af-label">Parent Department</label>
                      <select 
                        className="af-select"
                        value={deptForm.parentId}
                        onChange={e => setDeptForm({ ...deptForm, parentId: e.target.value })}
                      >
                        <option value="">None</option>
                        {departments.map((d: any) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'categories' && (
                  <>
                    <div className="af-field">
                      <label className="af-label">Category Name</label>
                      <input 
                        required 
                        type="text" 
                        className="af-input" 
                        value={catForm.name} 
                        onChange={e => setCatForm({ ...catForm, name: e.target.value })} 
                        placeholder="e.g. Laptops"
                      />
                    </div>
                    <div className="af-field">
                      <label className="af-label">Category Code</label>
                      <input 
                        type="text" 
                        className="af-input" 
                        value={catForm.extra} 
                        onChange={e => setCatForm({ ...catForm, extra: e.target.value })} 
                        placeholder="e.g. LAP"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'employees' && (
                  <>
                    <div className="af-field">
                      <label className="af-label">Employee Name</label>
                      <input 
                        required 
                        type="text" 
                        className="af-input" 
                        value={empForm.name} 
                        onChange={e => setEmpForm({ ...empForm, name: e.target.value })} 
                        placeholder="e.g. Aarav Sharma"
                      />
                    </div>
                    <div className="af-field">
                      <label className="af-label">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        className="af-input" 
                        value={empForm.email} 
                        onChange={e => setEmpForm({ ...empForm, email: e.target.value })} 
                        placeholder="e.g. aarav@company.com"
                      />
                    </div>
                    <div className="af-field">
                      <label className="af-label">Department</label>
                      <select 
                        className="af-select"
                        value={empForm.departmentId}
                        onChange={e => setEmpForm({ ...empForm, departmentId: e.target.value })}
                      >
                        <option value="">Select Department</option>
                        {departments.map((d: any) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="af-field">
                      <label className="af-label">Role</label>
                      <select 
                        className="af-select"
                        value={empForm.role}
                        onChange={e => setEmpForm({ ...empForm, role: e.target.value })}
                      >
                        <option value="EMPLOYEE">Employee</option>
                        <option value="ASSET_MANAGER">Asset Manager</option>
                        <option value="DEPARTMENT_HEAD">Department Head</option>
                        <option value="TENANT_ADMIN">Tenant Admin</option>
                      </select>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button 
                    type="button" 
                    className="af-btn af-btn-secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="af-btn af-btn-primary"
                    disabled={
                      addDeptMutation.isPending || 
                      addCategoryMutation.isPending || 
                      addEmployeeMutation.isPending
                    }
                  >
                    Save Changes
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
