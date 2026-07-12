/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Organization Screen (Admin Only)
   ═══════════════════════════════════════════════════════════════════ */

let orgTab = 'dept';

AF.ScreenOrganization = {

  render() {
    const s = AF.state;

    /* ── Access control ───────────────────────────────────────── */
    if (s.session.role !== 'Admin') {
      return `
      <div class="af-page">
        <div class="af-access-denied">
          <div class="af-access-denied-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2>Access Restricted</h2>
          <p>Organization settings are available to Administrators only. Contact your admin for access.</p>
          <button class="af-btn af-btn-primary" id="backToDash">Back to Dashboard</button>
        </div>
      </div>`;
    }

    /* ── Determine button label ───────────────────────────────── */
    const addLabels = {
      dept: 'Add Department',
      cat:  'Add Category',
      emp:  'Add Employee'
    };

    /* ── Dept table ───────────────────────────────────────────── */
    const deptTable = `
      <table class="af-table">
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Head</th>
            <th>Parent Dept</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${s.departments.map(d => `
            <tr>
              <td><strong>${d.name}</strong></td>
              <td>${d.head}</td>
              <td>${d.parent}</td>
              <td><span class="${AF.badgeClass(d.status)}">${d.status}</span></td>
            </tr>
          `).join('')}
          ${s.departments.length === 0 ? '<tr><td colspan="4" class="af-empty-state">No departments yet.</td></tr>' : ''}
        </tbody>
      </table>`;

    /* ── Category table ───────────────────────────────────────── */
    const catTable = `
      <table class="af-table">
        <thead>
          <tr>
            <th>Category Name</th>
            <th>Asset Count</th>
            <th>Custom Field</th>
          </tr>
        </thead>
        <tbody>
          ${s.categories.map(c => {
            const count = s.assets.filter(a => a.category === c.name).length;
            return `
            <tr>
              <td><strong>${c.name}</strong></td>
              <td>${count}</td>
              <td>${c.extra}</td>
            </tr>`;
          }).join('')}
          ${s.categories.length === 0 ? '<tr><td colspan="3" class="af-empty-state">No categories yet.</td></tr>' : ''}
        </tbody>
      </table>`;

    /* ── Employee table ───────────────────────────────────────── */
    const roleOrder = ['Employee', 'Department Head', 'Asset Manager', 'Admin'];
    const empTable = `
      <table class="af-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${s.employees.map(emp => {
            const roleIdx = roleOrder.indexOf(emp.role);
            const canPromote = roleIdx < roleOrder.length - 1;
            const canDemote = roleIdx > 0;
            return `
            <tr>
              <td>
                <div class="af-cell-with-avatar">
                  <span class="af-avatar af-avatar-xs">${AF.initials(emp.name)}</span>
                  <strong>${emp.name}</strong>
                </div>
              </td>
              <td><code class="af-mono">${emp.email}</code></td>
              <td>${emp.dept}</td>
              <td><span class="${AF.badgeClass(emp.role)}">${emp.role}</span></td>
              <td><span class="${AF.badgeClass(emp.status)}">${emp.status}</span></td>
              <td>
                <div class="af-btn-group">
                  ${canPromote ? `<button class="af-btn af-btn-xs af-btn-outline" data-promote="${emp.id}" title="Promote to ${roleOrder[roleIdx + 1]}">▲ Promote</button>` : ''}
                  ${canDemote ? `<button class="af-btn af-btn-xs af-btn-ghost" data-demote="${emp.id}" title="Demote to ${roleOrder[roleIdx - 1]}">▼ Demote</button>` : ''}
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>`;

    /* ── Active table content ─────────────────────────────────── */
    const tableContent = orgTab === 'dept' ? deptTable
      : orgTab === 'cat' ? catTable
      : empTable;

    return `
    <div class="af-page">
      <nav class="af-breadcrumb">
        <span class="af-breadcrumb-item">My Account</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item active">Organization</span>
      </nav>

      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">Organization Setup</h1>
          <p class="af-page-subtitle">Manage departments, categories, and the employee directory</p>
        </div>
        <button class="af-btn af-btn-primary" id="orgAddBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          ${addLabels[orgTab]}
        </button>
      </div>

      <div class="af-tabs">
        <button class="af-tab ${orgTab === 'dept' ? 'active' : ''}" data-org-tab="dept">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
          Departments
        </button>
        <button class="af-tab ${orgTab === 'cat' ? 'active' : ''}" data-org-tab="cat">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          Categories
        </button>
        <button class="af-tab ${orgTab === 'emp' ? 'active' : ''}" data-org-tab="emp">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Employee Directory
        </button>
      </div>

      <div class="af-card">
        <div class="af-card-body af-card-body-flush">
          ${tableContent}
        </div>
      </div>
    </div>`;
  },

  bind() {
    const s = AF.state;

    /* ── Access denied: back button ───────────────────────────── */
    const backBtn = document.getElementById('backToDash');
    if (backBtn) {
      backBtn.onclick = () => AF.navigate('dashboard');
      return;
    }

    /* ── Tab switching ────────────────────────────────────────── */
    document.querySelectorAll('[data-org-tab]').forEach(tab => {
      tab.onclick = () => {
        orgTab = tab.dataset.orgTab;
        AF.render();
      };
    });

    /* ── Add button ───────────────────────────────────────────── */
    const addBtn = document.getElementById('orgAddBtn');
    if (addBtn) {
      addBtn.onclick = () => {
        if (orgTab === 'dept') AF.openModal('addDept');
        else if (orgTab === 'cat') AF.openModal('addCat');
        else AF.openModal('addEmployee');
      };
    }

    /* ── Promote buttons ──────────────────────────────────────── */
    const roleOrder = ['Employee', 'Department Head', 'Asset Manager', 'Admin'];

    document.querySelectorAll('[data-promote]').forEach(btn => {
      btn.onclick = () => {
        const empId = btn.dataset.promote;
        const emp = s.employees.find(e => e.id === empId);
        if (!emp) return;
        const idx = roleOrder.indexOf(emp.role);
        if (idx < roleOrder.length - 1) {
          const newRole = roleOrder[idx + 1];
          emp.role = newRole;
          AF.addLog(s.session.name, 'Promoted employee', `${emp.name} → ${newRole}`);
          AF.addNotif(`${emp.name} promoted to ${newRole}`, 'Approvals');
          AF.toast(`${emp.name} promoted to ${newRole}.`, 'success');
          AF.render();
        }
      };
    });

    /* ── Demote buttons ───────────────────────────────────────── */
    document.querySelectorAll('[data-demote]').forEach(btn => {
      btn.onclick = () => {
        const empId = btn.dataset.demote;
        const emp = s.employees.find(e => e.id === empId);
        if (!emp) return;
        const idx = roleOrder.indexOf(emp.role);
        if (idx > 0) {
          const newRole = roleOrder[idx - 1];
          emp.role = newRole;
          AF.addLog(s.session.name, 'Demoted employee', `${emp.name} → ${newRole}`);
          AF.toast(`${emp.name} reassigned to ${newRole}.`, 'info');
          AF.render();
        }
      };
    });
  }
};
