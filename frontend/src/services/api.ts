import axios from 'axios';

const api = axios.create({
  baseURL: 'https://127.0.0.1/api',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('@repik:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
