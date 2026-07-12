/* AssetFlow — Auth Screen (Premium Split Screen layout matching mockup) */

AF.ScreenAuth = {
  render() {
    const s = AF.state;
    const isLogin = s.authTab === 'login';

    return `
    <div class="af-auth-split-wrap">
      <!-- LEFT SIDE: Brand Banner & Features -->
      <div class="af-auth-banner-side">
        <!-- Floating 3D cubes decor -->
        <div class="af-decor-cube af-cube-1"></div>
        <div class="af-decor-cube af-cube-2"></div>
        <div class="af-decor-cube af-cube-3"></div>

        <div class="af-banner-header">
          <div class="af-banner-brand">
            <img src="assets/icons/logo.png" alt="AssetFlow" class="af-brand-logo-img" />
            <span class="af-brand-logo-text">AssetFlow</span>
          </div>
        </div>

        <div class="af-banner-content">
          <h1 class="af-banner-title">Smart Asset Management for Every Organization</h1>
          <p class="af-banner-subtitle">Track, allocate, maintain and optimize your assets — all in one powerful platform.</p>

          <!-- Feature List -->
          <div class="af-banner-features">
            <div class="af-feat-item">
              <div class="af-feat-icon icon-tracking">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              </div>
              <div class="af-feat-text">
                <h4 class="af-feat-title">Real-time Tracking</h4>
                <p class="af-feat-desc">Live overview of all assets and status</p>
              </div>
            </div>

            <div class="af-feat-item">
              <div class="af-feat-icon icon-security">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="af-feat-text">
                <h4 class="af-feat-title">Secure & Reliable</h4>
                <p class="af-feat-desc">Enterprise-grade security & role-based access</p>
              </div>
            </div>

            <div class="af-feat-item">
              <div class="af-feat-icon icon-analytics">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              </div>
              <div class="af-feat-text">
                <h4 class="af-feat-title">Powerful Analytics</h4>
                <p class="af-feat-desc">Insights that help you make better decisions</p>
              </div>
            </div>
          </div>

          <!-- Bottom Mock KPI Card -->
          <div class="af-banner-kpi-card">
            <div class="af-kpi-card-left">
              <span class="af-kpi-card-label">Total Assets</span>
              <div class="af-kpi-card-value-row">
                <span class="af-kpi-card-num">2,482</span>
                <span class="af-kpi-card-trend">+12.5%</span>
              </div>
              <!-- Mini Bar Graph Simulation -->
              <div class="af-kpi-mini-bar">
                <div class="bar" style="height: 18px;"></div>
                <div class="bar" style="height: 32px;"></div>
                <div class="bar" style="height: 24px;"></div>
                <div class="bar" style="height: 40px;"></div>
                <div class="bar" style="height: 36px;"></div>
                <div class="bar" style="height: 48px;"></div>
                <div class="bar" style="height: 30px;"></div>
              </div>
            </div>
            <div class="af-kpi-card-right">
              <!-- SVG Donut Chart -->
              <svg width="68" height="68" viewBox="0 0 36 36" class="donut-chart">
                <circle class="donut-bg" cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.06)" stroke-width="4"></circle>
                <circle class="donut-ring segment-available" cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--af-emerald)" stroke-width="4" stroke-dasharray="60 40" stroke-dashoffset="25"></circle>
                <circle class="donut-ring segment-allocated" cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--af-purple-light)" stroke-width="4" stroke-dasharray="25 75" stroke-dashoffset="65"></circle>
                <circle class="donut-ring segment-maint" cx="18" cy="18" r="15.915" fill="transparent" stroke="var(--af-amber)" stroke-width="4" stroke-dasharray="15 85" stroke-dashoffset="90"></circle>
              </svg>
              <div class="donut-legends">
                <div class="legend"><span class="dot" style="background: var(--af-emerald);"></span> Available</div>
                <div class="legend"><span class="dot" style="background: var(--af-purple-light);"></span> Allocated</div>
                <div class="legend"><span class="dot" style="background: var(--af-amber);"></span> Maintenance</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDE: Form Card Viewport -->
      <div class="af-auth-form-side">
        <!-- Floating canvas backgrounds -->
        <canvas id="particleCanvas" class="af-auth-canvas"></canvas>

        <div class="af-auth-card">
          <h2 class="af-card-welcome-title">${isLogin ? 'Welcome back 👋' : 'Create account ✨'}</h2>
          <p class="af-card-welcome-sub">${isLogin ? 'Sign in to your account' : 'Get started with your free account'}</p>

          ${isLogin ? `
          <!-- Login Form -->
          <form id="loginForm" class="af-auth-fields" autocomplete="off">
            <div class="af-field">
              <label class="af-label">Email address</label>
              <div class="af-input-icon-wrapper">
                <span class="icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <input type="email" id="authEmail" class="af-input has-icon-left" placeholder="admin@assetflow.io" value="admin@assetflow.io" required />
              </div>
            </div>

            <div class="af-field" style="margin-bottom: 8px;">
              <label class="af-label">Password</label>
              <div class="af-input-icon-wrapper">
                <input type="password" id="authPassword" class="af-input has-icon-right" placeholder="••••••••••••" value="demo1234" required />
                <button type="button" class="icon-btn-right" id="togglePasswordVisibility" title="Toggle password visibility">
                  <svg id="eyeIcon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>

            <div class="af-auth-remember-row">
              <label class="af-checkbox-label">
                <input type="checkbox" id="authRemember" class="af-checkbox-custom" checked />
                <span>Remember me</span>
              </label>
              <a href="#" class="af-auth-link-primary" id="btnForgotPass">Forgot password?</a>
            </div>

            <button type="submit" class="af-btn af-btn-primary af-btn-block af-btn-gradient-auth" id="loginBtn">
              Sign In
            </button>
          </form>
          ` : `
          <!-- Signup Form -->
          <form id="signupForm" class="af-auth-fields" autocomplete="off">
            <div class="af-field">
              <label class="af-label">Full name</label>
              <input type="text" id="signupName" class="af-input" placeholder="Your full name" required />
            </div>
            <div class="af-field">
              <label class="af-label">Email address</label>
              <input type="email" id="signupEmail" class="af-input" placeholder="name@company.com" required />
            </div>
            <div class="af-field">
              <label class="af-label">Password</label>
              <input type="password" id="signupPassword" class="af-input" placeholder="Min 6 characters" required />
            </div>
            <div class="af-field" style="margin-bottom: 16px;">
              <label class="af-label">Confirm password</label>
              <input type="password" id="signupConfirm" class="af-input" placeholder="Re-enter password" required />
            </div>

            <label class="af-checkbox-label" style="margin-bottom: 20px;">
              <input type="checkbox" id="signupAgree" class="af-checkbox-custom" required />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </label>
            
            <button type="submit" class="af-btn af-btn-primary af-btn-block af-btn-gradient-auth" id="signupBtn">
              Create Account
            </button>
          </form>
          `}

          <!-- Divider -->
          <div class="af-auth-divider-wrap">
            <span class="line"></span>
            <span class="text">or continue with</span>
            <span class="line"></span>
          </div>

          <!-- Social Buttons -->
          <div class="af-auth-social-row">
            <button type="button" class="af-social-btn" id="btnGoogleAuth" title="Sign in with Google">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
              <span>Google</span>
            </button>
            <button type="button" class="af-social-btn" id="btnMicrosoftAuth" title="Sign in with Microsoft">
              <svg width="16" height="16" viewBox="0 0 23 23" fill="currentColor"><rect x="0" y="0" width="11" height="11" fill="#F25022"/><rect x="12" y="0" width="11" height="11" fill="#7FBA00"/><rect x="0" y="12" width="11" height="11" fill="#00A4EF"/><rect x="12" y="12" width="11" height="11" fill="#FFB900"/></svg>
              <span>Microsoft</span>
            </button>
            <button type="button" class="af-social-btn" id="btnGitHubAuth" title="Sign in with GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              <span>GitHub</span>
            </button>
          </div>

          <!-- Switch Mode Footer -->
          <div class="af-auth-switch-footer">
            ${isLogin ? `
              <span>New here? <a href="#" class="af-auth-link-primary" data-auth-tab="signup">Create an account</a></span>
            ` : `
              <span>Already have an account? <a href="#" class="af-auth-link-primary" data-auth-tab="login">Sign In</a></span>
            `}
          </div>

          <!-- Document Footer links -->
          <div class="af-auth-doc-footer">
            <a href="#" class="af-doc-link" id="btnTerms">Terms of Service</a>
            <span class="sep">·</span>
            <a href="#" class="af-doc-link" id="btnPrivacy">Privacy Policy</a>
            <span class="sep">·</span>
            <a href="#" class="af-doc-link" id="btnDmca">DMCA</a>
            <span class="sep">·</span>
            <a href="#" class="af-doc-link" id="btnContact">Contact Support</a>
          </div>
        </div>
      </div>
    </div>`;
  },

  bind() {
    const s = AF.state;

    /* ── Click handlers to toggle view tabs ─────────────────────── */
    document.querySelectorAll('[data-auth-tab]').forEach(tab => {
      tab.onclick = (e) => {
        e.preventDefault();
        s.authTab = tab.dataset.authTab;
        AF.render();
      };
    });

    /* ── Legal / footer links modal triggers ────────────────────── */
    const termsBtn = document.getElementById('btnTerms');
    if (termsBtn) termsBtn.onclick = (e) => { e.preventDefault(); AF.openModal('terms'); };

    const privacyBtn = document.getElementById('btnPrivacy');
    if (privacyBtn) privacyBtn.onclick = (e) => { e.preventDefault(); AF.openModal('privacy'); };

    const dmcaBtn = document.getElementById('btnDmca');
    if (dmcaBtn) dmcaBtn.onclick = (e) => { e.preventDefault(); AF.openModal('dmca'); };

    const contactBtn = document.getElementById('btnContact');
    if (contactBtn) contactBtn.onclick = (e) => { e.preventDefault(); AF.openModal('contact'); };

    const btnForgot = document.getElementById('btnForgotPass');
    if (btnForgot) btnForgot.onclick = (e) => {
      e.preventDefault();
      AF.toast('Password reset link sent to registered email address.', 'info');
    };

    /* ── Password Visibility Toggle ──────────────────────────────── */
    const togglePassBtn = document.getElementById('togglePasswordVisibility');
    const passInput = document.getElementById('authPassword');
    if (togglePassBtn && passInput) {
      togglePassBtn.onclick = () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        
        // Update eye icon SVG
        togglePassBtn.innerHTML = isPass
          ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
          : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      };
    }

    /* ── OAUTH CLIENT SIGN IN CONTROLLER (SIMULATED OAUTH WINDOWS) ── */
    const handleOAuth = (provider) => {
      // Read client configuration from local config window object
      const config = window.AF_CONFIG || {};
      const clientId = provider === 'Google' ? config.googleClientId 
                     : provider === 'Microsoft' ? config.microsoftClientId 
                     : config.discordClientId;

      AF.toast(`Connecting to ${provider} OAuth...`, 'info');

      // Create a centered pop-up window to simulate OAuth redirection
      const w = 500, h = 600;
      const left = (window.screen.width / 2) - (w / 2);
      const top = (window.screen.height / 2) - (h / 2);
      
      const oauthWindow = window.open('', `${provider} OAuth`, `width=${w},height=${h},top=${top},left=${left}`);
      
      // Inject simulated OAuth consent page into pop-up
      if (oauthWindow) {
        oauthWindow.document.write(`
          <html>
          <head>
            <title>${provider} Authorization</title>
            <style>
              body {
                background: #0f0c1b;
                color: #f1eeff;
                font-family: 'Inter', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                padding: 24px;
                text-align: center;
              }
              .card {
                background: rgba(255,255,255,0.03);
                border: 1px solid rgba(139,92,246,0.15);
                padding: 32px;
                border-radius: 16px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                max-width: 380px;
              }
              .logo { margin-bottom: 20px; }
              .btn {
                background: linear-gradient(135deg, #8B5CF6 0%, #38BDF8 100%);
                color: #fff;
                border: none;
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 600;
                border-radius: 8px;
                cursor: pointer;
                width: 100%;
                margin-top: 24px;
                box-shadow: 0 0 12px rgba(139,92,246,0.3);
              }
              .btn:hover { opacity: 0.9; }
              .text-muted { color: #8b83a3; font-size: 12px; margin-top: 16px; line-height: 1.4; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="logo">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h3>Authorize AssetFlow</h3>
              <p style="font-size: 13px; color: #a89ec8; line-height: 1.5;">AssetFlow ERP is requesting permission to access your profile name and email address via <strong>${provider}</strong>.</p>
              <button class="btn" id="btnAuthorize">Agree and Continue</button>
              <div class="text-muted">
                ClientID: <code style="font-family: monospace; font-size: 11px; background: rgba(0,0,0,0.3); padding: 2px 4px; border-radius: 4px;">${clientId || 'configured-in-env'}</code>
              </div>
            </div>
            <script>
              document.getElementById('btnAuthorize').onclick = () => {
                window.opener.postMessage({ type: 'oauth-success', provider: '${provider}' }, '*');
                window.close();
              };
            <\/script>
          </body>
          </html>
        `);
        oauthWindow.document.close();
      }
    };

    const googleBtn = document.getElementById('btnGoogleAuth');
    if (googleBtn) googleBtn.onclick = () => handleOAuth('Google');

    const msBtn = document.getElementById('btnMicrosoftAuth');
    if (msBtn) msBtn.onclick = () => handleOAuth('Microsoft');

    const githubBtn = document.getElementById('btnGitHubAuth');
    if (githubBtn) githubBtn.onclick = () => handleOAuth('GitHub');

    // Listen for messages back from the OAuth Pop-up Window
    const handleOauthMessage = (e) => {
      if (e.data && e.data.type === 'oauth-success') {
        window.removeEventListener('message', handleOauthMessage);
        
        // Login as default admin session upon successful authorization
        const adminEmp = s.employees.find(em => em.role === 'Admin') || s.employees[0];
        s.session = {
          name: adminEmp.name,
          email: adminEmp.email,
          role: adminEmp.role,
          deptId: adminEmp.dept
        };
        s.screen = 'dashboard';
        AF.addLog(adminEmp.name, `Authenticated via ${e.data.provider} OAuth`, adminEmp.role);
        AF.render();
        AF.toast(`Successfully authenticated via ${e.data.provider}! Welcome, ${adminEmp.name.split(' ')[0]}.`, 'success');
      }
    };
    window.addEventListener('message', handleOauthMessage);


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
          AF.toast('No account found with that email.', 'error');
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

    /* ── Initialize particles canvas background ───────────────── */
    setTimeout(() => AF.Particles.init('particleCanvas'), 100);
  }
};
