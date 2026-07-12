/* AssetFlow - Topbar Component */

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
        <button class="af-topbar-hamburger" id="sidebarToggle" title="Toggle sidebar" aria-label="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        <div class="af-topbar-logo">
          <img src="assets/icons/logo.png" alt="AssetFlow" />
          <span class="af-topbar-logo-text">AssetFlow</span>
          <span class="af-topbar-logo-tag">ERP</span>
        </div>
      </div>

      <div class="af-topbar-center">
        <div class="af-topbar-search">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search assets, bookings, people..." id="globalSearch" autocomplete="off" />
          <kbd class="search-kbd">Ctrl K</kbd>
        </div>
      </div>

      <div class="af-topbar-right">
        <button class="af-topbar-bell" id="themeToggle" title="Toggle theme">
          ${themeIcon}
        </button>

        <button class="af-topbar-bell" id="notifBellBtn" title="Notifications" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          ${kpis.unreadNotifs > 0 ? `<span class="af-bell-count">${kpis.unreadNotifs}</span>` : ''}
        </button>

        <div class="af-topbar-user" id="userMenu">
          <div class="af-topbar-user-avatar">
            ${AF.initials(s.session.name)}
          </div>
          <div class="af-topbar-user-info">
            <span class="af-topbar-user-name">${s.session.name}</span>
            <span class="af-topbar-user-role">${s.session.role}</span>
          </div>
          <button class="af-topbar-bell" id="logoutBtn" title="Sign out" style="width: 32px; height: 32px; border-radius: var(--af-radius-sm); margin-left: 8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </header>`;
  },

  bind() {
    const toggle = document.getElementById('sidebarToggle');
    if (toggle) toggle.onclick = () => {
      AF.state.sidebarOpen = !AF.state.sidebarOpen;
      AF.render();
    };

    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.onclick = () => {
      AF.theme.toggle();
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

    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.onfocus = () => searchInput.select();
    }
  }
};
