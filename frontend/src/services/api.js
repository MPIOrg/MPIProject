import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' }
});

export const register = (data) => API.post('/api/users', data);
export const login = (data) => API.post('/api/users/login', data);

export const getTransactions = (userId) => API.get(`/api/transactions/user/${userId}`);
export const addTransaction = (data) => API.post('/api/transactions', data);
export const updateTransaction = (id, data) => API.put(`/api/transactions/${id}`, data);
export const deleteTransaction = (id) => API.delete(`/api/transactions/${id}`);

export default API;