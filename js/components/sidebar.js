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

    // Apply dynamic width when not collapsed
    const widthStyle = collapsed
      ? 'width: 68px;'
      : (s.sidebarWidth ? `width: ${s.sidebarWidth}px;` : '');

    return `
    <nav class="af-sidebar ${collapsed ? 'collapsed' : ''} ${s.sidebarOpen ? 'open' : ''}" id="sidebar" style="${widthStyle}">
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

      <!-- Sidebar Resizer Handle (After Effects style) -->
      <div class="af-sidebar-resizer" id="sidebarResizer"></div>
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

    // Draggable Sidebar Border Resizer Handle
    const resizer = document.getElementById('sidebarResizer');
    const sidebar = document.getElementById('sidebar');
    if (resizer && sidebar) {
      let isDragging = false;
      let startX = 0;
      let startWidth = 0;

      resizer.addEventListener('mousedown', (e) => {
        isDragging = true;
        resizer.classList.add('dragging');
        startX = e.clientX;
        startWidth = sidebar.offsetWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
      });

      const onMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        let newWidth = startWidth + deltaX;

        if (newWidth < 120) {
          // Snap collapsed
          AF.state.sidebarCollapsed = true;
          sidebar.classList.add('collapsed');
          sidebar.style.width = '68px';
        } else {
          AF.state.sidebarCollapsed = false;
          sidebar.classList.remove('collapsed');

          // Clamp width boundaries
          newWidth = Math.max(180, Math.min(newWidth, 480));
          sidebar.style.width = newWidth + 'px';
          AF.state.sidebarWidth = newWidth;
        }

        // Force recalculation for UI layouts
        window.dispatchEvent(new Event('resize'));
      };

      const onMouseUp = () => {
        if (isDragging) {
          isDragging = false;
          resizer.classList.remove('dragging');
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);

          // Re-render UI to update footer layouts properly
          AF.render();
        }
      };

      resizer.addEventListener('mousedown', () => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      // Touch screen support
      resizer.addEventListener('touchstart', (e) => {
        isDragging = true;
        resizer.classList.add('dragging');
        startX = e.touches[0].clientX;
        startWidth = sidebar.offsetWidth;
        e.preventDefault();
      });

      const onTouchMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches[0].clientX;
        const deltaX = clientX - startX;
        let newWidth = startWidth + deltaX;

        if (newWidth < 120) {
          AF.state.sidebarCollapsed = true;
          sidebar.classList.add('collapsed');
          sidebar.style.width = '68px';
        } else {
          AF.state.sidebarCollapsed = false;
          sidebar.classList.remove('collapsed');
          newWidth = Math.max(180, Math.min(newWidth, 480));
          sidebar.style.width = newWidth + 'px';
          AF.state.sidebarWidth = newWidth;
        }
        window.dispatchEvent(new Event('resize'));
      };

      const onTouchEnd = () => {
        if (isDragging) {
          isDragging = false;
          resizer.classList.remove('dragging');
          document.removeEventListener('touchmove', onTouchMove);
          document.removeEventListener('touchend', onTouchEnd);
          AF.render();
        }
      };

      resizer.addEventListener('touchstart', () => {
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);
      });
    }
  }
};
