
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

export const useProtectedRoute = () => {
  const { isAuthenticated, fetchAuthStatus } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Set axios default to use credentials with all requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchAuthStatus();
      } catch (error) {
        console.error("Authentication check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [fetchAuthStatus]);

  // Redirect if not authenticated and not loading
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isLoading, isAuthenticated };
};
