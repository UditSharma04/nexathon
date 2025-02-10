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
  create: (itemData) => axios.post('/api/items', itemData),
  getMyItems: () => axios.get('/api/items/my-items'),
  getItem: (id) => axios.get(`/api/items/${id}`),
  getAllItems: () => axios.get('/api/items/browseItems'),
  updateItem: (id, itemData) => axios.put(`/api/items/${id}`, itemData),
  deleteItem: (id) => axios.delete(`/api/items/${id}`),
}; 