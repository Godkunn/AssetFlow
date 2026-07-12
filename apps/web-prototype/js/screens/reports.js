/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Reports & Analytics Screen
   ═══════════════════════════════════════════════════════════════════ */

AF.ScreenReports = {
  render() {
    const s = AF.state;
    const byCategory = s.categories.map(c => ({
      name: c.name,
      total: s.assets.filter(a => a.category === c.name).length,
      allocated: s.assets.filter(a => a.category === c.name && a.status === 'Allocated').length,
    }));
    const maxTotal = Math.max(...byCategory.map(c => c.total), 1);

    /* Status distribution for donut */
    const statuses = ['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost'];
    const statusCounts = statuses.map(st => s.assets.filter(a => a.status === st).length);
    const totalAssets = s.assets.length;

    /* Maintenance trend data */
    const maintTrend = [3, 5, 4, 7, 6, 8, 5];
    const maxTrend = Math.max(...maintTrend);
    const trendPoints = maintTrend.map((v, i) => `${10 + i * 48},${130 - (v / maxTrend * 100)}`).join(' ');
    const areaPoints = `${trendPoints} ${10 + 6 * 48},140 10,140`;

    /* Heatmap data */
    const heatData = [2, 4, 7, 9, 10, 8, 6, 3, 5, 7];

    /* Top assets */
    const topAssets = [
      { name: 'Conference Room B2', tag: 'RM-B2', usage: 34, unit: 'bookings this month' },
      { name: 'Delivery Van', tag: 'AF-0343', usage: 21, unit: 'trips this month' },
      { name: 'Projector', tag: 'AF-0062', usage: 18, unit: 'uses this month' },
    ];

    return `
    <div class="af-page">
      <nav class="af-breadcrumb">
        <span class="af-breadcrumb-item">My Account</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item">AssetFlow</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item active">Reports</span>
      </nav>
      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">Reports &amp; Analytics</h1>
          <p class="af-page-subtitle">Operational insight across utilization, maintenance, and bookings.</p>
        </div>
        <button class="af-btn" id="exportBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export Report
        </button>
      </div>

      <!-- KPI summary row -->
      <div class="af-kpi-row" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px;">
        <div class="af-kpi af-kpi-purple">
          <div class="af-kpi-value">${totalAssets}</div>
          <div class="af-kpi-label">Total Assets</div>
        </div>
        <div class="af-kpi af-kpi-emerald">
          <div class="af-kpi-value">${AF.formatCurrency(s.assets.reduce((sum, a) => sum + (a.cost || 0), 0))}</div>
          <div class="af-kpi-label">Portfolio Value</div>
        </div>
        <div class="af-kpi af-kpi-amber">
          <div class="af-kpi-value">${s.maintenance.length}</div>
          <div class="af-kpi-label">Total Tickets</div>
        </div>
        <div class="af-kpi af-kpi-sky">
          <div class="af-kpi-value">${s.bookings.filter(b => b.status !== 'Cancelled').length}</div>
          <div class="af-kpi-label">Total Bookings</div>
        </div>
      </div>

      <div class="af-grid-2col">
        <!-- Cost Distribution by Department (Donut Chart) -->
        <div class="af-card">
          <div class="af-card-header"><h3>Portfolio Cost by Department</h3></div>
          <div class="af-card-body" style="display:flex;align-items:center;gap:20px;">
            <div style="position:relative;width:150px;height:150px;flex-shrink:0;">
              <svg viewBox="0 0 36 36" style="width:100%;height:100%;transform:rotate(-90deg);">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="3.5"></circle>
                <!-- Eng: 45% (dasharray 45 55) -->
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--af-purple)" stroke-width="3.5" stroke-dasharray="45 55" stroke-dashoffset="0"></circle>
                <!-- Design: 25% (dasharray 25 75, offset -45) -->
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--af-sky)" stroke-width="3.5" stroke-dasharray="25 75" stroke-dashoffset="-45"></circle>
                <!-- IT: 15% (dasharray 15 85, offset -70) -->
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--af-emerald)" stroke-width="3.5" stroke-dasharray="15 85" stroke-dashoffset="-70"></circle>
                <!-- Sales/HR: 15% (dasharray 15 85, offset -85) -->
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--af-amber)" stroke-width="3.5" stroke-dasharray="15 85" stroke-dashoffset="-85"></circle>
              </svg>
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                <div style="font-size:16px;font-weight:700;color:var(--af-text-primary);">$6.2K</div>
                <div style="font-size:9px;color:var(--af-text-muted);text-transform:uppercase;">Cost</div>
              </div>
            </div>
            <div style="flex:1;display:flex;flex-direction:column;gap:8px;font-size:12px;">
              <div style="display:flex;justify-content:between;align-items:center;">
                <span><span style="display:inline-block;width:10px;height:10px;background:var(--af-purple);border-radius:2px;margin-right:6px;"></span>Engineering</span>
                <span style="font-weight:600;margin-left:auto;">$2,790 (45%)</span>
              </div>
              <div style="display:flex;justify-content:between;align-items:center;">
                <span><span style="display:inline-block;width:10px;height:10px;background:var(--af-sky);border-radius:2px;margin-right:6px;"></span>Design</span>
                <span style="font-weight:600;margin-left:auto;">$1,550 (25%)</span>
              </div>
              <div style="display:flex;justify-content:between;align-items:center;">
                <span><span style="display:inline-block;width:10px;height:10px;background:var(--af-emerald);border-radius:2px;margin-right:6px;"></span>IT Support</span>
                <span style="font-weight:600;margin-left:auto;">$930 (15%)</span>
              </div>
              <div style="display:flex;justify-content:between;align-items:center;">
                <span><span style="display:inline-block;width:10px;height:10px;background:var(--af-amber);border-radius:2px;margin-right:6px;"></span>HR / Sales</span>
                <span style="font-weight:600;margin-left:auto;">$930 (15%)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Asset Condition Health index -->
        <div class="af-card">
          <div class="af-card-header"><h3>Asset Condition &amp; Risk Health Index</h3></div>
          <div class="af-card-body">
            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:12px;">
              <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                  <span style="color:var(--af-emerald-light);font-weight:600;">Excellent (Grade A)</span>
                  <span style="color:var(--af-text-secondary);">60% of inventory</span>
                </div>
                <div class="af-chart-bar-track" style="height:8px;background:rgba(255,255,255,0.05);"><div style="height:100%;width:60%;background:var(--af-emerald);border-radius:4px;"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                  <span style="color:var(--af-amber);font-weight:600;">Minor Wear (Grade B)</span>
                  <span style="color:var(--af-text-secondary);">25% of inventory</span>
                </div>
                <div class="af-chart-bar-track" style="height:8px;background:rgba(255,255,255,0.05);"><div style="height:100%;width:25%;background:var(--af-amber);border-radius:4px;"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
                  <span style="color:var(--af-rose-light);font-weight:600;">Critical Risk / Nearing Retirement (Grade C)</span>
                  <span style="color:var(--af-text-secondary);">15% of inventory</span>
                </div>
                <div class="af-chart-bar-track" style="height:8px;background:rgba(255,255,255,0.05);"><div style="height:100%;width:15%;background:var(--af-rose);border-radius:4px;"></div></div>
              </div>
            </div>
            <div class="af-hint">Audit verification rating is 98.2% positive accuracy.</div>
          </div>
        </div>
      </div>

      <div class="af-grid-2col" style="margin-top:16px;">
        <!-- Utilization by category -->
        <div class="af-card">
          <div class="af-card-header"><h3>Utilization by Category</h3></div>
          <div class="af-card-body">
            <div class="af-chart-bars">
              ${byCategory.map(c => {
                const pct = (c.total / maxTotal * 100) || 4;
                const utilPct = c.total > 0 ? Math.round(c.allocated / c.total * 100) : 0;
                return `
                <div class="af-chart-bar-item">
                  <div class="af-chart-bar-label">${c.name}</div>
                  <div class="af-chart-bar-track">
                    <div class="af-chart-bar-fill" style="width:${pct}%;">
                      <div class="af-chart-bar-alloc" style="width:${utilPct}%;"></div>
                    </div>
                  </div>
                  <div class="af-chart-bar-val">${c.allocated}/${c.total}</div>
                </div>`;
              }).join('')}
            </div>
            <div class="af-chart-legend" style="margin-top:12px;">
              <span><span class="af-legend-dot" style="background:var(--af-purple);"></span>Total</span>
              <span><span class="af-legend-dot" style="background:var(--af-gold);"></span>Allocated</span>
            </div>
          </div>
        </div>

        <!-- Maintenance trend -->
        <div class="af-card">
          <div class="af-card-header"><h3>Maintenance Frequency (7 weeks)</h3></div>
          <div class="af-card-body">
            <svg viewBox="0 0 340 155" width="100%" height="155" class="af-chart-svg">
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="var(--af-teal)" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="var(--af-teal)" stop-opacity="0.02"/>
                </linearGradient>
              </defs>
              <polygon fill="url(#trendGrad)" points="${areaPoints}"/>
              <polyline fill="none" stroke="var(--af-teal)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                points="${trendPoints}"/>
              ${maintTrend.map((v, i) => `
                <circle cx="${10 + i * 48}" cy="${130 - (v / maxTrend * 100)}" r="4" fill="var(--af-bg-secondary)" stroke="var(--af-teal)" stroke-width="2"/>
                <text x="${10 + i * 48}" y="${130 - (v / maxTrend * 100) - 10}" text-anchor="middle" fill="var(--af-text-secondary)" font-size="10" font-weight="600">${v}</text>
              `).join('')}
              ${['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'].map((w, i) =>
                `<text x="${10 + i * 48}" y="152" text-anchor="middle" fill="var(--af-text-muted)" font-size="10">${w}</text>`
              ).join('')}
            </svg>
          </div>
        </div>
      </div>

      <div class="af-grid-2col" style="margin-top:16px;">
        <!-- Most used assets -->
        <div class="af-card">
          <div class="af-card-header"><h3>Most Used Assets</h3></div>
          <div class="af-card-body">
            ${topAssets.map((a, i) => `
              <div class="af-activity-item" style="display:flex;align-items:center;gap:12px;">
                <div class="af-rank-badge">${i + 1}</div>
                <div style="flex:1;">
                  <div style="font-weight:600;font-size:13px;">${a.name}</div>
                  <div class="af-activity-meta"><span class="af-tag-chip">${a.tag}</span> · ${a.usage} ${a.unit}</div>
                </div>
                <div class="af-usage-bar">
                  <div class="af-usage-fill" style="width:${(a.usage / 40 * 100)}%;"></div>
                </div>
              </div>
            `).join('')}

            <h4 style="font-size:13px;margin:20px 0 10px;color:var(--af-text-secondary);">Idle Assets</h4>
            <div class="af-activity-item">
              <span class="af-tag-chip">AF-0301</span>
              <span style="margin-left:8px;font-size:13px;">Camera — unused 60+ days</span>
            </div>
            <div class="af-activity-item">
              <span class="af-tag-chip">AF-0410</span>
              <span style="margin-left:8px;font-size:13px;">Chair — unused 45 days</span>
            </div>
          </div>
        </div>

        <!-- Heatmap & upcoming -->
        <div class="af-card">
          <div class="af-card-header"><h3>Upcoming Maintenance & Retirement</h3></div>
          <div class="af-card-body">
            <div class="af-activity-item">
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="af-priority-dot" style="background:var(--af-amber);"></span>
                <span>Forklift AF-0087 — service due in 5 days</span>
              </div>
            </div>
            <div class="af-activity-item">
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="af-priority-dot" style="background:var(--af-rose);"></span>
                <span>ThinkPad AF-0020 — 4 years old, nearing retirement</span>
              </div>
            </div>

            <h4 style="font-size:13px;margin:20px 0 10px;color:var(--af-text-secondary);">Booking Heatmap — Peak Hours</h4>
            <div class="af-heatmap-grid">
              ${heatData.map((v, i) => `
                <div class="af-heatmap-cell" style="background:rgba(139,92,246,${v / 10});" title="${v} bookings at ${8 + i}:00">
                  <span class="af-heatmap-val">${v}</span>
                </div>
              `).join('')}
            </div>
            <div class="af-hint" style="margin-top:6px;">8am → 5pm across shared rooms</div>
          </div>
        </div>
      </div>
    </div>`;
  },

  bind() {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.onclick = () =>
      AF.toast('Report queued for export (PDF / Excel / CSV).', 'info');
  }
};
