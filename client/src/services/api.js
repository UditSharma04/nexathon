import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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
  updateItemStatus: (itemId, status) => 
    api.patch(`/api/items/${itemId}/status`, { status }),
};

export const bookingsAPI = {
  getRequests: () => api.get('/api/bookings/requests'),
  acceptRequest: (requestId) => api.post(`/api/bookings/requests/${requestId}/accept`),
  declineRequest: (requestId) => api.post(`/api/bookings/requests/${requestId}/decline`),
  createRequest: (itemId, requestData) => api.post('/api/booking-requests', {
    itemId,
    ...requestData
  }),
  getMyRequests: () => api.get('/api/booking-requests/my-requests'),
  getIncomingRequests: () => api.get('/api/booking-requests/incoming'),
  updateRequestStatus: (requestId, status, additionalData = {}) => 
    api.patch(`/api/booking-requests/${requestId}/status`, { 
      status,
      ...additionalData
    }),
  updateBookingStatus: (bookingId, updateData) => 
    api.patch(`/api/booking-requests/${bookingId}/payment`, updateData),
};

export const reviewAPI = {
  createReview: (data) => api.post('/api/reviews', data),
  getItemReviews: (itemId) => api.get(`/api/reviews/item/${itemId}`),
  getUserReviews: (userId) => api.get(`/api/reviews/user/${userId}`),
};