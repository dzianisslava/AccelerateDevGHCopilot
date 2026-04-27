import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_URL, withCredentials: true });

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
  logout: () => localStorage.removeItem('token'),
};

export const mealsAPI = {
  getAll: () => api.get('/api/meals'),
  getById: (id: string) => api.get(`/api/meals/${id}`),
  create: (meal: any) => api.post('/api/meals', meal),
  update: (id: string, meal: any) => api.put(`/api/meals/${id}`, meal),
  delete: (id: string) => api.delete(`/api/meals/${id}`),
};

export const mealPlansAPI = {
  getByWeek: (weekStart: string) => api.get(`/api/meal-plans/week/${weekStart}`),
  addMeal: (planId: string, meal: any) => api.post(`/api/meal-plans/${planId}/items`, meal),
  removeMeal: (itemId: string) => api.delete(`/api/meal-plans/items/${itemId}`),
};

export default api;
