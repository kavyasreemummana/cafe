const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear auth token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Get auth headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Menu API methods
  async getMenuItems(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/menu?${queryString}`);
  }

  async getMenuCategories() {
    return this.request('/menu/categories');
  }

  async getFeaturedItems() {
    return this.request('/menu/featured');
  }

  async getMenuItem(id) {
    return this.request(`/menu/${id}`);
  }

  // Order API methods
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async getCustomerOrders(email, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders/customer/${email}?${queryString}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // User API methods
  async register(userData) {
    const response = await this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    this.clearToken();
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/users/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

// Create and export a single instance
const apiService = new ApiService();
export default apiService;
