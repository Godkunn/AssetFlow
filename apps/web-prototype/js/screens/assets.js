/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Assets Screen (Registry)
   ═══════════════════════════════════════════════════════════════════ */

let assetFilters = { q: '', category: '', status: '', expandedId: null };

AF.ScreenAssets = {

  render() {
    const s = AF.state;
    const canRegister = ['Admin', 'Asset Manager'].includes(s.session.role);

    /* ── Filter assets ────────────────────────────────────────── */
    let filtered = [...s.assets];

    if (assetFilters.q) {
      const q = assetFilters.q.toLowerCase();
      filtered = filtered.filter(a =>
        a.tag.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.holder && a.holder.toLowerCase().includes(q))
      );
    }

    if (assetFilters.category) {
      filtered = filtered.filter(a => a.category === assetFilters.category);
    }

    if (assetFilters.status) {
      filtered = filtered.filter(a => a.status === assetFilters.status);
    }

    /* ── Unique categories and statuses ───────────────────────── */
    const categories = [...new Set(s.assets.map(a => a.category))].sort();
    const statuses = [...new Set(s.assets.map(a => a.status))].sort();
    const deptCount = new Set(s.employees.map(e => e.dept)).size;

    return `
    <div class="af-page">
      <nav class="af-breadcrumb">
        <span class="af-breadcrumb-item">My Account</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item active">Assets</span>
      </nav>

      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">Asset Registry</h1>
          <p class="af-page-subtitle">${s.assets.length} assets across ${deptCount} departments</p>
        </div>
        ${canRegister ? `
          <button class="af-btn af-btn-primary" id="registerAssetBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Register Asset
          </button>
        ` : ''}
      </div>

      <!-- Filter Bar -->
      <div class="af-filter-bar">
        <div class="af-filter-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="af-filter-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" class="af-input af-input-search" id="assetSearchInput"
            placeholder="Search by tag, name, or holder…"
            value="${assetFilters.q}" />
        </div>
        <select class="af-select" id="assetCatFilter">
          <option value="">All Categories</option>
          ${categories.map(c => `<option value="${c}" ${assetFilters.category === c ? 'selected' : ''}>${c}</option>`).join('')}
        </select>
        <select class="af-select" id="assetStatusFilter">
          <option value="">All Statuses</option>
          ${statuses.map(st => `<option value="${st}" ${assetFilters.status === st ? 'selected' : ''}>${st}</option>`).join('')}
        </select>
        <span class="af-filter-count">${filtered.length} result${filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <!-- Assets Table -->
      <div class="af-card">
        <div class="af-card-body af-card-body-flush">
          <table class="af-table af-table-hover">
            <thead>
              <tr>
                <th>Tag</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Location</th>
                <th>Holder</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0
                ? '<tr><td colspan="6" class="af-empty-state">No assets match your filters.</td></tr>'
                : filtered.map(a => {
                  const isExpanded = assetFilters.expandedId === a.id;
                  return `
                  <tr class="af-row-clickable ${isExpanded ? 'af-row-expanded' : ''}" data-asset-row="${a.id}">
                    <td><span class="af-tag-chip">${a.tag}</span></td>
                    <td><strong>${a.name}</strong></td>
                    <td>${a.category}</td>
                    <td><span class="${AF.badgeClass(a.status)}">${a.status}</span></td>
                    <td>${a.location}</td>
                    <td>${a.holder}</td>
                  </tr>
                  ${isExpanded ? `
                  <tr class="af-expanded-detail">
                    <td colspan="6">
                      <div class="af-detail-grid">
                        <!-- Asset Info -->
                        <div class="af-detail-section">
                          <h4 class="af-detail-heading">Asset Details</h4>
                          <div class="af-detail-pairs">
                            <div class="af-detail-pair">
                              <span class="af-detail-key">Serial</span>
                              <span class="af-detail-val"><code class="af-mono">${a.serial}</code></span>
                            </div>
                            <div class="af-detail-pair">
                              <span class="af-detail-key">Acquired</span>
                              <span class="af-detail-val">${AF.formatDate(a.acqDate)}</span>
                            </div>
                            <div class="af-detail-pair">
                              <span class="af-detail-key">Cost</span>
                              <span class="af-detail-val">${AF.formatCurrency(a.cost)}</span>
                            </div>
                            <div class="af-detail-pair">
                              <span class="af-detail-key">Condition</span>
                              <span class="af-detail-val">${a.condition}</span>
                            </div>
                            <div class="af-detail-pair">
                              <span class="af-detail-key">Shared</span>
                              <span class="af-detail-val">${a.shared ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Allocation History -->
                        <div class="af-detail-section">
                          <h4 class="af-detail-heading">Allocation History</h4>
                          ${a.history.length === 0
                            ? '<p class="af-text-muted af-text-sm">No allocation records.</p>'
                            : `<div class="af-mini-timeline">
                              ${a.history.map(h => `
                                <div class="af-mini-timeline-item">
                                  <span class="af-mini-dot"></span>
                                  <div>
                                    <span class="af-text-sm"><strong>${h.action}</strong> by ${h.actor}</span>
                                    <span class="af-text-muted af-text-xs">${AF.formatDate(h.date)} — ${h.note}</span>
                                  </div>
                                </div>
                              `).join('')}
                            </div>`
                          }
                        </div>

                        <!-- Maintenance History -->
                        <div class="af-detail-section">
                          <h4 class="af-detail-heading">Maintenance History</h4>
                          ${a.maint.length === 0
                            ? '<p class="af-text-muted af-text-sm">No maintenance records.</p>'
                            : `<div class="af-mini-timeline">
                              ${a.maint.map(m => `
                                <div class="af-mini-timeline-item">
                                  <span class="af-mini-dot af-mini-dot-amber"></span>
                                  <div>
                                    <span class="af-text-sm"><strong>${m.ticket}</strong> — ${m.issue}</span>
                                    <span class="af-text-muted af-text-xs">Stage: ${m.stage} · Tech: ${m.tech || 'Unassigned'}</span>
                                  </div>
                                </div>
                              `).join('')}
                            </div>`
                          }
                        </div>
                      </div>
                    </td>
                  </tr>` : ''}`;
                }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
  },

  bind() {
    /* ── Search input ─────────────────────────────────────────── */
    const searchInput = document.getElementById('assetSearchInput');
    if (searchInput) {
      searchInput.oninput = () => {
        assetFilters.q = searchInput.value;
        AF.render();
      };
      /* Auto-focus search */
      searchInput.focus();
      searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    }

    /* ── Category filter ──────────────────────────────────────── */
    const catFilter = document.getElementById('assetCatFilter');
    if (catFilter) {
      catFilter.onchange = () => {
        assetFilters.category = catFilter.value;
        AF.render();
      };
    }

    /* ── Status filter ────────────────────────────────────────── */
    const statusFilter = document.getElementById('assetStatusFilter');
    if (statusFilter) {
      statusFilter.onchange = () => {
        assetFilters.status = statusFilter.value;
        AF.render();
      };
    }

    /* ── Row click → expand/collapse ──────────────────────────── */
    document.querySelectorAll('[data-asset-row]').forEach(row => {
      row.onclick = () => {
        const id = row.dataset.assetRow;
        assetFilters.expandedId = assetFilters.expandedId === id ? null : id;
        AF.render();
      };
    });

    /* ── Register button ──────────────────────────────────────── */
    const regBtn = document.getElementById('registerAssetBtn');
    if (regBtn) {
      regBtn.onclick = () => AF.openModal('registerAsset');
    }
  }
};
