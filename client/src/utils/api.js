import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the Token
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('dyonak_user');
    if (user) {
        const token = JSON.parse(user).token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getClients = (type) => api.get(`/clients${type ? `?type=${type}` : ''}`);
export const addClient = (data) => api.post('/clients', data);

export const getDebts = () => api.get('/debts');
export const addDebt = (data) => api.post('/debts', data);

export const getExpenses = () => api.get('/expenses');
export const addExpense = (data) => api.post('/expenses', data);

export const getStats = () => api.get('/stats');

export default api;
