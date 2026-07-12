/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Auth Screen (Login / Sign Up)
   ═══════════════════════════════════════════════════════════════════ */

AF.ScreenAuth = {

  render() {
    const s = AF.state;
    const isLogin = s.authTab === 'login';

    const demoRoles = [
      { role: 'Admin',           icon: '🛡️', desc: 'Full system access' },
      { role: 'Asset Manager',   icon: '📦', desc: 'Manage inventory & allocation' },
      { role: 'Department Head', icon: '👥', desc: 'Approve dept requests' },
      { role: 'Employee',        icon: '💼', desc: 'View assets & bookings' }
    ];

    return `
    <div class="af-auth-wrap">
      <canvas id="particleCanvas" class="af-auth-canvas"></canvas>

      <div class="af-auth-shell">
        <!-- Left: Decorative Banner -->
        <div class="af-auth-banner">
          <div class="af-auth-banner-content">
            <img src="assets/logo.png" alt="AssetFlow" class="af-auth-logo" />
            <h1 class="af-auth-brand">AssetFlow</h1>
            <p class="af-auth-tagline">Enterprise Asset &amp; Resource Management</p>
            <div class="af-auth-features">
              <span class="af-auth-feature-tag">📊 Real-time Dashboard</span>
              <span class="af-auth-feature-tag">🔄 Smart Allocation</span>
              <span class="af-auth-feature-tag">🗓️ Resource Booking</span>
              <span class="af-auth-feature-tag">🔧 Maintenance Tracking</span>
              <span class="af-auth-feature-tag">📋 Audit Compliance</span>
              <span class="af-auth-feature-tag">📈 Analytics &amp; Reports</span>
            </div>
            <p class="af-auth-version">v2.0 — SaaS ERP Platform</p>
          </div>
        </div>

        <!-- Right: Auth Form -->
        <div class="af-auth-form">
          <div class="af-auth-form-inner">
            <div class="af-tabs af-auth-tabs">
              <button class="af-tab ${isLogin ? 'active' : ''}" data-auth-tab="login">Login</button>
              <button class="af-tab ${!isLogin ? 'active' : ''}" data-auth-tab="signup">Sign Up</button>
            </div>

            ${isLogin ? `
            <!-- Login Form -->
            <form id="loginForm" class="af-auth-fields" autocomplete="off">
              <div class="af-field">
                <label class="af-label">Email address</label>
                <input type="email" id="authEmail" class="af-input" placeholder="you@company.com" value="admin@assetflow.io" />
              </div>
              <div class="af-field">
                <label class="af-label">Password</label>
                <input type="password" id="authPassword" class="af-input" placeholder="Enter your password" value="demo1234" />
              </div>
              <button type="submit" class="af-btn af-btn-primary af-btn-block" id="loginBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Sign In
              </button>
            </form>

            <div class="af-auth-divider">
              <span>or try a demo role</span>
            </div>

            <div class="af-auth-demo-roles">
              ${demoRoles.map(d => `
                <button class="af-demo-chip" data-demo-role="${d.role}">
                  <span class="af-demo-chip-icon">${d.icon}</span>
                  <span class="af-demo-chip-info">
                    <span class="af-demo-chip-role">${d.role}</span>
                    <span class="af-demo-chip-desc">${d.desc}</span>
                  </span>
                </button>
              `).join('')}
            </div>
            ` : `
            <!-- Signup Form -->
            <form id="signupForm" class="af-auth-fields" autocomplete="off">
              <div class="af-field">
                <label class="af-label">Full name</label>
                <input type="text" id="signupName" class="af-input" placeholder="Your full name" />
              </div>
              <div class="af-field">
                <label class="af-label">Email address</label>
                <input type="email" id="signupEmail" class="af-input" placeholder="you@company.com" />
              </div>
              <div class="af-field-row">
                <div class="af-field">
                  <label class="af-label">Password</label>
                  <input type="password" id="signupPassword" class="af-input" placeholder="Min 6 characters" />
                </div>
                <div class="af-field">
                  <label class="af-label">Confirm password</label>
                  <input type="password" id="signupConfirm" class="af-input" placeholder="Re-enter password" />
                </div>
              </div>
              <button type="submit" class="af-btn af-btn-primary af-btn-block" id="signupBtn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                Create Account
              </button>
            </form>
            `}

            <p class="af-auth-footer-text">
              By continuing you agree to AssetFlow's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>`;
  },

  bind() {
    const s = AF.state;

    /* ── Tab switching ─────────────────────────────────────────── */
    document.querySelectorAll('[data-auth-tab]').forEach(tab => {
      tab.onclick = () => {
        s.authTab = tab.dataset.authTab;
        AF.render();
      };
    });

    /* ── Demo role chip click ──────────────────────────────────── */
    document.querySelectorAll('[data-demo-role]').forEach(chip => {
      chip.onclick = () => {
        const role = chip.dataset.demoRole;
        const emp = s.employees.find(e => e.role === role) || s.employees[0];
        s.session = {
          name: emp.name,
          email: emp.email,
          role: emp.role,
          deptId: emp.dept
        };
        s.screen = 'dashboard';
        AF.render();
        AF.toast(`Welcome, ${emp.name}! Logged in as ${role}.`, 'success');
      };
    });

    /* ── Login form submission ─────────────────────────────────── */
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value.trim().toLowerCase();
        const password = document.getElementById('authPassword').value;

        if (!email) {
          AF.toast('Please enter your email address.', 'warning');
          return;
        }
        if (!password) {
          AF.toast('Please enter your password.', 'warning');
          return;
        }

        const emp = s.employees.find(em => em.email.toLowerCase() === email);
        if (!emp) {
          AF.toast('No account found with that email. Try a demo role instead.', 'error');
          return;
        }

        s.session = {
          name: emp.name,
          email: emp.email,
          role: emp.role,
          deptId: emp.dept
        };
        s.screen = 'dashboard';
        AF.addLog(emp.name, 'Signed in', emp.role);
        AF.render();
        AF.toast(`Welcome back, ${emp.name.split(' ')[0]}!`, 'success');
      };
    }

    /* ── Signup form submission ────────────────────────────────── */
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
      signupForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim().toLowerCase();
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;

        if (!name) {
          AF.toast('Please enter your full name.', 'warning');
          return;
        }
        if (!email) {
          AF.toast('Please enter your email address.', 'warning');
          return;
        }
        if (password.length < 6) {
          AF.toast('Password must be at least 6 characters.', 'warning');
          return;
        }
        if (password !== confirm) {
          AF.toast('Passwords do not match.', 'error');
          return;
        }

        const exists = s.employees.find(em => em.email.toLowerCase() === email);
        if (exists) {
          AF.toast('An account with this email already exists.', 'error');
          return;
        }

        const newEmp = {
          id: AF.uid('e'),
          name,
          email,
          dept: 'IT',
          role: 'Employee',
          status: 'Active'
        };
        s.employees.push(newEmp);

        s.session = {
          name: newEmp.name,
          email: newEmp.email,
          role: newEmp.role,
          deptId: newEmp.dept
        };
        s.screen = 'dashboard';
        AF.addLog(newEmp.name, 'Created account', newEmp.email);
        AF.addNotif(`New employee registered: ${newEmp.name}`, 'Approvals');
        AF.render();
        AF.toast(`Account created! Welcome, ${name.split(' ')[0]}.`, 'success');
      };
    }

    /* ── Initialize particle canvas ───────────────────────────── */
    setTimeout(() => AF.Particles.init('particleCanvas'), 100);
  }
};
