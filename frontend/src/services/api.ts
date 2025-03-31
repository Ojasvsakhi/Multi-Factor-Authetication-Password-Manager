import axios from 'axios';
import { API_URL, axiosConfig } from '../config/api';

const api = axios.create({
  ...axiosConfig,
  baseURL: API_URL
});

// Define response types
interface OTPResponse {
  message: string;
  email: string;
}

interface VerifyOTPResponse {
  status: string;
  message: string;
  email: string;
}

export const authApi = {
  sendOTP: (email: string) => 
    api.post<OTPResponse>('/api/send-otp', { email }),
    
  verifyOTP: (otp: string) => 
    api.post<VerifyOTPResponse>('/api/verify-otp', { otp }),
    
  checkHealth: () => 
    api.get<{status: string, session_active: boolean}>('/health'),
  logout: () => 
    api.post('/api/logout')
};

// Add interceptor for session handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 400 && error.response?.data?.error === 'No active OTP session') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;