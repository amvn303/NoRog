import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const postPredict = async (symptoms, behaviors = {}, goal = 'general wellness') => {
  const res = await api.post('/predict', { symptoms, behaviors, goal });
  return res.data;
};

export const postSimulate = async (condition, behaviors = {}) => {
  const res = await api.post('/simulate', { condition, behaviors });
  return res.data;
};

export const getHistory = async (limit = 10) => {
  const res = await api.get(`/history?limit=${limit}`);
  return res.data;
};

export const getDrift = async () => {
  const res = await api.get('/drift');
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get('/profile');
  return res.data;
};

export default api;
