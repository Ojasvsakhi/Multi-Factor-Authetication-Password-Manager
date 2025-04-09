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
  success: boolean;
  is_registration?: boolean;
}

interface VerifyOTPResponse {
  status?: string;
  message?: string;
  email?: string; 
  error?: string; 
  next_step?: string;
}
interface OTPSend{
  email: string;
  isRegister: boolean;
}
interface VerifymasterkeyResponse {
  status?: string;
  message?: string;
}
export const authApi = {
  sendOTP: (data: OTPSend) => 
    api.post<OTPResponse>('/api/send-otp',data),
    
  verifyOTP: (otp: string) => 
    api.post<VerifyOTPResponse>('/api/verify-otp', { otp }),
  delete_users: () =>
    api.post<Response>('/api/delete-all-users'),
  checkHealth: () => 
    api.get<{status: string, session_active: boolean}>('/health'),
  verifyUser: (user: { username: string, masterkey: string, is_registration: boolean }) =>
    api.post<VerifymasterkeyResponse>('/api/verify-user-masterkey', user),
  verifyMatrix: (data: { 
    matrix: number[][], 
    imageIndex: number,
    is_registration: boolean,
    is_authenticated: boolean 
  }) => api.post('/api/verify-matrix', data),
  getSavedPattern: (email: string) =>
    api.get(`/api/get-pattern/${email}`),
  getDashboardInfo: () => 
    axios.get('/api/dashboard/initial', { withCredentials: true }),
  logout: () => 
    api.post('/api/logout'),
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