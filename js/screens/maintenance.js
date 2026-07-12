/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Maintenance Kanban Screen
   ═══════════════════════════════════════════════════════════════════ */

const MAINT_STAGES = ['Pending', 'Approved', 'Technician Assigned', 'In Progress', 'Resolved'];

AF.ScreenMaintenance = {
  dragData: null,

  render() {
    const canApprove = ['Admin', 'Asset Manager'].includes(AF.state.session.role);

    const priorityDot = (p) => {
      const colors = { Critical: 'var(--af-rose)', High: 'var(--af-amber)', Medium: 'var(--af-gold)', Low: 'var(--af-emerald)' };
      const pulse = p === 'Critical' ? 'af-pulse-dot' : '';
      return `<span class="af-priority-dot ${pulse}" style="background:${colors[p] || 'var(--af-text-muted)'};" title="${p} priority"></span>`;
    };

    return `
    <div class="af-page-enter">
      <div class="af-breadcrumb">My Account / AssetFlow / Maintenance</div>
      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">Maintenance Pipeline</h1>
          <p class="af-page-sub">Drag cards between columns to advance workflow. Resolving returns asset to Available.</p>
        </div>
        <button class="af-btn af-btn-primary" id="raiseMaintBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Raise Request
        </button>
      </div>

      <div class="af-kanban" id="kanbanBoard">
        ${MAINT_STAGES.map(stage => {
          const cards = AF.state.maintenance.filter(m => m.stage === stage);
          const colClass = stage === 'Resolved' ? 'af-kanban-col-resolved' : '';
          return `
          <div class="af-kanban-col ${colClass}" data-stage="${stage}" id="kanban-${stage.replace(/\s+/g, '-')}">
            <div class="af-kanban-col-header">
              <h4>${stage}</h4>
              <span class="af-kanban-count">${cards.length}</span>
            </div>
            <div class="af-kanban-cards" data-drop-stage="${stage}">
              ${cards.map(m => `
                <div class="af-kanban-card" draggable="true" data-card-id="${m.id}">
                  <div class="af-kanban-card-top">
                    <span class="af-tag-chip">${m.assetTag}</span>
                    ${priorityDot(m.priority)}
                  </div>
                  <div class="af-kanban-card-issue">${m.issue}</div>
                  <div class="af-kanban-card-meta">
                    <span class="af-text-mono">${m.id}</span>
                    ${m.technician ? `<span>· ${m.technician}</span>` : ''}
                  </div>
                  <div class="af-kanban-card-actions">
                    ${this.renderActions(m, canApprove)}
                  </div>
                </div>
              `).join('') || `<div class="af-kanban-empty">No tickets</div>`}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  },

  renderActions(m, canApprove) {
    if (m.stage === 'Pending' && canApprove) {
      return `
        <button class="af-btn af-btn-sm af-btn-success" data-maint-advance="${m.id}|Approved">Approve</button>
        <button class="af-btn af-btn-sm af-btn-danger" data-maint-advance="${m.id}|Rejected">Reject</button>`;
    }
    if (m.stage === 'Approved') {
      return `<button class="af-btn af-btn-sm" data-maint-assign="${m.id}">Assign Technician</button>`;
    }
    if (m.stage === 'Technician Assigned') {
      return `<button class="af-btn af-btn-sm" data-maint-advance="${m.id}|In Progress">Start Work</button>`;
    }
    if (m.stage === 'In Progress') {
      return `<button class="af-btn af-btn-sm af-btn-success" data-maint-advance="${m.id}|Resolved">Mark Resolved</button>`;
    }
    if (m.stage === 'Resolved') {
      return `<span class="af-badge af-badge-verified">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
        Done
      </span>`;
    }
    return '';
  },

  bind() {
    /* Raise request button */
    const raiseBtn = document.getElementById('raiseMaintBtn');
    if (raiseBtn) raiseBtn.onclick = () => AF.openModal('raiseMaintenance');

    /* Stage advance buttons */
    document.querySelectorAll('[data-maint-advance]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        const [id, stage] = el.dataset.maintAdvance.split('|');
        this.advanceTicket(id, stage);
      };
    });

    /* Assign technician buttons */
    document.querySelectorAll('[data-maint-assign]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        AF.openModal('assignTechnician', el.dataset.maintAssign);
      };
    });

    /* Drag and drop */
    this.setupDragDrop();
  },

  advanceTicket(id, stage) {
    const m = AF.state.maintenance.find(x => x.id === id);
    if (!m) return;

    m.stage = stage;
    const asset = AF.state.assets.find(a => a.tag === m.assetTag);

    if (stage === 'Approved' && asset) {
      asset.status = 'Under Maintenance';
    }
    if (stage === 'Resolved' && asset) {
      asset.status = 'Available';
      asset.maint.unshift({
        ticket: m.id, issue: m.issue, cost: 0,
        tech: m.technician, stage: 'Resolved'
      });
    }

    AF.addLog(AF.state.session.name, 'Updated maintenance ticket', `${m.id} → ${stage}`);
    AF.addNotif(`Maintenance ${m.id} ${stage.toLowerCase()}`, 'Approvals');
    AF.toast(`${m.id} moved to ${stage}.`);
  },

  setupDragDrop() {
    const cards = document.querySelectorAll('.af-kanban-card[draggable]');
    const dropZones = document.querySelectorAll('[data-drop-stage]');

    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        this.dragData = card.dataset.cardId;
        card.classList.add('af-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.cardId);
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('af-dragging');
        document.querySelectorAll('.af-kanban-col-dragover').forEach(el =>
          el.classList.remove('af-kanban-col-dragover')
        );
      });
    });

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.closest('.af-kanban-col').classList.add('af-kanban-col-dragover');
      });

      zone.addEventListener('dragleave', (e) => {
        if (!zone.contains(e.relatedTarget)) {
          zone.closest('.af-kanban-col').classList.remove('af-kanban-col-dragover');
        }
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain') || this.dragData;
        const newStage = zone.dataset.dropStage;
        zone.closest('.af-kanban-col').classList.remove('af-kanban-col-dragover');

        if (cardId && newStage) {
          const ticket = AF.state.maintenance.find(m => m.id === cardId);
          if (ticket && ticket.stage !== newStage) {
            this.advanceTicket(cardId, newStage);
          }
        }
      });
    });
  }
};
