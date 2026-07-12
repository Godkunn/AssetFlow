/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Modal Component
   ═══════════════════════════════════════════════════════════════════ */

AF.Modal = {
  render() {
    const m = AF.state.modal;
    if (!m) return '';

    let title = '', body = '', footLabel = 'Save';

    switch (m.type) {
      case 'terms':
        title = 'Terms of Service';
        body = `
          <div style="font-size: 13px; line-height: 1.6; max-height: 400px; overflow-y: auto; padding-right: 8px; color: var(--af-text-secondary);">
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">1. Acceptance of Terms</h4>
            <p style="margin-bottom: 16px;">Welcome to AssetFlow. By accessing or using our SaaS platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
            
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">2. User Accounts</h4>
            <p style="margin-bottom: 16px;">You must maintain the security of your account and credentials. You are fully responsible for all activities that occur under your account.</p>
            
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">3. Service Restrictions</h4>
            <p style="margin-bottom: 16px;">You agree not to modify, reverse engineer, or exploit any portion of the AssetFlow software or network services.</p>
            
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">4. Limitation of Liability</h4>
            <p style="margin-bottom: 8px;">AssetFlow is provided "as is" without warranty of any kind. We shall not be liable for any direct or indirect damages arising out of your use of the platform.</p>
          </div>`;
        footLabel = 'Close';
        break;

      case 'privacy':
        title = 'Privacy Policy';
        body = `
          <div style="font-size: 13px; line-height: 1.6; max-height: 400px; overflow-y: auto; padding-right: 8px; color: var(--af-text-secondary);">
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">1. Information We Collect</h4>
            <p style="margin-bottom: 16px;">We collect basic account details including name, email address, department, and role to facilitate asset logging and resource allocation within your organization.</p>
            
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">2. How We Use Information</h4>
            <p style="margin-bottom: 16px;">Your data is used solely to authenticate your session, generate activity feeds, manage maintenance assignments, and track asset handovers.</p>
            
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">3. Data Security</h4>
            <p style="margin-bottom: 16px;">We implement standard physical and electronic security measures to safeguard your information from unauthorized access, loss, or misuse.</p>
            
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">4. Cookies &amp; Tracking</h4>
            <p style="margin-bottom: 8px;">We use local browser storage and session cookies solely to preserve your login session and theme preferences.</p>
          </div>`;
        footLabel = 'Close';
        break;

      case 'dmca':
        title = 'DMCA Copyright Policy';
        body = `
          <div style="font-size: 13px; line-height: 1.6; max-height: 400px; overflow-y: auto; padding-right: 8px; color: var(--af-text-secondary);">
            <h4 style="color: var(--af-text-primary); margin-bottom: 8px;">DMCA Compliance Notice</h4>
            <p style="margin-bottom: 16px;">We respect intellectual property rights. If you believe that any material on our platform infringes your copyright, please submit a formal DMCA notice to copyright@assetflow.io with the following details:</p>
            <ul style="margin-bottom: 16px; padding-left: 20px;">
              <li style="margin-bottom: 6px;">Identification of the copyrighted work claimed to be infringed.</li>
              <li style="margin-bottom: 6px;">Location of the infringing material on our platform.</li>
              <li style="margin-bottom: 6px;">Your contact details (email, address, phone number).</li>
              <li style="margin-bottom: 6px;">A statement of good faith belief and accuracy under penalty of perjury.</li>
            </ul>
            <p style="margin-bottom: 8px;">Upon receipt of a valid notice, we will remove or disable access to the infringing material in accordance with the Digital Millennium Copyright Act.</p>
          </div>`;
        footLabel = 'Close';
        break;

      case 'contact':
        title = 'Contact Support';
        body = `
          <div class="af-stack">
            <p style="font-size: 13px; color: var(--af-text-secondary); margin-bottom: 8px;">Need help with your AssetFlow workspace? Fill out this quick form, and our support team will get back to you shortly.</p>
            <div class="af-field">
              <label class="af-label">Subject</label>
              <input class="af-input" id="mSupportSubject" placeholder="e.g. Booking conflict resolution" required />
            </div>
            <div class="af-field">
              <label class="af-label">Message Details</label>
              <textarea class="af-textarea" id="mSupportMessage" rows="4" placeholder="Describe the issue you're facing..." required></textarea>
            </div>
          </div>`;
        footLabel = 'Submit Ticket';
        break;

      case 'addDept':
        title = 'Create Department';
        body = `
          <div class="af-field">
            <label class="af-label">Department name</label>
            <input class="af-input" id="mDeptName" placeholder="e.g. Marketing" />
          </div>
          <div class="af-field-row">
            <div class="af-field">
              <label class="af-label">Department head</label>
              <select class="af-select" id="mDeptHead">
                ${AF.state.employees.map(e => `<option>${e.name}</option>`).join('')}
              </select>
            </div>
            <div class="af-field">
              <label class="af-label">Parent department</label>
              <select class="af-select" id="mDeptParent">
                <option value="—">None</option>
                ${AF.state.departments.map(d => `<option>${d.name}</option>`).join('')}
              </select>
            </div>
          </div>`;
        break;

      case 'addEmployee':
        title = 'Add Employee';
        body = `
          <div class="af-field">
            <label class="af-label">Full name</label>
            <input class="af-input" id="mEmpName" placeholder="e.g. Priya Shah" />
          </div>
          <div class="af-field">
            <label class="af-label">Email address</label>
            <input type="email" class="af-input" id="mEmpEmail" placeholder="e.g. priya.shah@company.com" />
          </div>
          <div class="af-field-row">
            <div class="af-field">
              <label class="af-label">Department</label>
              <select class="af-select" id="mEmpDept">
                ${AF.state.departments.map(d => `<option>${d.name}</option>`).join('')}
              </select>
            </div>
            <div class="af-field">
              <label class="af-label">Role</label>
              <select class="af-select" id="mEmpRole">
                <option>Employee</option>
                <option>Department Head</option>
                <option>Asset Manager</option>
                <option>Admin</option>
              </select>
            </div>
          </div>`;
        break;

      case 'addCat':
        title = 'Add Asset Category';
        body = `
          <div class="af-field">
            <label class="af-label">Category name</label>
            <input class="af-input" id="mCatName" placeholder="e.g. Tools" />
          </div>
          <div class="af-field">
            <label class="af-label">Custom field (optional)</label>
            <input class="af-input" id="mCatField" placeholder="e.g. Calibration due date" />
          </div>`;
        break;

      case 'registerAsset':
        title = 'Register New Asset';
        body = `
          <div class="af-field-row">
            <div class="af-field">
              <label class="af-label">Asset name</label>
              <input class="af-input" id="mAssetName" placeholder="e.g. MacBook Pro 14''" />
            </div>
            <div class="af-field">
              <label class="af-label">Category</label>
              <select class="af-select" id="mAssetCat">
                ${AF.state.categories.map(c => `<option>${c.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="af-field-row">
            <div class="af-field">
              <label class="af-label">Serial number</label>
              <input class="af-input" id="mAssetSerial" placeholder="SN-xxxxx" />
            </div>
            <div class="af-field">
              <label class="af-label">Acquisition date</label>
              <input type="date" class="af-input" id="mAssetDate" value="${AF.todayISO()}" />
            </div>
          </div>
          <div class="af-field-row">
            <div class="af-field">
              <label class="af-label">Acquisition cost (₹)</label>
              <input type="number" class="af-input" id="mAssetCost" placeholder="0" />
            </div>
            <div class="af-field">
              <label class="af-label">Condition</label>
              <select class="af-select" id="mAssetCondition">
                <option>Good</option><option>Fair</option><option>Worn</option>
              </select>
            </div>
          </div>
          <div class="af-field-row">
            <div class="af-field">
              <label class="af-label">Location</label>
              <input class="af-input" id="mAssetLocation" placeholder="e.g. HQ Floor 2" />
            </div>
            <div class="af-field">
              <label class="af-label">Shared / bookable?</label>
              <select class="af-select" id="mAssetShared">
                <option value="no">No</option><option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <div class="af-hint">Asset tag is auto-generated (AF-xxxx) on save.</div>`;
        break;

      case 'raiseMaintenance':
        title = 'Raise Maintenance Request';
        body = `
          <div class="af-field">
            <label class="af-label">Asset</label>
            <select class="af-select" id="mMaintAsset">
              ${AF.state.assets.map(a => `<option value="${a.tag}">${a.tag} — ${a.name}</option>`).join('')}
            </select>
          </div>
          <div class="af-field">
            <label class="af-label">Describe the issue</label>
            <textarea class="af-textarea" id="mMaintIssue" rows="3" placeholder="What's wrong?"></textarea>
          </div>
          <div class="af-field">
            <label class="af-label">Priority</label>
            <select class="af-select" id="mMaintPriority">
              <option>Low</option><option selected>Medium</option><option>High</option><option>Critical</option>
            </select>
          </div>`;
        break;

      case 'newAudit':
        title = 'Create Audit Cycle';
        body = `
          <div class="af-field-row">
            <div class="af-field">
              <label class="af-label">Scope (department)</label>
              <select class="af-select" id="mAuditScope">
                ${AF.state.departments.map(d => `<option>${d.name}</option>`).join('')}
              </select>
            </div>
            <div class="af-field">
              <label class="af-label">Date range</label>
              <input class="af-input" id="mAuditRange" placeholder="e.g. 16–30 Jul" />
            </div>
          </div>
          <div class="af-field">
            <label class="af-label">Assign auditors (comma separated)</label>
            <input class="af-input" id="mAuditors" placeholder="e.g. A. Rao, K. Bose" />
          </div>`;
        break;

      case 'assignTechnician':
        title = 'Assign Technician';
        body = `
          <div class="af-field">
            <label class="af-label">Technician name</label>
            <input class="af-input" id="mTechName" placeholder="e.g. R. Varma" value="R. Varma" />
          </div>`;
        break;

      default:
        title = 'Dialog';
        body = '<p>No content</p>';
    }

    return `
    <div class="af-modal-backdrop" id="modalBackdrop">
      <div class="af-modal af-modal-enter">
        <div class="af-modal-header">
          <h3 class="af-modal-title">${title}</h3>
          <button class="af-modal-close" id="modalCloseBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="af-modal-body">${body}</div>
        <div class="af-modal-footer">
          <button class="af-btn af-btn-ghost" id="modalCancelBtn">Cancel</button>
          <button class="af-btn af-btn-primary" id="modalSaveBtn">${footLabel}</button>
        </div>
      </div>
    </div>`;
  },

  bind() {
    const backdrop = document.getElementById('modalBackdrop');
    if (backdrop) {
      backdrop.addEventListener('mousedown', (e) => {
        if (e.target === backdrop) AF.closeModal();
      });
    }
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.onclick = () => AF.closeModal();

    const cancelBtn = document.getElementById('modalCancelBtn');
    if (cancelBtn) cancelBtn.onclick = () => AF.closeModal();

    const saveBtn = document.getElementById('modalSaveBtn');
    if (saveBtn) saveBtn.onclick = () => this.handleSave();
  },

  handleSave() {
    const m = AF.state.modal;
    if (!m) return;

    switch (m.type) {
      case 'terms':
      case 'privacy':
      case 'dmca':
        AF.closeModal();
        break;

      case 'contact': {
        const subject = document.getElementById('mSupportSubject').value.trim();
        const msg = document.getElementById('mSupportMessage').value.trim();
        if (!subject || !msg) { AF.toast('Please fill out the form fields.', 'error'); return; }
        AF.toast('Support ticket submitted successfully!', 'success');
        AF.closeModal();
        break;
      }

      case 'addDept': {
        const name = document.getElementById('mDeptName').value.trim();
        if (!name) { AF.toast('Enter a department name.', 'error'); return; }
        AF.state.departments.push({
          id: AF.uid('d'), name,
          head: document.getElementById('mDeptHead').value,
          parent: document.getElementById('mDeptParent').value,
          status: 'Active'
        });
        AF.addLog(AF.state.session.name, 'Created department', name);
        AF.toast('Department created successfully.');
        break;
      }

      case 'addEmployee': {
        const name = document.getElementById('mEmpName').value.trim();
        const email = document.getElementById('mEmpEmail').value.trim();
        if (!name || !email) { AF.toast('Enter name and email.', 'error'); return; }
        AF.state.employees.push({
          id: AF.uid('e'),
          name,
          email,
          dept: document.getElementById('mEmpDept').value,
          role: document.getElementById('mEmpRole').value,
          status: 'Active'
        });
        AF.addLog(AF.state.session.name, 'Added employee', name);
        AF.toast('Employee added successfully.');
        break;
      }

      case 'addCat': {
        const name = document.getElementById('mCatName').value.trim();
        if (!name) { AF.toast('Enter a category name.', 'error'); return; }
        AF.state.categories.push({
          id: AF.uid('c'), name,
          extra: document.getElementById('mCatField').value || '—'
        });
        AF.addLog(AF.state.session.name, 'Created category', name);
        AF.toast('Category added successfully.');
        break;
      }

      case 'registerAsset': {
        const name = document.getElementById('mAssetName').value.trim();
        if (!name) { AF.toast('Enter an asset name.', 'error'); return; }
        const tagNum = AF.state.assets.length + 1;
        const tag = 'AF-' + String(tagNum).padStart(4, '0');
        AF.state.assets.push({
          id: AF.uid('a'), tag, name,
          category: document.getElementById('mAssetCat').value,
          serial: document.getElementById('mAssetSerial').value || '—',
          acqDate: document.getElementById('mAssetDate').value,
          cost: Number(document.getElementById('mAssetCost').value) || 0,
          condition: document.getElementById('mAssetCondition').value,
          location: document.getElementById('mAssetLocation').value || 'Unassigned',
          shared: document.getElementById('mAssetShared').value === 'yes',
          status: 'Available', holder: '—', history: [], maint: []
        });
        AF.addLog(AF.state.session.name, 'Registered asset', `${tag} — ${name}`);
        AF.addNotif(`New asset registered: ${tag}`, 'Approvals');
        AF.toast(`${tag} registered as Available.`);
        break;
      }

      case 'raiseMaintenance': {
        const issue = document.getElementById('mMaintIssue').value.trim();
        if (!issue) { AF.toast('Describe the issue first.', 'error'); return; }
        const id = 'MT-' + String(20 + AF.state.maintenance.length + 1).padStart(3, '0');
        AF.state.maintenance.unshift({
          id,
          assetTag: document.getElementById('mMaintAsset').value,
          issue,
          priority: document.getElementById('mMaintPriority').value,
          stage: 'Pending',
          technician: ''
        });
        AF.addLog(AF.state.session.name, 'Raised maintenance request', id);
        AF.addNotif(`Maintenance request ${id} raised`, 'Approvals');
        AF.toast('Maintenance request submitted for approval.');
        break;
      }

      case 'newAudit': {
        const scope = document.getElementById('mAuditScope').value;
        const range = document.getElementById('mAuditRange').value || 'TBD';
        const auditors = document.getElementById('mAuditors').value
          .split(',').map(s => s.trim()).filter(Boolean);
        AF.state.audits.unshift({
          id: AF.uid('AC'),
          name: `Audit — ${scope}`,
          scope,
          dateRange: range,
          auditors: auditors.length ? auditors : ['Unassigned'],
          items: AF.state.assets.slice(0, 3).map(a => ({
            tag: a.tag, expected: a.location, verdict: 'Verified'
          })),
          closed: false
        });
        AF.addLog(AF.state.session.name, 'Created audit cycle', `${scope} (${range})`);
        AF.toast('Audit cycle created.');
        break;
      }

      case 'assignTechnician': {
        const tech = document.getElementById('mTechName').value.trim();
        if (!tech) { AF.toast('Enter a technician name.', 'error'); return; }
        const ticket = AF.state.maintenance.find(x => x.id === m.payload);
        if (ticket) {
          ticket.technician = tech;
          ticket.stage = 'Technician Assigned';
          AF.addLog(AF.state.session.name, 'Assigned technician', `${ticket.id} → ${tech}`);
          AF.toast(`${tech} assigned to ${ticket.id}.`);
        }
        break;
      }
    }

    AF.closeModal();
  }
};
