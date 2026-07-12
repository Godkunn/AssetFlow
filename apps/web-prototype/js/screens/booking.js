/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Resource Booking Screen
   ═══════════════════════════════════════════════════════════════════ */

let bookingState = { resourceTag: 'RM-B2', date: null, pendingRequest: null };

AF.ScreenBooking = {
  render() {
    if (!bookingState.date) bookingState.date = AF.todayISO();
    const resource = AF.state.assets.find(a => a.tag === bookingState.resourceTag);
    const dayBookings = AF.state.bookings.filter(b =>
      b.resourceTag === bookingState.resourceTag &&
      b.date === bookingState.date &&
      b.status !== 'Cancelled'
    );

    const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    return `
    <div class="af-page">
      <nav class="af-breadcrumb">
        <span class="af-breadcrumb-item">My Account</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item">AssetFlow</span>
        <span class="af-breadcrumb-sep">/</span>
        <span class="af-breadcrumb-item active">Booking</span>
      </nav>
      <div class="af-page-header">
        <div>
          <h1 class="af-page-title">Resource Booking</h1>
          <p class="af-page-subtitle">Time-slot booking with automatic overlap validation.</p>
        </div>
      </div>

      <div class="af-filter-bar">
        <select class="af-select" id="resourceSelect" style="width:auto;min-width:220px;">
          ${AF.state.assets.filter(a => a.shared).map(a =>
            `<option value="${a.tag}" ${bookingState.resourceTag === a.tag ? 'selected' : ''}>${a.tag} — ${a.name}</option>`
          ).join('')}
        </select>
        <input type="date" class="af-input" id="bookingDate" value="${bookingState.date}" style="width:auto;" />
      </div>

      <div class="af-grid-2col">
        <div class="af-card">
          <div class="af-card-header">
            <h3>${resource ? resource.name : 'Select resource'} · ${AF.formatDate(bookingState.date)}</h3>
          </div>
          <div class="af-card-body">
            <div style="display:flex;gap:16px;font-size:12px;color:var(--af-text-muted);margin-bottom:16px;">
              <div><span class="af-legend-dot" style="background:var(--af-teal);"></span>Booked</div>
              <div><span class="af-legend-dot af-legend-conflict"></span>Conflict</div>
            </div>
            <div class="af-timeline">
              ${hours.map(h => `
                <div class="af-timeline-hour">
                  <span class="af-timeline-label">${String(h).padStart(2, '0')}:00</span>
                </div>
              `).join('')}
              ${dayBookings.map(b => this.renderSlot(b, false)).join('')}
              ${bookingState.pendingRequest && bookingState.pendingRequest.conflict
                ? this.renderSlot(bookingState.pendingRequest, true) : ''}
            </div>
          </div>
        </div>

        <div class="af-card">
          <div class="af-card-header">
            <h3>Book a Slot</h3>
          </div>
          <div class="af-card-body">
            <div class="af-field">
              <label class="af-label">Start time</label>
              <input type="time" class="af-input" id="bookStart" value="10:00" />
            </div>
            <div class="af-field">
              <label class="af-label">End time</label>
              <input type="time" class="af-input" id="bookEnd" value="11:00" />
            </div>
            <div class="af-field">
              <label class="af-label">Booked by</label>
              <input class="af-input" id="bookBy" value="${AF.state.session.name}" />
            </div>

            ${bookingState.pendingRequest && bookingState.pendingRequest.conflict ? `
              <div class="af-alert af-alert-danger">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <span>Requested ${bookingState.pendingRequest.start}–${bookingState.pendingRequest.end} conflicts with an existing booking.</span>
              </div>
            ` : ''}

            <button class="af-btn af-btn-primary" id="bookSlotBtn" style="width:100%;justify-content:center;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Book Slot
            </button>
          </div>

          <div class="af-card-header" style="border-top:1px solid var(--af-border);margin-top:8px;">
            <h3>Upcoming Bookings</h3>
          </div>
          <div class="af-card-body">
            ${AF.state.bookings.filter(b => b.status !== 'Cancelled').length
              ? AF.state.bookings.filter(b => b.status !== 'Cancelled').map(b => `
                <div class="af-activity-item">
                  <div>
                    <span class="af-tag-chip">${b.resourceTag}</span>
                    <span style="margin-left:8px;">${AF.formatDate(b.date)}, ${b.start} to ${b.end}</span>
                  </div>
                  <div class="af-activity-meta">
                    ${b.by} · <span class="${AF.badgeClass(b.status)}">${b.status}</span>
                  </div>
                  ${b.status === 'Upcoming' ? `
                    <button class="af-btn af-btn-danger af-btn-sm" style="margin-top:6px;" data-cancel-booking="${b.id}">Cancel</button>
                  ` : ''}
                </div>
              `).join('')
              : '<div class="af-hint">No upcoming bookings.</div>'
            }
          </div>
        </div>
      </div>
    </div>`;
  },

  renderSlot(b, isConflict) {
    const top = (AF.timeToMin(b.start) - 8 * 60) / 60 * 52;
    const height = Math.max((AF.timeToMin(b.end) - AF.timeToMin(b.start)) / 60 * 52, 30);
    const cls = isConflict ? 'af-slot-conflict' : 'af-slot-booked';
    const label = isConflict ? 'Conflict' : 'Booked';
    return `<div class="${cls}" style="top:${top}px;height:${height}px;">
      ${label}: ${b.by || ''} (${b.start} to ${b.end})
    </div>`;
  },

  bind() {
    const resSelect = document.getElementById('resourceSelect');
    if (resSelect) resSelect.onchange = () => {
      bookingState.resourceTag = resSelect.value;
      bookingState.pendingRequest = null;
      AF.render();
    };

    const dateInput = document.getElementById('bookingDate');
    if (dateInput) dateInput.onchange = () => {
      bookingState.date = dateInput.value;
      bookingState.pendingRequest = null;
      AF.render();
    };

    const bookBtn = document.getElementById('bookSlotBtn');
    if (bookBtn) bookBtn.onclick = () => {
      const start = document.getElementById('bookStart').value;
      const end = document.getElementById('bookEnd').value;
      const by = document.getElementById('bookBy').value || AF.state.session.name;

      if (!start || !end || AF.timeToMin(end) <= AF.timeToMin(start)) {
        AF.toast('Pick a valid start/end time.', 'error');
        return;
      }

      const overlap = AF.state.bookings.some(b =>
        b.resourceTag === bookingState.resourceTag &&
        b.date === bookingState.date &&
        b.status !== 'Cancelled' &&
        AF.timeToMin(start) < AF.timeToMin(b.end) &&
        AF.timeToMin(end) > AF.timeToMin(b.start)
      );

      if (overlap) {
        bookingState.pendingRequest = { start, end, by, conflict: true };
        AF.render();
        AF.toast('That slot overlaps an existing booking.', 'error');
        return;
      }

      const resource = AF.state.assets.find(a => a.tag === bookingState.resourceTag);
      AF.state.bookings.unshift({
        id: AF.uid('bk'),
        resourceTag: bookingState.resourceTag,
        resourceName: resource ? resource.name : bookingState.resourceTag,
        date: bookingState.date,
        start, end, by,
        status: 'Upcoming'
      });

      if (resource && resource.status === 'Available') resource.status = 'Reserved';
      AF.addLog(by, 'Confirmed booking', `${bookingState.resourceTag}, ${start}–${end}`);
      AF.addNotif(`Booking confirmed: ${bookingState.resourceTag}, ${start}–${end}`, 'Bookings');
      bookingState.pendingRequest = null;
      AF.toast('Slot booked successfully.');
    };

    document.querySelectorAll('[data-cancel-booking]').forEach(el => {
      el.onclick = () => {
        const b = AF.state.bookings.find(x => x.id === el.dataset.cancelBooking);
        if (b) {
          b.status = 'Cancelled';
          AF.addNotif(`Booking cancelled: ${b.resourceTag}, ${b.start}–${b.end}`, 'Bookings');
          AF.toast('Booking cancelled.');
        }
      };
    });
  }
};
