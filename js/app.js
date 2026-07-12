/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Main Application Router & Renderer
   ═══════════════════════════════════════════════════════════════════ */

/* ── Screen registry ─────────────────────────────────────────────── */
const SCREEN_MAP = {
  login: { render: () => AF.ScreenAuth.render(), bind: () => AF.ScreenAuth.bind() },
  dashboard: { render: () => AF.ScreenDashboard.render(), bind: () => AF.ScreenDashboard.bind() },
  org: { render: () => AF.ScreenOrganization.render(), bind: () => AF.ScreenOrganization.bind() },
  assets: { render: () => AF.ScreenAssets.render(), bind: () => AF.ScreenAssets.bind() },
  allocation: { render: () => AF.ScreenAllocation.render(), bind: () => AF.ScreenAllocation.bind() },
  booking: { render: () => AF.ScreenBooking.render(), bind: () => AF.ScreenBooking.bind() },
  maintenance: { render: () => AF.ScreenMaintenance.render(), bind: () => AF.ScreenMaintenance.bind() },
  audit: { render: () => AF.ScreenAudit.render(), bind: () => AF.ScreenAudit.bind() },
  reports: { render: () => AF.ScreenReports.render(), bind: () => AF.ScreenReports.bind() },
  notifications: { render: () => AF.ScreenNotifications.render(), bind: () => AF.ScreenNotifications.bind() },
};

/* ── Main render function ────────────────────────────────────────── */
AF.render = function () {
  const app = document.getElementById('app');
  if (!app) return;

  const s = AF.state;

  /* Not logged in: show auth screen */
  if (!s.session) {
    app.className = 'af-app af-app-auth';
    app.innerHTML = AF.ScreenAuth.render();
    AF.ScreenAuth.bind();
    return;
  }

  /* Logged in: show app shell */
  const screen = SCREEN_MAP[s.screen] || SCREEN_MAP.dashboard;

  app.className = 'af-app';
  app.innerHTML = `
    ${AF.Topbar.render()}
    <div class="af-body">
      ${AF.Sidebar.render()}
      <main class="af-main" id="mainContent">
        ${screen.render()}
      </main>
    </div>
    ${AF.Modal.render()}
    ${AF.ToastRenderer.render()}
  `;

  /* Bind all components */
  AF.Topbar.bind();
  AF.Sidebar.bind();
  AF.Modal.bind();
  AF.ToastRenderer.bind();
  screen.bind();
};

/* ── Keyboard shortcuts ──────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  /* Escape to close modal */
  if (e.key === 'Escape' && AF.state.modal) {
    AF.closeModal();
  }

  /* Cmd/Ctrl+K for global search */
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) searchInput.focus();
  }
});

/* ── Initialize ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  AF.theme.apply();
  AF.render();
});
