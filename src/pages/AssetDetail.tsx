
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AssetDetail as AssetDetailComponent } from '@/components/assets/AssetDetail';
import { useAssetStore } from '@/store/assetStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const AssetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { getAssets, assets, selectedAsset, selectAsset, getAssetDetail } = useAssetStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // If no assets loaded, get them first
    if (assets.length === 0) {
      getAssets();
    }
    
    // If we have an ID but no selected asset, find and select it
    if (id && (!selectedAsset || selectedAsset.id.toString() !== id)) {
      const asset = assets.find(a => a.id.toString() === id);
      if (asset) {
        selectAsset(asset);
      } else if (id) {
        // If we couldn't find the asset in the loaded assets, try to get its details directly
        getAssetDetail(parseInt(id));
      }
    }
  }, [id, user, assets, selectedAsset, navigate, getAssets, selectAsset, getAssetDetail]);

  const handleBack = () => {
    navigate('/assets');
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {selectedAsset ? (
          <AssetDetailComponent 
            asset={selectedAsset} 
            onBack={handleBack}
          />
        ) : (
          <div className="text-center py-12">
            <p>Loading asset details...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AssetDetailPage;
