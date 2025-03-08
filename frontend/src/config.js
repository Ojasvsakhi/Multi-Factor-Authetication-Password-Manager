const API_URL = process.env.NODE_ENV === 'production' 
  ? "https://password-manager-4qjf.onrender.com"
  : "http://localhost:5000";

export const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
};

export default API_URL;