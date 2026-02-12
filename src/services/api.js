import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

// Produits
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Catégories
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Mouvements
export const movementsAPI = {
  getAll: () => api.get('/movements'),
  getById: (id) => api.get(`/movements/${id}`),
  create: (data) => api.post('/movements', data),
  getRecent: (limit = 10) => api.get('/movements/stats'), // Utiliser stats pour obtenir les mouvements récents
  getByProduct: (productId) => api.get(`/movements/product/${productId}`),
  getStats: () => api.get('/movements/stats'),
};

// Alertes
export const alertsAPI = {
  getAll: () => api.get('/alertes'),
  getActive: () => api.get('/alertes/active'),
};

export default api;
