
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
  fetchAuthStatus: () => Promise<void>; // Added this method
}

const API_BASE_URL = 'https://antipiracy.whyxpose.com/api';

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
        },
        fetchAuthStatus: async () => {
          try {
            // Check if there's an active session using a dedicated endpoint or the user profile endpoint
            const response = await axios.get(`${API_BASE_URL}/auth/check_session`, {
              withCredentials: true
            });
            
            if (response.status === 200 && response.data.user) {
              set({ 
                user: response.data.user,
                isAuthenticated: true
              });
            } else {
              set({ 
                user: null,
                isAuthenticated: false
              });
            }
          } catch (error) {
            // If request fails, user is not authenticated
            set({ 
              user: null, 
              isAuthenticated: false 
            });
          }
        }
      }),
      {
        name: 'auth-storage'
      }
    )
  )
);
