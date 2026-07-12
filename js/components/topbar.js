/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Topbar Component
   ═══════════════════════════════════════════════════════════════════ */

AF.Topbar = {
  render() {
    const s = AF.state;
    const kpis = AF.computeKPIs();
    const themeIcon = AF.theme.current === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

    return `
    <header class="af-topbar">
      <div class="af-topbar-left">
        <button class="af-sidebar-toggle-btn" id="sidebarToggle" title="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div class="af-topbar-logo">
          <img src="assets/logo.png" alt="AssetFlow" class="af-logo-img" />
          <span class="af-logo-text">AssetFlow</span>
          <span class="af-logo-badge">ERP</span>
        </div>
      </div>

      <div class="af-topbar-center">
        <div class="af-global-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="af-search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="af-global-search-input" placeholder="Search assets, bookings, people..." id="globalSearch" />
          <kbd class="af-search-shortcut">⌘K</kbd>
        </div>
      </div>

      <div class="af-topbar-right">
        <div class="af-role-switcher">
          <span class="af-role-label">Role:</span>
          <select class="af-role-select" id="roleSwitch">
            ${Object.keys(AF.ROLE_NAV).map(r =>
              `<option value="${r}" ${s.session.role === r ? 'selected' : ''}>${r}</option>`
            ).join('')}
          </select>
        </div>

        <button class="af-topbar-icon-btn af-theme-toggle" id="themeToggle" title="Toggle theme">
          ${themeIcon}
        </button>

        <button class="af-topbar-icon-btn af-notif-bell" id="notifBellBtn" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          ${kpis.unreadNotifs > 0 ? `<span class="af-notif-count">${kpis.unreadNotifs}</span>` : ''}
        </button>

        <div class="af-user-menu" id="userMenu">
          <div class="af-avatar af-avatar-sm" style="background: var(--af-gradient-primary);">
            ${AF.initials(s.session.name)}
          </div>
          <div class="af-user-info">
            <span class="af-user-name">${s.session.name}</span>
            <span class="af-user-role">${s.session.role}</span>
          </div>
          <button class="af-topbar-icon-btn af-logout-btn" id="logoutBtn" title="Log out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </header>`;
  },

  bind() {
    const toggle = document.getElementById('sidebarToggle');
    if (toggle) toggle.onclick = () => {
      AF.state.sidebarCollapsed = !AF.state.sidebarCollapsed;
      AF.render();
    };

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.onclick = () => {
      AF.theme.toggle();
      AF.render();
    };

    const roleSwitch = document.getElementById('roleSwitch');
    if (roleSwitch) roleSwitch.onchange = () => {
      const role = roleSwitch.value;
      const emp = AF.state.employees.find(e => e.role === role) || AF.state.employees[0];
      AF.state.session = { name: emp.name, email: emp.email, role, deptId: emp.dept };
      if (!AF.ROLE_NAV[role].includes(AF.state.screen)) AF.state.screen = 'dashboard';
      AF.render();
    };

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.onclick = () => {
      AF.Particles.destroy();
      AF.state.session = null;
      AF.state.screen = 'login';
      AF.render();
    };

    const notifBtn = document.getElementById('notifBellBtn');
    if (notifBtn) notifBtn.onclick = () => {
      AF.state.screen = 'notifications';
      AF.render();
    };
  }
};
