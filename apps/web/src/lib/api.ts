import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('af_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  getSession: () => api.get('/auth/session').then(res => res.data),
};

export const reportsAPI = {
  getDashboardKpis: () => api.get('/reports/dashboard').then(res => res.data),
  exportReport: () => api.get('/reports/export').then(res => res.data),
};

export const orgAPI = {
  getDepartments: () => api.get('/org/departments').then(res => res.data),
  createDepartment: (data: any) => api.post('/org/departments', data).then(res => res.data),
  getCategories: () => api.get('/org/categories').then(res => res.data),
  createCategory: (data: any) => api.post('/org/categories', data).then(res => res.data),
  getEmployees: () => api.get('/org/employees').then(res => res.data),
  createEmployee: (data: any) => api.post('/org/employees', data).then(res => res.data),
};

export const assetsAPI = {
  getAssets: (status?: string) => api.get('/assets', { params: { status } }).then(res => res.data),
  createAsset: (data: any) => api.post('/assets', data).then(res => res.data),
};

export const allocationsAPI = {
  getAllocations: () => api.get('/allocations').then(res => res.data),
  createAllocation: (data: any) => api.post('/allocations', data).then(res => res.data),
  returnAllocation: (id: string) => api.patch(`/allocations/${id}/return`).then(res => res.data),
};

export const transfersAPI = {
  getTransfers: async () => {
    const { data } = await api.get('/allocations/transfers');
    return data;
  },
  requestTransfer: (data: any) => api.post('/allocations/transfers', data).then(res => res.data),
  resolveTransfer: (id: string, status: string) => api.patch(`/allocations/transfers/${id}`, { status }).then(res => res.data),
};

export const bookingAPI = {
  getBookings: async () => {
    const { data } = await api.get('/bookings');
    return data;
  },
  createBooking: async (payload: { assetId: string; userId: string; startTime: string; endTime: string }) => {
    const { data } = await api.post('/bookings', payload);
    return data;
  },
  cancelBooking: async (id: string) => {
    const { data } = await api.patch(`/bookings/${id}/cancel`);
    return data;
  }
};

export const maintenanceAPI = {
  getTickets: async () => {
    const { data } = await api.get('/maintenance');
    return data;
  },
  createTicket: async (payload: { assetId: string; issue: string; priority: string }) => {
    const { data } = await api.post('/maintenance', payload);
    return data;
  },
  updateTicketStage: async (id: string, stage: string, technicianId?: string) => {
    const { data } = await api.patch(`/maintenance/${id}/stage`, { stage, technicianId });
    return data;
  }
};

export const auditAPI = {
  getAuditCycles: async () => {
    const { data } = await api.get('/audits');
    return data;
  },
  createAuditCycle: async (payload: { name: string; scope?: string; auditors: string[] }) => {
    const { data } = await api.post('/audits', payload);
    return data;
  },
  verifyAuditItem: async (itemId: string, verdict: string) => {
    const { data } = await api.patch(`/audits/items/${itemId}/verify`, { verdict });
    return data;
  },
  closeAuditCycle: async (id: string) => {
    const { data } = await api.patch(`/audits/${id}/close`);
    return data;
  }
};
