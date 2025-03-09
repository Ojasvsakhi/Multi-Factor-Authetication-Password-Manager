export const API_URL = import.meta.env.VITE_API_URL || 'https://password-manager-4qjf.onrender.com';

export const axiosConfig = {
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
};