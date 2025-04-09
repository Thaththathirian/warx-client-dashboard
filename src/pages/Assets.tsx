
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAssetStore } from '@/store/assetStore';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { AssetDetail } from '@/components/assets/AssetDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Assets = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { getAssets, selectedAsset } = useAssetStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      getAssets();
    }
  }, [user, navigate, getAssets]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Content Assets</h1>
        
        <Tabs defaultValue={selectedAsset ? 'details' : 'grid'}>
          <TabsList className="mb-6">
            <TabsTrigger value="grid">All Assets</TabsTrigger>
            {selectedAsset && (
              <TabsTrigger value="details">{selectedAsset.name} Details</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="grid" className="mt-0">
            <AssetGrid />
          </TabsContent>
          
          {selectedAsset && (
            <TabsContent value="details" className="mt-0">
              <AssetDetail asset={selectedAsset} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Assets;
