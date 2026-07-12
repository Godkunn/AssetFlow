/* AssetFlow — Sidebar Component */

AF.Sidebar = {
  render() {
    const s = AF.state;
    const items = AF.ROLE_NAV[s.session.role];
    const collapsed = s.sidebarCollapsed;
    const kpis = AF.computeKPIs();

    const navGroups = [
      {
        label: 'Overview',
        items: items.filter(k => ['dashboard'].includes(k))
      },
      {
        label: 'Management',
        items: items.filter(k => ['org', 'assets', 'allocation', 'booking'].includes(k))
      },
      {
        label: 'Operations',
        items: items.filter(k => ['maintenance', 'audit', 'reports', 'notifications'].includes(k))
      }
    ].filter(g => g.items.length > 0);

    return `
    <nav class="af-sidebar ${collapsed ? 'collapsed' : ''} ${s.sidebarOpen ? 'open' : ''}" id="sidebar">
      <!-- Chevron Toggle Button for Desktop -->
      <button class="af-sidebar-toggle" id="sidebarToggleBtn" title="Toggle Sidebar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <div class="af-side-nav">
        ${navGroups.map(group => `
          <div class="af-side-section">
            ${!collapsed ? `<div class="af-side-section-label">${group.label}</div>` : ''}
            ${group.items.map(k => {
              const meta = AF.NAV_META[k];
              const isActive = s.screen === k;
              const badge = k === 'notifications' && kpis.unreadNotifs > 0
                ? `<span class="af-side-link-badge">${kpis.unreadNotifs}</span>` : '';
              const pendBadge = k === 'maintenance' && kpis.maintenance > 0
                ? `<span class="af-side-link-badge" style="background: var(--af-amber-tint); color: var(--af-amber);">${kpis.maintenance}</span>` : '';
              return `
              <a href="#" class="af-side-link ${isActive ? 'active' : ''}" data-nav="${k}" title="${meta.label}">
                <span class="af-side-icon">${meta.icon}</span>
                ${!collapsed ? `<span class="af-side-label">${meta.label}</span>` : ''}
                ${!collapsed ? (badge || pendBadge) : ''}
                <span class="af-tooltip">${meta.label}</span>
              </a>`;
            }).join('')}
          </div>
        `).join('')}
      </div>

      ${!collapsed ? `
      <div class="af-side-footer">
        <div class="af-sidebar-stats">
          <div class="af-sidebar-stat">
            <span class="af-sidebar-stat-val">${AF.state.assets.length}</span>
            <span class="af-sidebar-stat-label">Assets</span>
          </div>
          <div class="af-sidebar-stat">
            <span class="af-sidebar-stat-val">${AF.state.employees.length}</span>
            <span class="af-sidebar-stat-label">People</span>
          </div>
          <div class="af-sidebar-stat">
            <span class="af-sidebar-stat-val">${AF.state.departments.length}</span>
            <span class="af-sidebar-stat-label">Depts</span>
          </div>
        </div>
      </div>` : ''}
    </nav>`;
  },

  bind() {
    // Navigation clicks
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        AF.state.screen = el.dataset.nav;
        AF.state.sidebarOpen = false; // Close overlay on mobile
        AF.render();
      };
    });

    // Sidebar expand/collapse toggle for desktop
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    if (toggleBtn) {
      toggleBtn.onclick = (e) => {
        e.preventDefault();
        AF.state.sidebarCollapsed = !AF.state.sidebarCollapsed;
        AF.render();
      };
    }
  }
};
