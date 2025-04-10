
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAssetStore } from '@/store/assetStore';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AssetGrid } from '@/components/assets/AssetGrid';

const Assets = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { getAssets, selectAsset } = useAssetStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      getAssets();
      // Clear any selected asset when viewing the assets page
      selectAsset(null);
    }
  }, [user, navigate, getAssets, selectAsset]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Content Assets</h1>
        <AssetGrid onAssetClick={(asset) => navigate(`/assets/${asset.id}`)} />
      </div>
    </DashboardLayout>
  );
};

export default Assets;
