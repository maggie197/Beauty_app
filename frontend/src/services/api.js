import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Services API
export const servicesAPI = {
  getAll: (category) => api.get('/services', { params: { category } }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`)
};

// Providers API
export const providersAPI = {
  getAll: () => api.get('/providers'),
  getById: (id) => api.get(`/providers/${id}`),
  getByService: (serviceId) => api.get(`/providers/service/${serviceId}`),
  updateProfile: (data) => api.put('/providers/profile', data),
  setServices: (serviceIds) => api.put('/providers/services', { serviceIds }),
  setAvailability: (availability) => api.put('/providers/availability', { availability })
};

// Appointments API
export const appointmentsAPI = {
  create: (data) => api.post('/appointments', data),
  getMy: (status) => api.get('/appointments/my', { params: { status } }),
  getProviderAppointments: (status, date) =>
    api.get('/appointments/provider', { params: { status, date } }),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  getAvailableSlots: (provider_id, date) =>
    api.get('/appointments/slots', { params: { provider_id, date } })
};

// Reviews API
export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  create: (data) => api.post('/reviews', data),
  getProviderReviews: (providerId, page = 1) =>
    api.get(`/reviews/provider/${providerId}`, { params: { page } }),
  getMy: () => api.get('/reviews/my'),
  delete: (id) => api.delete(`/reviews/${id}`)
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/products/${id}`)
};

export default api;
