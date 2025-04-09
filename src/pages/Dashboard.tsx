import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setContent(`Welcome, ${user.name}! You are on page: ${page || 'main'}`);
    }
  }, [user, navigate, page]);

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {content ? (
          <p>{content}</p>
        ) : (
          <p>Loading dashboard content...</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
