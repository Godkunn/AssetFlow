/* AssetFlow — Auth Screen (Login / Sign Up) */

AF.ScreenAuth = {
  render() {
    const s = AF.state;
    const isLogin = s.authTab === 'login';

    return `
    <div class="af-auth-wrap">
      <canvas id="particleCanvas" class="af-auth-canvas"></canvas>

      <div class="af-auth-shell">
        <h1 class="af-auth-title">AssetFlow — ${isLogin ? 'login' : 'signup'}</h1>

        <!-- Logo circle container matching mockup -->
        <div class="af-auth-logo-circle">
          <img src="assets/logo.png" alt="AssetFlow" />
        </div>

        ${isLogin ? `
        <!-- Login Form -->
        <form id="loginForm" class="af-auth-fields" autocomplete="off">
          <div class="af-field">
            <label class="af-label">Email</label>
            <input type="email" id="authEmail" class="af-input" placeholder="name@company.com" value="admin@assetflow.io" required />
          </div>
          <div class="af-field" style="margin-bottom: 8px;">
            <label class="af-label">Password</label>
            <input type="password" id="authPassword" class="af-input" placeholder="**********" value="demo1234" required />
          </div>
          
          <div class="af-auth-forgot-wrap">
            <a href="#" class="af-auth-link" id="forgotPasswordBtn">Forgot password</a>
          </div>

          <button type="submit" class="af-btn af-btn-primary af-btn-block" id="loginBtn" style="margin-bottom: 24px;">
            Sign In
          </button>
        </form>

        <div class="af-auth-separator"></div>

        <!-- Signup Navigation block from mockup -->
        <div class="af-auth-signup-promo">
          <h3 class="af-auth-subtitle">New here?</h3>
          <div class="af-auth-info-box">
            Sign up creates an employee account. admin roles assigned later.
          </div>
          <button type="button" class="af-btn af-btn-secondary af-btn-block" data-auth-tab="signup">
            Create Account
          </button>
        </div>
        ` : `
        <!-- Signup Form -->
        <form id="signupForm" class="af-auth-fields" autocomplete="off">
          <div class="af-field">
            <label class="af-label">Full name</label>
            <input type="text" id="signupName" class="af-input" placeholder="Your full name" required />
          </div>
          <div class="af-field">
            <label class="af-label">Email</label>
            <input type="email" id="signupEmail" class="af-input" placeholder="name@company.com" required />
          </div>
          <div class="af-field">
            <label class="af-label">Password</label>
            <input type="password" id="signupPassword" class="af-input" placeholder="Min 6 characters" required />
          </div>
          <div class="af-field" style="margin-bottom: 24px;">
            <label class="af-label">Confirm password</label>
            <input type="password" id="signupConfirm" class="af-input" placeholder="Re-enter password" required />
          </div>
          
          <button type="submit" class="af-btn af-btn-primary af-btn-block" id="signupBtn" style="margin-bottom: 24px;">
            Create Account
          </button>
        </form>

        <div class="af-auth-separator"></div>

        <!-- Login Navigation block -->
        <div class="af-auth-login-promo">
          <h3 class="af-auth-subtitle">Already have an account?</h3>
          <button type="button" class="af-btn af-btn-secondary af-btn-block" data-auth-tab="login">
            Sign In
          </button>
        </div>
        `}
      </div>
    </div>`;
  },

  bind() {
    const s = AF.state;

    /* ── Click handlers to toggle view tabs ─────────────────────── */
    document.querySelectorAll('[data-auth-tab]').forEach(tab => {
      tab.onclick = () => {
        s.authTab = tab.dataset.authTab;
        AF.render();
      };
    });

    /* ── Forgot password handler ────────────────────────────────── */
    const forgotBtn = document.getElementById('forgotPasswordBtn');
    if (forgotBtn) {
      forgotBtn.onclick = (e) => {
        e.preventDefault();
        AF.toast('Password reset link sent to registered email address.', 'info');
      };
    }

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
