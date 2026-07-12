/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Notifications Screen
   ═══════════════════════════════════════════════════════════════════ */

let notifFilter = 'All';

AF.ScreenNotifications = {
  render() {
    const s = AF.state;
    const filtered = notifFilter === 'All'
      ? s.notifications
      : s.notifications.filter(n => n.type === notifFilter);

    const tabs = ['All', 'Alerts', 'Approvals', 'Bookings'];
    const tabCounts = {
      All: s.notifications.length,
      Alerts: s.notifications.filter(n => n.type === 'Alerts').length,
      Approvals: s.notifications.filter(n => n.type === 'Approvals').length,
      Bookings: s.notifications.filter(n => n.type === 'Bookings').length,
    };

    const unreadCount = s.notifications.filter(n => !n.read).length;

    return `
    <div class="af-page">
      <nav class="af-breadcrumb">
        <span class="af-breadcrumb-item">My Account</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item">AssetFlow</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item active">Notifications</span>
      </nav>
      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">Notifications &amp; Activity Log</h1>
          <p class="af-page-subtitle">Every role stays informed without digging for updates.</p>
        </div>
        ${unreadCount > 0 ? `
          <button class="af-btn af-btn-ghost" id="markAllReadBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Mark all as read (${unreadCount})
          </button>` : ''}
      </div>

      <div class="af-tabs">
        ${tabs.map(t => `
          <button class="af-tab ${notifFilter === t ? 'active' : ''}" data-notiftab="${t}">
            ${t}
            <span class="af-tab-count">${tabCounts[t]}</span>
          </button>
        `).join('')}
      </div>

      <div class="af-grid-2col">
        <!-- Notification center -->
        <div class="af-card">
          <div class="af-card-header">
            <h3>Notification Center</h3>
          </div>
          <div class="af-card-body">
            ${filtered.length ? filtered.map(n => `
              <div class="af-notification-item ${n.read ? '' : 'af-notification-unread'}" data-notif-id="${n.id}">
                <div class="af-notification-dot-wrap">
                  ${!n.read ? '<span class="af-notification-dot"></span>' : '<span class="af-notification-dot-empty"></span>'}
                </div>
                <div class="af-notification-content">
                  <div class="af-notification-text">${n.text}</div>
                  <div class="af-notification-meta">
                    <span>${n.time}</span>
                    <span class="af-badge af-badge-${n.type.toLowerCase() === 'alerts' ? 'pending' : n.type.toLowerCase() === 'approvals' ? 'allocated' : 'reserved'}">${n.type}</span>
                  </div>
                </div>
                ${!n.read ? `
                  <button class="af-btn af-btn-ghost af-btn-sm" data-mark-read="${n.id}" title="Mark as read">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                  </button>
                ` : ''}
              </div>
            `).join('') : `
              <div class="af-empty-state">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--af-text-muted)" stroke-width="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p>No notifications in this category.</p>
              </div>
            `}
          </div>
        </div>

        <!-- Activity ledger -->
        <div class="af-card">
          <div class="af-card-header">
            <h3>System Activity Ledger</h3>
          </div>
          <div class="af-card-body">
            ${s.log.length ? s.log.map(l => `
              <div class="af-ledger-item">
                <div class="af-ledger-time">${l.time}</div>
                <div class="af-ledger-content">
                  <span class="af-ledger-actor">${l.actor}</span>
                  <span class="af-ledger-action">${l.action}</span>
                  <span class="af-ledger-target">${l.target}</span>
                </div>
              </div>
            `).join('') : '<div class="af-hint">No activity recorded yet.</div>'}
          </div>
        </div>
      </div>
    </div>`;
  },

  bind() {
    document.querySelectorAll('[data-notiftab]').forEach(el => {
      el.onclick = () => {
        notifFilter = el.dataset.notiftab;
        AF.render();
      };
    });

    document.querySelectorAll('[data-mark-read]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        const id = el.dataset.markRead;
        const notif = AF.state.notifications.find(n => n.id === id);
        if (notif) {
          notif.read = true;
          AF.render();
        }
      };
    });

    const markAllBtn = document.getElementById('markAllReadBtn');
    if (markAllBtn) markAllBtn.onclick = () => {
      AF.state.notifications.forEach(n => n.read = true);
      AF.toast('All notifications marked as read.');
    };

    /* Click notification item to mark as read */
    document.querySelectorAll('.af-notification-item.af-notification-unread').forEach(el => {
      el.onclick = () => {
        const id = el.dataset.notifId;
        const notif = AF.state.notifications.find(n => n.id === id);
        if (notif) {
          notif.read = true;
          AF.render();
        }
      };
    });
  }
};
