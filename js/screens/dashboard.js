/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Dashboard Screen
   ═══════════════════════════════════════════════════════════════════ */

AF.ScreenDashboard = {

  render() {
    const s = AF.state;
    const kpis = AF.computeKPIs();
    const firstName = s.session.name.split(' ')[0];
    const today = AF.formatDate(AF.todayISO());

    /* ── KPI definitions ──────────────────────────────────────── */
    const kpiCards = [
      {
        label: 'Assets Available',
        value: kpis.available,
        color: 'emerald',
        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>`
      },
      {
        label: 'Assets Allocated',
        value: kpis.allocated,
        color: 'purple',
        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
          <polyline points="17 11 19 13 23 9"/>
        </svg>`
      },
      {
        label: 'Maintenance Active',
        value: kpis.maintenance,
        color: 'amber',
        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>`
      },
      {
        label: 'Active Bookings',
        value: kpis.bookings,
        color: 'sky',
        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>`
      },
      {
        label: 'Pending Transfers',
        value: kpis.transfers,
        color: 'teal',
        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>`
      },
      {
        label: 'Total Asset Value',
        value: kpis.totalValue,
        color: 'gold',
        formatted: AF.formatCurrency(kpis.totalValue),
        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>`
      }
    ];

    /* ── Recent activity (last 7) ─────────────────────────────── */
    const recentLogs = s.log.slice(0, 7);
    const recentNotifs = s.notifications.slice(0, 6);

    return `
    <div class="af-page">
      <nav class="af-breadcrumb">
        <span class="af-breadcrumb-item">My Account</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item active">AssetFlow</span>
      </nav>

      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">${AF.getGreeting()}, ${firstName}!</h1>
          <p class="af-page-subtitle">${s.session.role} · ${today}</p>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="af-kpi-grid">
        ${kpiCards.map(k => `
          <div class="af-kpi af-kpi-${k.color}">
            <div class="af-kpi-icon">${k.icon}</div>
            <div class="af-kpi-body">
              <span class="af-kpi-value" data-count-to="${k.value}">${k.formatted || '0'}</span>
              <span class="af-kpi-label">${k.label}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Overdue Banner -->
      <div class="af-overdue-banner">
        <span class="af-pulse-dot"></span>
        <span class="af-overdue-text">
          <strong>3 assets overdue</strong> for scheduled return — please follow up with holders.
        </span>
        <button class="af-btn af-btn-sm af-btn-ghost" data-quick-action="assets">View assets</button>
      </div>

      <!-- Quick Actions -->
      <div class="af-quick-actions">
        <button class="af-btn af-btn-primary" data-quick-action="registerAsset">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
          Register Asset
        </button>
        <button class="af-btn af-btn-secondary" data-quick-action="booking">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Book Resource
        </button>
        <button class="af-btn af-btn-outline" data-quick-action="raiseMaintenance">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          Raise Maintenance
        </button>
      </div>

      <!-- Two-column grid: Activity + Notifications -->
      <div class="af-grid-2col">
        <!-- Recent Activity -->
        <div class="af-card">
          <div class="af-card-header">
            <h3 class="af-card-title">Recent Activity</h3>
            <span class="af-card-badge">${recentLogs.length} entries</span>
          </div>
          <div class="af-card-body af-card-body-flush">
            ${recentLogs.length === 0
              ? '<p class="af-empty-state">No recent activity to show.</p>'
              : recentLogs.map(log => `
                <div class="af-activity-item">
                  <div class="af-activity-dot"></div>
                  <div class="af-activity-content">
                    <span class="af-activity-text">
                      <strong>${log.actor}</strong> ${log.action}
                      <span class="af-text-muted">· ${log.target}</span>
                    </span>
                    <span class="af-activity-time">${log.time}</span>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>

        <!-- Notifications -->
        <div class="af-card">
          <div class="af-card-header">
            <h3 class="af-card-title">Notifications</h3>
            <span class="af-card-badge">${AF.computeKPIs().unreadNotifs} unread</span>
          </div>
          <div class="af-card-body af-card-body-flush">
            ${recentNotifs.length === 0
              ? '<p class="af-empty-state">You\'re all caught up!</p>'
              : recentNotifs.map(n => `
                <div class="af-notif-item ${n.read ? '' : 'af-notif-unread'}">
                  <div class="af-notif-indicator ${n.read ? '' : 'active'}"></div>
                  <div class="af-notif-body">
                    <span class="af-notif-text">${n.text}</span>
                    <span class="af-notif-meta">
                      <span class="af-badge af-badge-subtle">${n.type}</span>
                      <span class="af-notif-time">${n.time}</span>
                    </span>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>
      </div>
    </div>`;
  },

  bind() {
    /* ── Quick action buttons ─────────────────────────────────── */
    document.querySelectorAll('[data-quick-action]').forEach(btn => {
      btn.onclick = () => {
        const action = btn.dataset.quickAction;
        if (action === 'registerAsset') {
          AF.openModal('registerAsset');
        } else if (action === 'booking') {
          AF.navigate('booking');
        } else if (action === 'raiseMaintenance') {
          AF.openModal('raiseMaintenance');
        } else if (action === 'assets') {
          AF.navigate('assets');
        }
      };
    });

    /* ── Animate KPI numbers ──────────────────────────────────── */
    document.querySelectorAll('[data-count-to]').forEach(el => {
      const target = Number(el.dataset.countTo);
      if (target === 0) return;

      /* Check if this is a currency value (large number) */
      const isCurrency = target > 9999;
      const duration = 800;
      const startTime = performance.now();

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = Math.round(eased * target);

        if (isCurrency) {
          el.textContent = AF.formatCurrency(current);
        } else {
          el.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    });
  }
};
