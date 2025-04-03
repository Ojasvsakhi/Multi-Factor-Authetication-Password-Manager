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
  success: number;
}

interface VerifyOTPResponse {
  status?: string;  // Only present in success responses
  message?: string; // Only present in success responses
  email?: string;   // Only present in success responses
  error?: string;   // Only present in error responses
}

export const authApi = {
  sendOTP: (email: string) => 
    api.post<OTPResponse>('/api/send-otp', { email }),
    
  verifyOTP: (otp: string) => 
    api.post<VerifyOTPResponse>('/api/verify-otp', { otp }),
    
  checkHealth: () => 
    api.get<{status: string, session_active: boolean}>('/health'),
  verifyUser: (user: { username: string, masterkey: string }) =>
    api.post('/api/verify-user', user),
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