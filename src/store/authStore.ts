
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  user_id: number;
  name: string;
  email: string;
  profile: string;
  company_id: number;
  user_type: string;
  logged_in: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const response = await axios.post(`${API_BASE_URL}/auth/company_login`, {
              email,
              password
            }, {
              withCredentials: true // Add this for cookie-based auth
            });
            
            if (response.status === 200) {
              set({ 
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false 
              });
              toast.success('Login successful');
              return;
            }
            
            set({ isLoading: false, error: 'An error occurred' });
          } catch (error: any) {
            set({ 
              isLoading: false, 
              error: error.response?.data?.message || 'Login failed' 
            });
            toast.error(error.response?.data?.message || 'Login failed');
          }
        },
        logout: () => {
          set({ user: null, isAuthenticated: false });
          toast.info('Logged out successfully');
        }
      }),
      {
        name: 'auth-storage'
      }
    )
  )
);
