
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';

export const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Set axios default to use credentials with all requests
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return { isLoading, isAuthenticated };
};
