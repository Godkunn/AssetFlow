/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Audit Screen
   ═══════════════════════════════════════════════════════════════════ */

AF.ScreenAudit = {
  render() {
    const cycle = AF.state.audits[0];
    if (!cycle) {
      return `
      <div class="af-page-enter">
        <div class="af-breadcrumb">My Account / AssetFlow / Audit</div>
        <div class="af-page-header">
          <div>
            <h1 class="af-page-title">Asset Audit</h1>
            <p class="af-page-sub">No audit cycles created yet.</p>
          </div>
          ${['Admin', 'Asset Manager'].includes(AF.state.session.role) ?
            `<button class="af-btn af-btn-primary" id="newAuditBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Audit Cycle
            </button>` : ''}
        </div>
        <div class="af-empty-state">
          <div class="af-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--af-text-muted)" stroke-width="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <p>Create your first audit cycle to start verifying assets.</p>
        </div>
      </div>`;
    }

    const verified = cycle.items.filter(i => i.verdict === 'Verified').length;
    const flagged = cycle.items.filter(i => i.verdict !== 'Verified').length;
    const total = cycle.items.length;
    const pct = total > 0 ? Math.round((verified / total) * 100) : 0;

    return `
    <div class="af-page-enter">
      <div class="af-breadcrumb">My Account / AssetFlow / Audit</div>
      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">Asset Audit Cycle</h1>
          <p class="af-page-sub">${cycle.name}: ${cycle.dateRange} · Auditors: ${cycle.auditors.join(', ')}</p>
        </div>
        <div style="display:flex;gap:8px;">
          ${['Admin', 'Asset Manager'].includes(AF.state.session.role) ?
            `<button class="af-btn" id="newAuditBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Cycle
            </button>` : ''}
        </div>
      </div>

      <!-- Progress bar -->
      <div class="af-card" style="margin-bottom:16px;">
        <div class="af-card-body">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <span style="font-weight:600;font-size:13px;">Audit Progress</span>
            <span style="font-size:13px;color:var(--af-text-secondary);">${verified}/${total} verified (${pct}%)</span>
          </div>
          <div class="af-progress-bar">
            <div class="af-progress-fill af-progress-emerald" style="width:${pct}%"></div>
          </div>
        </div>
      </div>

      <div class="af-card">
        <div class="af-card-body" style="overflow-x:auto;">
          <table class="af-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Expected Location</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              ${cycle.items.map((it, idx) => `
                <tr>
                  <td><span class="af-tag-chip">${it.tag}</span></td>
                  <td>${it.expected}</td>
                  <td>
                    ${cycle.closed
                      ? `<span class="${AF.badgeClass(it.verdict)}">${it.verdict}</span>`
                      : `<div class="af-verdict-group">
                          ${['Verified', 'Missing', 'Damaged'].map(v => `
                            <button class="af-btn af-btn-sm ${it.verdict === v ? (v === 'Verified' ? 'af-btn-success' : v === 'Missing' ? 'af-btn-danger' : 'af-btn-warning') : 'af-btn-ghost'}"
                              data-verdict="${idx}|${v}">${v}</button>
                          `).join('')}
                        </div>`
                    }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="af-card-body" style="border-top:1px solid var(--af-border);">
          ${flagged > 0 ? `
            <div class="af-alert af-alert-warning" style="margin-bottom:12px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span>${flagged} asset${flagged === 1 ? '' : 's'} flagged — discrepancy report generated automatically.</span>
            </div>
          ` : ''}

          ${!cycle.closed
            ? `<button class="af-btn af-btn-danger" id="closeAuditBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
                Close Audit Cycle
              </button>`
            : `<span class="af-badge af-badge-approved">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
                Cycle Closed
              </span>`
          }
        </div>
      </div>
    </div>`;
  },

  bind() {
    const cycle = AF.state.audits[0];

    document.querySelectorAll('[data-verdict]').forEach(el => {
      el.onclick = () => {
        const [idx, v] = el.dataset.verdict.split('|');
        if (cycle) {
          cycle.items[parseInt(idx)].verdict = v;
          AF.render();
        }
      };
    });

    const closeBtn = document.getElementById('closeAuditBtn');
    if (closeBtn && cycle) closeBtn.onclick = () => {
      cycle.closed = true;
      cycle.items.forEach(it => {
        if (it.verdict === 'Missing') {
          const asset = AF.state.assets.find(a => a.tag === it.tag);
          if (asset) asset.status = 'Lost';
          AF.addNotif(`Audit discrepancy flagged: ${it.tag} missing`, 'Alerts');
        } else if (it.verdict === 'Damaged') {
          AF.addNotif(`Audit discrepancy flagged: ${it.tag} damaged`, 'Alerts');
        }
      });
      AF.addLog(AF.state.session.name, 'Closed audit cycle', cycle.name);
      AF.toast('Audit cycle closed. Discrepant assets updated.');
    };

    const newBtn = document.getElementById('newAuditBtn');
    if (newBtn) newBtn.onclick = () => AF.openModal('newAudit');
  }
};
