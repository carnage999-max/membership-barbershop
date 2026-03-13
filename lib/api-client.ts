// API Client for Frontend
// Helper functions to call backend API endpoints

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// ============================================
// AUTH API
// ============================================

export const auth = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => apiCall('/api/auth/register', { method: 'POST', body: data }),

  login: (email: string, password: string) =>
    apiCall('/api/auth/login', { method: 'POST', body: { email, password } }),
};

// ============================================
// LOCATIONS API
// ============================================

export const locations = {
  getAll: (lat?: number, lng?: number) => {
    const params = new URLSearchParams();
    if (lat) params.append('lat', lat.toString());
    if (lng) params.append('lng', lng.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/api/locations${query}`);
  },

  getById: (id: string) => apiCall(`/api/locations/${id}`),
};

// ============================================
// MEMBERSHIPS API
// ============================================

export const memberships = {
  getPlans: (locationId?: string) => {
    const params = locationId ? `?locationId=${locationId}` : '';
    return apiCall(`/api/memberships/plans${params}`);
  },

  subscribe: (planId: string, paymentMethodId: string, token: string) =>
    apiCall('/api/memberships/subscribe', {
      method: 'POST',
      body: { planId, paymentMethodId },
      token,
    }),

  getMyMembership: (token: string) =>
    apiCall('/api/memberships/my-membership', { token }),
};

// ============================================
// QUEUE API
// ============================================

export const queue = {
  join: (locationId: string, token: string, stylistId?: string) =>
    apiCall('/api/queue/join', {
      method: 'POST',
      body: { locationId, stylistId },
      token,
    }),

  getMyPosition: (token: string) =>
    apiCall('/api/queue/my-position', { token }),

  leave: (token: string) =>
    apiCall('/api/queue/leave', { method: 'DELETE', token }),
};

// ============================================
// STYLISTS API
// ============================================

export const stylists = {
  getAll: (locationId?: string, onShift?: boolean, token?: string) => {
    const params = new URLSearchParams();
    if (locationId) params.append('locationId', locationId);
    if (onShift !== undefined) params.append('onShift', onShift.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/api/stylists${query}`, { token });
  },

  follow: (stylistId: string, token: string) =>
    apiCall(`/api/stylists/${stylistId}/follow`, { method: 'POST', token }),

  unfollow: (stylistId: string, token: string) =>
    apiCall(`/api/stylists/${stylistId}/follow`, { method: 'DELETE', token }),
};

// ============================================
// CHECK-INS API
// ============================================

export const checkIns = {
  create: (
    locationId: string,
    services: string[],
    token: string,
    stylistId?: string
  ) =>
    apiCall('/api/checkins', {
      method: 'POST',
      body: { locationId, services, stylistId },
      token,
    }),

  getHistory: (token: string, limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return apiCall(`/api/checkins${params}`, { token });
  },
};

// ============================================
// PAYMENTS API
// ============================================

export const payments = {
  createIntent: (planId: string, amount: number, token: string) =>
    apiCall('/api/payments/create-intent', {
      method: 'POST',
      body: { planId, amount },
      token,
    }),
};

// ============================================
// TOKEN MANAGEMENT
// ============================================

export const tokenStorage = {
  set: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  get: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};

// ============================================
// USER SESSION
// ============================================

export const session = {
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('current_user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  setCurrentUser: (user: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('current_user', JSON.stringify(user));
    }
  },

  clearCurrentUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_user');
    }
  },

  logout: () => {
    tokenStorage.remove();
    session.clearCurrentUser();
  },
};
