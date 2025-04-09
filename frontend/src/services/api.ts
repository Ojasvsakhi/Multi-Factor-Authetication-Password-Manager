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
interface UserDataResponse {
  status: string;
  data: {
    username: string;
    email: string;
    passwords: Array<{
      id: number;
      service: string;
      username: string;
      password: string;
      category: string;
      created_at: string;
      updated_at: string;
    }>;
    last_login: string | null;
  };
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
  getUserData: async (email: string, masterkey: string): Promise<UserDataResponse> => {
    try {
      const response = await api.post('/api/user/data', {  // Use api instance instead of axios
        email,
        masterkey
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  },
  addPassword: async (data: {
    service: string;
    username: string;
    password: string;
    category: string;
    email: string;
    masterkey: string;
  }) => {
    try {
      const response = await axios.post('/api/passwords/add', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to add password');
    }
  },
  backupData: async (data: { email: string; masterkey: string }) => {
    try {
      const response = await axios.post('/api/user/backup', data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to backup data');
    }
  },
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