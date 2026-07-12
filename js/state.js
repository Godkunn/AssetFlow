/* ═══════════════════════════════════════════════════════════════════
   AssetFlow — Global State Management
   ═══════════════════════════════════════════════════════════════════ */

const AF = window.AF || {};
window.AF = AF;

/* ── Utility helpers ─────────────────────────────────────────────── */
AF.uid = (prefix) => prefix + '_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
AF.todayISO = () => new Date().toISOString().slice(0, 10);
AF.formatCurrency = (n) => '₹' + Number(n).toLocaleString('en-IN');
AF.formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
AF.formatTime = () => {
  return new Date().toLocaleString('en-IN', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};
AF.timeToMin = (t) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
AF.initials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
};

/* ── Theme management ────────────────────────────────────────────── */
AF.theme = {
  current: localStorage.getItem('af-theme') || 'dark',
  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('af-theme', this.current);
    document.documentElement.setAttribute('data-theme', this.current);
  },
  apply() {
    document.documentElement.setAttribute('data-theme', this.current);
  }
};

/* ── Role-based navigation ───────────────────────────────────────── */
AF.ROLE_NAV = {
  'Admin': ['dashboard', 'org', 'assets', 'allocation', 'booking', 'maintenance', 'audit', 'reports', 'notifications'],
  'Asset Manager': ['dashboard', 'assets', 'allocation', 'booking', 'maintenance', 'audit', 'reports', 'notifications'],
  'Department Head': ['dashboard', 'assets', 'allocation', 'booking', 'notifications'],
  'Employee': ['dashboard', 'assets', 'booking', 'notifications'],
};

AF.NAV_META = {
  dashboard: {
    label: 'Dashboard',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`
  },
  org: {
    label: 'Organization',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/></svg>`
  },
  assets: {
    label: 'Assets',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`
  },
  allocation: {
    label: 'Allocation',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`
  },
  booking: {
    label: 'Booking',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
  },
  maintenance: {
    label: 'Maintenance',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
  },
  audit: {
    label: 'Audit',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`
  },
  reports: {
    label: 'Reports',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`
  },
  notifications: {
    label: 'Notifications',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
  }
};

/* ── Application state ───────────────────────────────────────────── */
AF.state = {
  screen: 'login',
  authTab: 'login',
  session: null,
  modal: null,
  toasts: [],
  sidebarCollapsed: false,

  departments: [
    { id: 'd1', name: 'Engineering', head: 'Aditi Rao', parent: '—', status: 'Active' },
    { id: 'd2', name: 'Facilities', head: 'Rohan Mehta', parent: '—', status: 'Active' },
    { id: 'd3', name: 'Field Ops (East)', head: 'Sana Iqbal', parent: 'Field Ops', status: 'Inactive' },
    { id: 'd4', name: 'IT', head: 'Karan Bose', parent: '—', status: 'Active' },
  ],

  categories: [
    { id: 'c1', name: 'Electronics', extra: 'Warranty period (months)' },
    { id: 'c2', name: 'Furniture', extra: '—' },
    { id: 'c3', name: 'Vehicles', extra: 'Registration expiry' },
  ],

  employees: [
    { id: 'e1', name: 'Admin User', email: 'admin@assetflow.io', dept: 'IT', role: 'Admin', status: 'Active' },
    { id: 'e2', name: 'Karan Bose', email: 'karan.bose@assetflow.io', dept: 'IT', role: 'Asset Manager', status: 'Active' },
    { id: 'e3', name: 'Aditi Rao', email: 'aditi.rao@assetflow.io', dept: 'Engineering', role: 'Department Head', status: 'Active' },
    { id: 'e4', name: 'Priya Shah', email: 'priya.shah@assetflow.io', dept: 'Engineering', role: 'Employee', status: 'Active' },
    { id: 'e5', name: 'Raj Verma', email: 'raj.verma@assetflow.io', dept: 'Engineering', role: 'Employee', status: 'Active' },
    { id: 'e6', name: 'Arjun Nair', email: 'arjun.nair@assetflow.io', dept: 'Facilities', role: 'Employee', status: 'Active' },
    { id: 'e7', name: 'Sana Iqbal', email: 'sana.iqbal@assetflow.io', dept: 'Facilities', role: 'Department Head', status: 'Active' },
  ],

  assets: [
    {
      id: 'a1', tag: 'AF-0114', name: 'Dell Laptop', category: 'Electronics',
      serial: 'SN-88213', acqDate: '2024-02-10', cost: 82000, condition: 'Good',
      location: 'Bengaluru', shared: false, status: 'Allocated',
      holder: 'Priya Shah (Engineering)',
      history: [
        { date: '2025-01-04', action: 'Returned', actor: 'Arjun Nair', note: 'condition: good' },
        { date: '2025-03-12', action: 'Allocated', actor: 'Karan Bose', note: 'to Priya Shah — Engineering' }
      ],
      maint: []
    },
    {
      id: 'a2', tag: 'AF-0062', name: 'Projector', category: 'Electronics',
      serial: 'SN-11023', acqDate: '2023-08-01', cost: 41000, condition: 'Fair',
      location: 'HQ Floor 2', shared: true, status: 'Under Maintenance',
      holder: '—',
      history: [],
      maint: [{ ticket: 'MT-021', issue: 'Bulb not turning on', cost: 0, tech: 'Unassigned', stage: 'Approved' }]
    },
    {
      id: 'a3', tag: 'AF-0201', name: 'Office Chair', category: 'Furniture',
      serial: 'SN-55012', acqDate: '2022-05-19', cost: 9000, condition: 'Good',
      location: 'Warehouse', shared: false, status: 'Available',
      holder: '—', history: [], maint: []
    },
    {
      id: 'a4', tag: 'AF-0033', name: 'Standing Desk', category: 'Furniture',
      serial: 'SN-34122', acqDate: '2023-01-15', cost: 15500, condition: 'Good',
      location: 'Facilities', shared: false, status: 'Available',
      holder: '—', history: [], maint: []
    },
    {
      id: 'a5', tag: 'AF-0343', name: 'Delivery Van', category: 'Vehicles',
      serial: 'SN-VAN-09', acqDate: '2021-11-02', cost: 1250000, condition: 'Good',
      location: 'Bengaluru Depot', shared: true, status: 'Reserved',
      holder: '—', history: [], maint: []
    },
    {
      id: 'a6', tag: 'AF-0087', name: 'Forklift', category: 'Vehicles',
      serial: 'SN-FL-04', acqDate: '2020-06-23', cost: 980000, condition: 'Fair',
      location: 'Warehouse', shared: true, status: 'Available',
      holder: '—', history: [], maint: []
    },
    {
      id: 'a7', tag: 'AF-0020', name: 'ThinkPad Laptop', category: 'Electronics',
      serial: 'SN-77341', acqDate: '2021-09-10', cost: 76000, condition: 'Worn',
      location: 'HQ Floor 1', shared: false, status: 'Allocated',
      holder: 'Raj Verma (Engineering)', history: [], maint: []
    },
    {
      id: 'a8', tag: 'RM-B2', name: 'Conference Room B2', category: 'Facilities',
      serial: '—', acqDate: '2020-01-01', cost: 0, condition: 'Good',
      location: 'HQ Floor 3', shared: true, status: 'Available',
      holder: '—', history: [], maint: []
    },
  ],

  transfers: [
    {
      id: AF.uid('tr'), assetTag: 'AF-0087', from: 'Warehouse pool',
      to: 'Facilities', reason: 'Relocate for east-wing project', status: 'Pending'
    },
  ],

  bookings: [
    {
      id: AF.uid('bk'), resourceTag: 'RM-B2', resourceName: 'Conference Room B2',
      date: AF.todayISO(), start: '09:00', end: '10:00',
      by: 'Procurement Team', status: 'Upcoming'
    },
  ],

  maintenance: [
    { id: 'MT-021', assetTag: 'AF-0062', issue: 'Projector bulb not turning on', priority: 'Medium', stage: 'Approved', technician: '' },
    { id: 'MT-022', assetTag: 'AF-0033', issue: 'AC unit noisy compressor', priority: 'Low', stage: 'Pending', technician: '' },
    { id: 'MT-023', assetTag: 'AF-0087', issue: 'Forklift hydraulic leak', priority: 'High', stage: 'Technician Assigned', technician: 'R. Varma' },
    { id: 'MT-024', assetTag: 'AF-0020', issue: 'Printer jam — parts ordered', priority: 'Medium', stage: 'In Progress', technician: 'S. Kumar' },
    { id: 'MT-025', assetTag: 'AF-0201', issue: 'Chair armrest repair', priority: 'Low', stage: 'Resolved', technician: 'R. Varma' },
  ],

  audits: [
    {
      id: 'AC-Q3', name: 'Q3 Audit — Engineering', scope: 'Engineering',
      dateRange: '01–15 Jul', auditors: ['A. Rao', 'S. Iqbal'],
      items: [
        { tag: 'AF-0114', expected: 'Desk E12', verdict: 'Verified' },
        { tag: 'AF-9921', expected: 'Desk E14', verdict: 'Missing' },
        { tag: 'AF-4838', expected: 'Desk E15', verdict: 'Damaged' },
      ],
      closed: false
    },
  ],

  notifications: [
    { id: AF.uid('n'), text: 'Laptop AF-0114 assigned to Priya Shah', type: 'Approvals', time: '2m ago', read: false },
    { id: AF.uid('n'), text: 'Maintenance request MT-021 approved', type: 'Approvals', time: '18m ago', read: false },
    { id: AF.uid('n'), text: 'Booking confirmed: Room B2, 2:00–3:00 PM', type: 'Bookings', time: '1h ago', read: true },
    { id: AF.uid('n'), text: 'Transfer approved: AF-0033 to Facilities dept', type: 'Approvals', time: '3h ago', read: true },
    { id: AF.uid('n'), text: 'Overdue return: AF-0021 was due 3 days ago', type: 'Alerts', time: '1d ago', read: false },
    { id: AF.uid('n'), text: 'Audit discrepancy flagged: AF-0088 damaged', type: 'Alerts', time: '2d ago', read: true },
  ],

  log: [
    { time: 'Jul 12, 09:02', actor: 'Karan Bose', action: 'Allocated asset', target: 'AF-0114 → Priya Shah' },
    { time: 'Jul 12, 08:40', actor: 'Procurement Team', action: 'Confirmed booking', target: 'Room B2, 9:00–10:00' },
    { time: 'Jul 11, 17:15', actor: 'R. Varma', action: 'Resolved maintenance', target: 'MT-025' },
  ],
};

/* ── State mutation helpers ──────────────────────────────────────── */
AF.addLog = function (actor, action, target) {
  AF.state.log.unshift({
    time: AF.formatTime(),
    actor,
    action,
    target
  });
};

AF.addNotif = function (text, type) {
  AF.state.notifications.unshift({
    id: AF.uid('n'),
    text,
    type,
    time: 'just now',
    read: false
  });
};

AF.toast = function (msg, kind) {
  const id = AF.uid('toast');
  kind = kind || 'success';
  AF.state.toasts.push({ id, msg, kind });
  AF.render();
  setTimeout(() => {
    AF.state.toasts = AF.state.toasts.filter(t => t.id !== id);
    AF.render();
  }, 3200);
};

AF.navigate = function (screen) {
  AF.state.screen = screen;
  AF.render();
};

AF.openModal = function (type, payload) {
  AF.state.modal = { type, payload };
  AF.render();
};

AF.closeModal = function () {
  AF.state.modal = null;
  AF.render();
};

AF.findAssetByQuery = function (q) {
  if (!q) return null;
  const clean = q.split('—')[0].trim().toLowerCase();
  return AF.state.assets.find(a =>
    a.tag.toLowerCase() === clean ||
    a.tag.toLowerCase() === q.trim().toLowerCase() ||
    a.name.toLowerCase() === clean ||
    (q && a.tag.toLowerCase().includes(clean))
  );
};

AF.badgeClass = function (status) {
  return 'af-badge af-badge-' + status.toLowerCase().replace(/\s+/g, '-');
};

AF.getGreeting = function () {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

AF.computeKPIs = function () {
  const s = AF.state;
  return {
    available: s.assets.filter(a => a.status === 'Available').length,
    allocated: s.assets.filter(a => a.status === 'Allocated').length,
    maintenance: s.maintenance.filter(m => ['Approved', 'Technician Assigned', 'In Progress'].includes(m.stage)).length,
    bookings: s.bookings.filter(b => b.status === 'Upcoming' || b.status === 'Ongoing').length,
    transfers: s.transfers.filter(t => t.status === 'Pending').length,
    returns: s.assets.filter(a => a.status === 'Allocated').length,
    totalAssets: s.assets.length,
    totalValue: s.assets.reduce((sum, a) => sum + (a.cost || 0), 0),
    unreadNotifs: s.notifications.filter(n => !n.read).length,
  };
};
