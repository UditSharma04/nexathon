import axios from '../utils/axios';

export const authAPI = {
  register: (userData) => axios.post('/api/auth/register', userData),
  login: (credentials) => axios.post('/api/auth/login', credentials)
};

export const itemsAPI = {
  create: (itemData) => axios.post('/api/items', itemData),
  getMyItems: () => axios.get('/api/items/my-items'),
  getItem: (id) => axios.get(`/api/items/${id}`),
  getAllItems: () => axios.get('/api/items/browseItems'),
  updateItem: (id, itemData) => axios.put(`/api/items/${id}`, itemData),
  deleteItem: (id) => axios.delete(`/api/items/${id}`),
}; 