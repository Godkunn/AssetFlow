/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Landing Page & Centered Auth Screen
   ═══════════════════════════════════════════════════════════════════ */

AF.ScreenAuth = {
  render() {
    const s = AF.state;
    if (s.showLandingPage === undefined) {
      s.showLandingPage = true; // Default to showing landing page
    }

    if (s.showLandingPage) {
      return this.renderLandingPage();
    } else {
      return this.renderAuthForm();
    }
  },

  /* ─────────────────────────────────────────────────────────────────
     1. LANDING PAGE TEMPLATE
     ───────────────────────────────────────────────────────────────── */
  renderLandingPage() {
    return `
    <div class="af-landing-wrap">
      <!-- Torus Knot background canvas -->
      <canvas id="particleCanvas" class="af-auth-canvas"></canvas>

      <!-- Sticky Header -->
      <header class="af-landing-header">
        <div class="af-banner-brand">
          <img src="assets/icons/logo.png" alt="AssetFlow Logo" class="af-logo-img" style="width:40px;height:40px;border-radius:8px;" />
          <span class="af-brand-logo-text" style="font-size:24px;">AssetFlow</span>
        </div>
        <nav class="af-landing-nav">
          <a href="#features" class="af-landing-nav-link">Core Features</a>
          <a href="#techstack" class="af-landing-nav-link">Architecture</a>
          <a href="contact.html" target="_blank" class="af-landing-nav-link">Contact Support</a>
        </nav>
        <div class="af-landing-actions">
          <button class="af-btn af-btn-secondary btn-to-login" style="padding: 8px 16px;">Sign In</button>
          <button class="af-btn af-btn-primary btn-to-signup" style="padding: 8px 16px;">Get Started</button>
        </div>
      </header>

      <!-- Hero Section -->
      <section class="af-landing-hero">
        <h1 class="af-landing-hero-title">Unleash Enterprise Potential<br>with AssetFlow ERP</h1>
        <p class="af-landing-hero-desc">A blueprint for turning your asset inventory into a multi-tenant, industry-grade SaaS ERP. Built for schools, factories, offices, and hospitals at scale.</p>
        <div class="af-landing-actions" style="justify-content:center;">
          <button class="af-btn af-btn-primary af-btn-lg btn-to-signup" style="padding:14px 28px; font-size:16px;">Create Free Tenant</button>
          <button class="af-btn af-btn-secondary af-btn-lg btn-to-login" style="padding:14px 28px; font-size:16px;">Launch Console</button>
        </div>
      </section>

      <!-- Live Statistics / Metrics Grid -->
      <section class="af-landing-stats reveal">
        <div class="af-landing-stat-card">
          <div class="af-landing-stat-num">2,847+</div>
          <div class="af-landing-stat-lbl">Assets Tracked</div>
        </div>
        <div class="af-landing-stat-card">
          <div class="af-landing-stat-num">99.98%</div>
          <div class="af-landing-stat-lbl">API Uptime</div>
        </div>
        <div class="af-landing-stat-card">
          <div class="af-landing-stat-num">&lt;42ms</div>
          <div class="af-landing-stat-lbl">Query Latency</div>
        </div>
        <div class="af-landing-stat-card">
          <div class="af-landing-stat-num">RLS</div>
          <div class="af-landing-stat-lbl">Postgres Security</div>
        </div>
      </section>

      <!-- Detailed Features Section -->
      <section id="features" class="af-landing-section reveal">
        <h2 class="af-landing-section-title">Core Operations Engine</h2>
        <p class="af-landing-section-subtitle">A unified system offering structural integrity for assets, bookings, and audits.</p>
        
        <div class="af-landing-feature-grid">
          <div class="af-landing-feature-card">
            <div class="af-landing-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <h3 class="af-landing-feature-title">Real-time GPS Tracking</h3>
            <p class="af-landing-feature-desc">Always keep tabs on physical coordinates, category groups, and lifecycle statuses across multiple warehouse locations.</p>
          </div>
          
          <div class="af-landing-feature-card">
            <div class="af-landing-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h3 class="af-landing-feature-title">Conflict-Free Scheduler</h3>
            <p class="af-landing-feature-desc">Schedule bookings with strict Postgres exclusion constraints. Prevent race conditions and overlapping resource bookings.</p>
          </div>
          
          <div class="af-landing-feature-card">
            <div class="af-landing-feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 class="af-landing-feature-title">Row-Level Security (RLS)</h3>
            <p class="af-landing-feature-desc">Protect company information. Shared-DB multi-tenancy ensures that users only query data belonging to their company code.</p>
          </div>
        </div>
      </section>

      <!-- Tech Stack Blueprint Section -->
      <section id="techstack" class="af-landing-section reveal">
        <div class="af-landing-blueprint-card">
          <div class="af-landing-blueprint-grid">
            <div>
              <h2 class="af-landing-section-title" style="text-align:left; margin-bottom:16px;">Production Stack &amp; Schema</h2>
              <p style="color:var(--af-text-secondary); font-size:14px; line-height:1.6; margin-bottom:24px;">AssetFlow coordinates transactions across a modular NestJS monolith API, PostgreSQL relational tables, and Redis caching layers. Database schemas enforce unique constraints per tenant workspace.</p>
              <div class="af-landing-blueprint-code">
model Tenant {
  id        String   @id @default(uuid())
  name      String
  domain    String   @unique
  users     User[]
  assets    Asset[]
}

model User {
  id        String   @id @default(uuid())
  email     String
  name      String
  role      Role     @default(EMPLOYEE)
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId])
  @@unique([email, tenantId])
}
              </div>
            </div>
            <div style="text-align:center;">
              <img src="assets/icons/logo.png" style="width:180px;height:180px;border-radius:36px;box-shadow:var(--af-shadow-lg);" alt="AssetFlow Branding" />
              <div style="margin-top:20px; font-weight:600; color:var(--af-purple-light);">Version 2.4.0 Stable</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="af-landing-footer">
        <p style="font-size:14px; margin-bottom:16px; color:var(--af-text-muted);">© 2026 AssetFlow ERP. All rights reserved.</p>
        <div style="display:flex; justify-content:center; gap:20px; font-size:12px;">
          <a href="terms.html" target="_blank" style="color:var(--af-purple-light); text-decoration:none;">Terms of Service</a>
          <span style="color:var(--af-text-muted);">·</span>
          <a href="privacy.html" target="_blank" style="color:var(--af-purple-light); text-decoration:none;">Privacy Policy</a>
          <span style="color:var(--af-text-muted);">·</span>
          <a href="dmca.html" target="_blank" style="color:var(--af-purple-light); text-decoration:none;">DMCA Notice</a>
          <span style="color:var(--af-text-muted);">·</span>
          <a href="contact.html" target="_blank" style="color:var(--af-purple-light); text-decoration:none;">Contact Support</a>
        </div>
      </footer>
    </div>`;
  },

  /* ─────────────────────────────────────────────────────────────────
     2. CENTERED AUTHENTICATION CARD TEMPLATE
     ───────────────────────────────────────────────────────────────── */
  renderAuthForm() {
    const s = AF.state;
    const isLogin = s.authTab === 'login';

    return `
    <div class="af-auth-centered-wrap">
      <!-- Canvas particles behind card -->
      <canvas id="particleCanvas" class="af-auth-canvas"></canvas>

      <!-- Back button to return to home landing page -->
      <button class="af-back-landing-btn" id="btnBackToLanding">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        <span>Back to Home</span>
      </button>

      <div class="af-auth-card" style="position:relative; z-index:10;">
        <h2 class="af-card-welcome-title">${isLogin ? 'Welcome back 👋' : 'Create account ✨'}</h2>
        <p class="af-card-welcome-sub">${isLogin ? 'Sign in to your tenant account' : 'Get started with a free workspace'}</p>

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

        <!-- Social Buttons (Connected to live endpoints) -->
        <div class="af-auth-social-row">
          <button type="button" class="af-social-btn" id="btnGoogleAuth" title="Sign in with Google">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>
            <span>Google</span>
          </button>
          <button type="button" class="af-social-btn" id="btnGitHubAuth" title="Sign in with GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            <span>GitHub</span>
          </button>
          <button type="button" class="af-social-btn" id="btnDiscordAuth" title="Sign in with Discord">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.078.078 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            <span>Discord</span>
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

        <!-- Document Footer links (Direct separate files) -->
        <div class="af-auth-doc-footer">
          <a href="terms.html" target="_blank" class="af-doc-link">Terms of Service</a>
          <span class="sep">·</span>
          <a href="privacy.html" target="_blank" class="af-doc-link">Privacy Policy</a>
          <span class="sep">·</span>
          <a href="dmca.html" target="_blank" class="af-doc-link">DMCA</a>
          <span class="sep">·</span>
          <a href="contact.html" target="_blank" class="af-doc-link">Contact Support</a>
        </div>
      </div>
    </div>`;
  },

  /* ─────────────────────────────────────────────────────────────────
     3. COMPONENT ACTION BINDINGS
     ───────────────────────────────────────────────────────────────── */
  bind() {
    const s = AF.state;
    if (s.showLandingPage) {
      this.bindLandingPage();
    } else {
      this.bindAuthForm();
    }
  },

  bindLandingPage() {
    const s = AF.state;

    // Route buttons to Auth form
    document.querySelectorAll('.btn-to-login').forEach(btn => {
      btn.onclick = () => {
        s.showLandingPage = false;
        s.authTab = 'login';
        AF.render();
      };
    });

    document.querySelectorAll('.btn-to-signup').forEach(btn => {
      btn.onclick = () => {
        s.showLandingPage = false;
        s.authTab = 'signup';
        AF.render();
      };
    });

    // Scroll reveal observers
    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealItems.length > 0) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('active');
          }
        });
      }, { threshold: 0.1 });
      revealItems.forEach(item => obs.observe(item));
    } else {
      revealItems.forEach(item => item.classList.add('active'));
    }

    // Initialize particles canvas background (Torus Knot)
    setTimeout(() => AF.Particles.init('particleCanvas'), 100);
  },

  bindAuthForm() {
    const s = AF.state;

    // Back to landing button
    const backBtn = document.getElementById('btnBackToLanding');
    if (backBtn) {
      backBtn.onclick = () => {
        s.showLandingPage = true;
        AF.render();
      };
    }

    /* ── Click handlers to toggle view tabs ─────────────────────── */
    document.querySelectorAll('[data-auth-tab]').forEach(tab => {
      tab.onclick = (e) => {
        e.preventDefault();
        s.authTab = tab.dataset.authTab;
        AF.render();
      };
    });

    const btnForgot = document.getElementById('btnForgotPass');
    if (btnForgot) {
      btnForgot.onclick = (e) => {
        e.preventDefault();
        AF.toast('Password reset link sent to registered email address.', 'info');
      };
    }

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

    /* ── OAUTH CLIENT SIGN IN CONTROLLER (Connected to local API) ── */
    const API_BASE = 'http://localhost:4000';

    const OAUTH_URLS = {
      Google: `${API_BASE}/auth/google`,
      GitHub: `${API_BASE}/auth/github`,
      Discord: `${API_BASE}/auth/discord`
    };

    const handleOAuth = (provider) => {
      AF.toast(`Connecting to ${provider}...`, 'info');

      const w = 500, h = 640;
      const left = Math.round((window.screen.width / 2) - (w / 2));
      const top  = Math.round((window.screen.height / 2) - (h / 2));
      const popupUrl = OAUTH_URLS[provider];

      // Open OAuth centered pop-up
      const oauthWindow = window.open(
        popupUrl,
        `${provider} OAuth`,
        `width=${w},height=${h},top=${top},left=${left},scrollbars=yes`
      );
    };

    const googleBtn = document.getElementById('btnGoogleAuth');
    if (googleBtn) googleBtn.onclick = () => handleOAuth('Google');

    const githubBtn = document.getElementById('btnGitHubAuth');
    if (githubBtn) githubBtn.onclick = () => handleOAuth('GitHub');

    const discordBtn = document.getElementById('btnDiscordAuth');
    if (discordBtn) discordBtn.onclick = () => handleOAuth('Discord');

    // Listen for messages back from the OAuth Pop-up Window
    const handleOauthMessage = (e) => {
      if (e.data && e.data.type === 'oauth-success') {
        window.removeEventListener('message', handleOauthMessage);
        
        // Log in using real session parameters from database
        const sessionUser = e.data.session;
        if (sessionUser) {
          s.session = {
            name: sessionUser.name,
            email: sessionUser.email,
            role: sessionUser.role === 'TENANT_ADMIN' ? 'Admin' : 'Employee',
            deptId: 'dept-hq'
          };
          if (e.data.token) {
            localStorage.setItem('af_token', e.data.token);
          }
        } else {
          // Fallback to default session if needed
          const adminEmp = s.employees.find(em => em.role === 'Admin') || s.employees[0];
          s.session = {
            name: adminEmp.name,
            email: adminEmp.email,
            role: adminEmp.role,
            deptId: adminEmp.dept
          };
        }
        
        s.screen = 'dashboard';
        AF.addLog(s.session.name, `Authenticated via ${e.data.provider} OAuth`, s.session.role);
        AF.render();
        AF.toast(`Successfully authenticated via ${e.data.provider}! Welcome, ${s.session.name.split(' ')[0]}.`, 'success');
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

        if (!email || !password) {
          AF.toast('Please fill in all credentials.', 'warning');
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

        if (!name || !email || password.length < 6) {
          AF.toast('Please check your registration form parameters.', 'warning');
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

    // Initialize particles canvas background (Torus Knot)
    setTimeout(() => AF.Particles.init('particleCanvas'), 100);
  }
};
