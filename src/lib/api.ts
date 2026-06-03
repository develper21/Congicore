const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: HeadersInit;
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const token = this.getAuthToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  async forgotPassword(email: string) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  }

  async resetPassword(token: string, password: string) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: { token, password },
    });
  }

  async verifyEmail(token: string) {
    return this.request('/api/auth/verify-email', {
      method: 'POST',
      body: { token },
    });
  }

  // Documents
  async getDocuments() {
    return this.request<{ documents: any[] }>('/api/documents');
  }

  async getDocument(id: string) {
    return this.request<{ document: any }>(`/api/documents/${id}`);
  }

  async createDocument(data: FormData) {
    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/documents`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: data,
    });
    if (!response.ok) throw new Error('Failed to create document');
    return response.json();
  }

  async updateDocument(id: string, data: any) {
    return this.request<{ document: any }>(`/api/documents/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteDocument(id: string) {
    return this.request(`/api/documents/${id}`, { method: 'DELETE' });
  }

  async searchDocuments(query: string) {
    return this.request<{ documents: any[] }>(`/api/documents/search?q=${query}`);
  }

  // Chat
  async getChats() {
    return this.request<{ chats: any[] }>('/api/chat');
  }

  async getChat(id: string) {
    return this.request<{ chat: any }>(`/api/chat/${id}`);
  }

  async createChat(data: { title: string; messages: any[] }) {
    return this.request<{ chat: any }>('/api/chat', {
      method: 'POST',
      body: data,
    });
  }

  async updateChat(id: string, data: any) {
    return this.request<{ chat: any }>(`/api/chat/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteChat(id: string) {
    return this.request(`/api/chat/${id}`, { method: 'DELETE' });
  }

  // Memories
  async getMemories() {
    return this.request<{ memories: any[] }>('/api/memories');
  }

  async getMemory(id: string) {
    return this.request<{ memory: any }>(`/api/memories/${id}`);
  }

  async createMemory(data: any) {
    return this.request<{ memory: any }>('/api/memories', {
      method: 'POST',
      body: data,
    });
  }

  async updateMemory(id: string, data: any) {
    return this.request<{ memory: any }>(`/api/memories/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteMemory(id: string) {
    return this.request(`/api/memories/${id}`, { method: 'DELETE' });
  }

  // Profile
  async getProfile() {
    return this.request<{ profile: any }>('/api/profile');
  }

  async updateProfile(data: any) {
    return this.request<{ profile: any }>('/api/profile', {
      method: 'PUT',
      body: data,
    });
  }

  // Settings
  async getSettings() {
    return this.request<{ settings: any }>('/api/settings');
  }

  async updateSettings(data: any) {
    return this.request<{ settings: any }>('/api/settings', {
      method: 'PUT',
      body: data,
    });
  }

  // Billing
  async getBilling() {
    return this.request<{ billing: any }>('/api/billing');
  }

  async getSubscription() {
    return this.request<{ subscription: any }>('/api/billing/subscription');
  }

  async createCheckoutSession(planId: string, billingCycle: 'monthly' | 'yearly') {
    return this.request<{ sessionId: string; url: string }>('/api/billing/checkout', {
      method: 'POST',
      body: { planId, billingCycle },
    });
  }

  async verifyPayment(sessionId: string) {
    return this.request<{ success: boolean; subscription: any }>('/api/billing/verify', {
      method: 'POST',
      body: { sessionId },
    });
  }

  // Dashboard
  async getStats() {
    return this.request<{ stats: any }>('/api/dashboard/stats');
  }

  // Graph
  async getGraph() {
    return this.request<{ graph: any }>('/api/graph');
  }

  async updateGraph(data: any) {
    return this.request<{ graph: any }>('/api/graph', {
      method: 'PUT',
      body: data,
    });
  }

  // Upload
  async uploadFile(file: File, title?: string, tags?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (tags) formData.append('tags', tags);

    const token = this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  }
}

export const api = new ApiClient();
