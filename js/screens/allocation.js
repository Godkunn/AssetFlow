/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Allocation & Transfer Screen
   ═══════════════════════════════════════════════════════════════════ */

let allocState = { searchTag: '', conflict: null };

AF.ScreenAllocation = {

  render() {
    const s = AF.state;
    const canApprove = ['Admin', 'Asset Manager', 'Department Head'].includes(s.session.role);

    /* ── Pending transfers ────────────────────────────────────── */
    const pendingTransfers = s.transfers.filter(t => t.status === 'Pending');

    /* ── Allocated assets (for return section) ────────────────── */
    const allocatedAssets = s.assets.filter(a => a.status === 'Allocated');

    /* ── Build datalist options for asset search ──────────────── */
    const assetOptions = s.assets.map(a =>
      `<option value="${a.tag} — ${a.name} (${a.status})">`
    ).join('');

    /* ── Conflict info ────────────────────────────────────────── */
    const conflict = allocState.conflict;

    return `
    <div class="af-page">
      <nav class="af-breadcrumb">
        <span class="af-breadcrumb-item">My Account</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item active">Allocation</span>
      </nav>

      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">Allocation &amp; Transfer</h1>
          <p class="af-page-subtitle">Assign assets, manage transfers, and process returns</p>
        </div>
      </div>

      <div class="af-grid-2col">
        <!-- Left: Allocate an Asset -->
        <div class="af-card">
          <div class="af-card-header">
            <h3 class="af-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
              </svg>
              Allocate an Asset
            </h3>
          </div>
          <div class="af-card-body">
            <!-- Search -->
            <div class="af-field">
              <label class="af-label">Find asset by tag or name</label>
              <input type="text" class="af-input" id="allocSearchInput"
                list="allocAssetList"
                placeholder="e.g. AF-0114"
                value="${allocState.searchTag}" />
              <datalist id="allocAssetList">${assetOptions}</datalist>
              <span class="af-hint">Try searching for AF-0114 to see the allocation flow</span>
            </div>

            ${conflict ? `
            <!-- Conflict Alert -->
            <div class="af-alert af-alert-danger">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <div>
                <strong>${conflict.tag}</strong> is currently <strong>${conflict.status}</strong>.
                ${conflict.holder !== '—' ? `Held by: <strong>${conflict.holder}</strong>.` : ''}
                You can request a transfer instead.
              </div>
            </div>

            <!-- Transfer Form -->
            <div class="af-transfer-form">
              <div class="af-field-row">
                <div class="af-field">
                  <label class="af-label">Transfer from</label>
                  <input type="text" class="af-input" id="transferFrom"
                    value="${conflict.holder !== '—' ? conflict.holder : conflict.location}" readonly />
                </div>
                <div class="af-field">
                  <label class="af-label">Transfer to</label>
                  <select class="af-select" id="transferTo">
                    <option value="">Select recipient…</option>
                    ${s.employees.map(e => `<option value="${e.name} (${e.dept})">${e.name} — ${e.dept}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="af-field">
                <label class="af-label">Reason for transfer</label>
                <textarea class="af-textarea" id="transferReason" rows="2" placeholder="Briefly explain why this transfer is needed…"></textarea>
              </div>
              <button class="af-btn af-btn-primary" id="submitTransferBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                </svg>
                Submit Transfer Request
              </button>
            </div>
            ` : `
            <!-- Normal allocation form -->
            <div class="af-field">
              <label class="af-label">Assign to</label>
              <select class="af-select" id="allocAssignee">
                <option value="">Select an employee…</option>
                ${s.employees.filter(e => e.status === 'Active').map(e =>
                  `<option value="${e.name} (${e.dept})">${e.name} — ${e.dept}</option>`
                ).join('')}
              </select>
            </div>
            <div class="af-field">
              <label class="af-label">Expected return date</label>
              <input type="date" class="af-input" id="allocReturnDate" value="${AF.todayISO()}" />
            </div>
            <button class="af-btn af-btn-primary" id="allocateBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
                <polyline points="17 11 19 13 23 9"/>
              </svg>
              Allocate Asset
            </button>
            `}
          </div>
        </div>

        <!-- Right Column -->
        <div class="af-stack">
          <!-- Pending Transfer Requests -->
          <div class="af-card">
            <div class="af-card-header">
              <h3 class="af-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                  <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
                </svg>
                Pending Transfer Requests
              </h3>
              <span class="af-card-badge">${pendingTransfers.length}</span>
            </div>
            <div class="af-card-body af-card-body-flush">
              ${pendingTransfers.length === 0
                ? '<p class="af-empty-state">No pending transfers.</p>'
                : pendingTransfers.map(tr => `
                  <div class="af-transfer-card">
                    <div class="af-transfer-card-header">
                      <span class="af-tag-chip">${tr.assetTag}</span>
                      <span class="${AF.badgeClass(tr.status)}">${tr.status}</span>
                    </div>
                    <div class="af-transfer-card-flow">
                      <span class="af-transfer-from">${tr.from}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="af-transfer-arrow">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                      <span class="af-transfer-to">${tr.to}</span>
                    </div>
                    <p class="af-transfer-reason">${tr.reason}</p>
                    ${canApprove ? `
                      <button class="af-btn af-btn-sm af-btn-primary" data-approve-transfer="${tr.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Approve
                      </button>
                    ` : ''}
                  </div>
                `).join('')}
            </div>
          </div>

          <!-- Return an Asset -->
          <div class="af-card">
            <div class="af-card-header">
              <h3 class="af-card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Return an Asset
              </h3>
            </div>
            <div class="af-card-body">
              <div class="af-field">
                <label class="af-label">Select allocated asset</label>
                <select class="af-select" id="returnAssetSelect">
                  <option value="">Choose asset to return…</option>
                  ${allocatedAssets.map(a =>
                    `<option value="${a.id}">${a.tag} — ${a.name} (held by ${a.holder})</option>`
                  ).join('')}
                </select>
              </div>
              <div class="af-field">
                <label class="af-label">Condition note</label>
                <textarea class="af-textarea" id="returnConditionNote" rows="2" placeholder="Describe the condition of the asset…"></textarea>
              </div>
              <button class="af-btn af-btn-secondary" id="returnAssetBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                </svg>
                Return Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  },

  bind() {
    const s = AF.state;

    /* ── Search input ─────────────────────────────────────────── */
    const searchInput = document.getElementById('allocSearchInput');
    if (searchInput) {
      searchInput.oninput = () => {
        allocState.searchTag = searchInput.value;
        /* Clear conflict when search changes */
        allocState.conflict = null;
        AF.render();
      };
    }

    /* ── Allocate button ──────────────────────────────────────── */
    const allocBtn = document.getElementById('allocateBtn');
    if (allocBtn) {
      allocBtn.onclick = () => {
        const query = allocState.searchTag;
        const assignee = document.getElementById('allocAssignee')?.value;
        const returnDate = document.getElementById('allocReturnDate')?.value;

        if (!query) {
          AF.toast('Please search for an asset first.', 'warning');
          return;
        }

        const asset = AF.findAssetByQuery(query);
        if (!asset) {
          AF.toast('Asset not found. Check the tag or name.', 'error');
          return;
        }

        if (!assignee) {
          AF.toast('Please select an assignee.', 'warning');
          return;
        }

        /* Check for conflict: already allocated or under maintenance */
        if (asset.status === 'Allocated' || asset.status === 'Under Maintenance' || asset.status === 'Reserved') {
          allocState.conflict = {
            tag: asset.tag,
            name: asset.name,
            status: asset.status,
            holder: asset.holder,
            location: asset.location,
            assetId: asset.id
          };
          AF.toast(`${asset.tag} is ${asset.status}. A transfer request is needed.`, 'warning');
          AF.render();
          return;
        }

        /* Proceed with allocation */
        asset.status = 'Allocated';
        asset.holder = assignee;
        asset.history.push({
          date: AF.todayISO(),
          action: 'Allocated',
          actor: s.session.name,
          note: `to ${assignee}${returnDate ? ' · return by ' + AF.formatDate(returnDate) : ''}`
        });

        AF.addLog(s.session.name, 'Allocated asset', `${asset.tag} → ${assignee}`);
        AF.addNotif(`${asset.tag} allocated to ${assignee}`, 'Approvals');
        AF.toast(`${asset.tag} successfully allocated to ${assignee}.`, 'success');

        allocState.searchTag = '';
        allocState.conflict = null;
        AF.render();
      };
    }

    /* ── Submit transfer request ──────────────────────────────── */
    const transferBtn = document.getElementById('submitTransferBtn');
    if (transferBtn) {
      transferBtn.onclick = () => {
        const to = document.getElementById('transferTo')?.value;
        const reason = document.getElementById('transferReason')?.value?.trim();
        const conflict = allocState.conflict;

        if (!conflict) return;

        if (!to) {
          AF.toast('Please select a transfer recipient.', 'warning');
          return;
        }
        if (!reason) {
          AF.toast('Please provide a reason for the transfer.', 'warning');
          return;
        }

        const from = conflict.holder !== '—' ? conflict.holder : conflict.location;

        s.transfers.push({
          id: AF.uid('tr'),
          assetTag: conflict.tag,
          from,
          to,
          reason,
          status: 'Pending'
        });

        AF.addLog(s.session.name, 'Requested transfer', `${conflict.tag}: ${from} → ${to}`);
        AF.addNotif(`Transfer request for ${conflict.tag}: ${from} → ${to}`, 'Approvals');
        AF.toast('Transfer request submitted for approval.', 'success');

        allocState.searchTag = '';
        allocState.conflict = null;
        AF.render();
      };
    }

    /* ── Approve transfer buttons ─────────────────────────────── */
    document.querySelectorAll('[data-approve-transfer]').forEach(btn => {
      btn.onclick = () => {
        const trId = btn.dataset.approveTransfer;
        const transfer = s.transfers.find(t => t.id === trId);
        if (!transfer) return;

        transfer.status = 'Approved';

        /* Update the asset */
        const asset = s.assets.find(a => a.tag === transfer.assetTag);
        if (asset) {
          asset.status = 'Allocated';
          asset.holder = transfer.to;
          asset.history.push({
            date: AF.todayISO(),
            action: 'Transferred',
            actor: s.session.name,
            note: `from ${transfer.from} to ${transfer.to}`
          });
        }

        AF.addLog(s.session.name, 'Approved transfer', `${transfer.assetTag} → ${transfer.to}`);
        AF.addNotif(`Transfer approved: ${transfer.assetTag} to ${transfer.to}`, 'Approvals');
        AF.toast(`Transfer approved: ${transfer.assetTag} → ${transfer.to}.`, 'success');
        AF.render();
      };
    });

    /* ── Return asset button ──────────────────────────────────── */
    const returnBtn = document.getElementById('returnAssetBtn');
    if (returnBtn) {
      returnBtn.onclick = () => {
        const assetId = document.getElementById('returnAssetSelect')?.value;
        const note = document.getElementById('returnConditionNote')?.value?.trim();

        if (!assetId) {
          AF.toast('Please select an asset to return.', 'warning');
          return;
        }

        const asset = s.assets.find(a => a.id === assetId);
        if (!asset) {
          AF.toast('Asset not found.', 'error');
          return;
        }

        const prevHolder = asset.holder;
        asset.status = 'Available';
        asset.holder = '—';
        asset.history.push({
          date: AF.todayISO(),
          action: 'Returned',
          actor: s.session.name,
          note: `condition: ${note || 'not specified'}`
        });

        AF.addLog(s.session.name, 'Returned asset', `${asset.tag} from ${prevHolder}`);
        AF.addNotif(`${asset.tag} returned to inventory by ${prevHolder}`, 'Approvals');
        AF.toast(`${asset.tag} returned to Available status.`, 'success');
        AF.render();
      };
    }
  }
};
