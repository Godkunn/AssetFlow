/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Sidebar Component
   ═══════════════════════════════════════════════════════════════════ */

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
    <nav class="af-sidebar ${collapsed ? 'collapsed' : ''}" id="sidebar">
      <div class="af-sidebar-nav">
        ${navGroups.map(group => `
          <div class="af-side-section">
            ${!collapsed ? `<div class="af-side-section-label">${group.label}</div>` : ''}
            ${group.items.map(k => {
              const meta = AF.NAV_META[k];
              const isActive = s.screen === k;
              const badge = k === 'notifications' && kpis.unreadNotifs > 0
                ? `<span class="af-side-badge">${kpis.unreadNotifs}</span>` : '';
              const pendBadge = k === 'maintenance' && kpis.maintenance > 0
                ? `<span class="af-side-badge af-side-badge-amber">${kpis.maintenance}</span>` : '';
              return `
              <a href="#" class="af-side-link ${isActive ? 'active' : ''}" data-nav="${k}" title="${meta.label}">
                <span class="af-side-icon">${meta.icon}</span>
                ${!collapsed ? `<span class="af-side-text">${meta.label}</span>` : ''}
                ${!collapsed ? (badge || pendBadge) : ''}
                ${collapsed ? `<span class="af-side-tooltip">${meta.label}</span>` : ''}
              </a>`;
            }).join('')}
          </div>
        `).join('')}
      </div>

      ${!collapsed ? `
      <div class="af-sidebar-footer">
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
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.onclick = (e) => {
        e.preventDefault();
        AF.state.screen = el.dataset.nav;
        AF.render();
      };
    });
  }
};
