/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Torus Knot 3D Background Animation
   Pure canvas / WebGL-free mathematical 3D torus knot
   ═══════════════════════════════════════════════════════════════════ */

AF.Particles = {
  canvas: null,
  ctx: null,
  animId: null,
  t: 0,
  points: [],
  trails: [],
  mouse: { x: 0, y: 0 },

  // Torus knot parametric (p=2, q=3 gives trefoil-like knot)
  torusKnot(t, R = 140, r = 50, p = 2, q = 3) {
    const phi = t;
    const theta = q * phi / p;
    const x = Math.cos(phi) * (R + r * Math.cos(theta));
    const y = Math.sin(phi) * (R + r * Math.cos(theta));
    const z = r * Math.sin(theta);
    return { x, y, z };
  },

  // Project 3D → 2D with perspective
  project(x, y, z, cx, cy, fov = 600, rotX = 0, rotY = 0) {
    // Rotate Y
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const rx = x * cosY - z * sinY;
    const rz = x * sinY + z * cosY;

    // Rotate X
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const ry = y * cosX - rz * sinX;
    const rz2 = y * sinX + rz * cosX;

    const scale = fov / (fov + rz2 + 200);
    return {
      sx: cx + rx * scale,
      sy: cy + ry * scale,
      scale,
      depth: rz2,
    };
  },

  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.buildPoints();
    this.bindEvents();
    this.animate();
  },

  buildPoints() {
    this.points = [];
    const steps = 320;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const p = this.torusKnot(t);
      const hue = (i / steps) * 360;
      this.points.push({ t, ...p, hue, i });
    }
  },

  resize() {
    this.canvas.width = this.canvas.offsetWidth || window.innerWidth;
    this.canvas.height = this.canvas.offsetHeight || window.innerHeight;
  },

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  },

  animate() {
    const { canvas, ctx } = this;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Auto-rotate angles
    const rotY = this.t * 0.008 + this.mouse.x * 0.0008;
    const rotX = Math.sin(this.t * 0.003) * 0.4 + this.mouse.y * 0.0006;

    // Dark fade trail
    ctx.fillStyle = 'rgba(10, 6, 18, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Project all points
    const projected = this.points.map(p => ({
      ...this.project(p.x, p.y, p.z, cx, cy, 700, rotX, rotY),
      hue: p.hue,
    }));

    // Sort by depth (painter's algorithm)
    projected.sort((a, b) => a.depth - b.depth);

    // Draw the knot segments
    for (let i = 0; i < projected.length - 1; i++) {
      const p1 = projected[i];
      const p2 = projected[(i + 1) % projected.length];

      const brightness = Math.max(0.3, (p1.depth + 250) / 500);
      const alpha = Math.min(1, brightness * 0.85);
      const lineW = Math.max(0.4, p1.scale * 2.5);

      ctx.beginPath();
      ctx.moveTo(p1.sx, p1.sy);
      ctx.lineTo(p2.sx, p2.sy);

      // Gradient color along knot: purple → gold → sky
      const h = (p1.hue + this.t * 0.3) % 360;
      let r, g, b;
      if (h < 120) {
        // Purple zone
        const mix = h / 120;
        r = Math.round(139 + (245 - 139) * mix);
        g = Math.round(92 + (158 - 92) * mix);
        b = Math.round(246 + (11 - 246) * mix);
      } else if (h < 240) {
        // Gold to sky
        const mix = (h - 120) / 120;
        r = Math.round(245 + (56 - 245) * mix);
        g = Math.round(158 + (189 - 158) * mix);
        b = Math.round(11 + (248 - 11) * mix);
      } else {
        // Sky back to purple
        const mix = (h - 240) / 120;
        r = Math.round(56 + (139 - 56) * mix);
        g = Math.round(189 + (92 - 189) * mix);
        b = Math.round(248 + (246 - 248) * mix);
      }

      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = lineW;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glow dot on brightest parts
      if (p1.scale > 0.95 && i % 8 === 0) {
        ctx.beginPath();
        ctx.arc(p1.sx, p1.sy, lineW * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.7})`;
        ctx.fill();
      }
    }

    // Floating ambient particles
    if (!this._sparks) {
      this._sparks = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
        color: Math.random() > 0.6 ? `rgba(139,92,246,` : `rgba(245,158,11,`,
        a: Math.random() * 0.4 + 0.05,
      }));
    }
    for (const s of this._sparks) {
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      if (s.y < 0) s.y = canvas.height;
      if (s.y > canvas.height) s.y = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color + s.a + ')';
      ctx.fill();
    }

    this.t++;
    this.animId = requestAnimationFrame(() => this.animate());
  },

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this._sparks = null;
    this.t = 0;
  }
};
