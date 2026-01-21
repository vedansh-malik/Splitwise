// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://splitwise-5krm.onrender.com/api',
});

// Automatically add token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;