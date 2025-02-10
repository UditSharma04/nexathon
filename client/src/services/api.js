import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or however you store your token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials)
};

export const itemsAPI = {
  create: (itemData) => api.post('/api/items', itemData),
  getMyItems: () => api.get('/api/items/my-items'),
  getItem: (id) => api.get(`/api/items/${id}`),
  getAllItems: () => api.get('/api/items/browseItems'),
  updateItem: (id, itemData) => api.put(`/api/items/${id}`, itemData),
  deleteItem: (id) => api.delete(`/api/items/${id}`),
}; 