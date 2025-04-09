
import { useAssetStore, Asset } from '@/store/assetStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Image, 
  ArrowLeft, 
  Info, 
  Hash, 
  Clock, 
  FileText,
  Activity 
} from 'lucide-react';

interface AssetDetailProps {
  asset: Asset;
}

export function AssetDetail({ asset }: AssetDetailProps) {
  const { selectAsset } = useAssetStore();

  const handleBack = () => {
    selectAsset(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to all assets
        </Button>
        <Badge variant={asset.status === 'active' ? 'success' : 'outline'}>
          {asset.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">{asset.name}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">{asset.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                <h3 className="text-lg font-semibold">Analytics Overview</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Detections</div>
                  <div className="text-2xl font-bold">17</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Reports</div>
                  <div className="text-2xl font-bold">5</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Resolved Issues</div>
                  <div className="text-2xl font-bold">12</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Detection Rate</div>
                  <div className="text-2xl font-bold">78%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Image className="mr-2 h-5 w-5" />
                <h3 className="text-lg font-semibold">Asset Preview</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                {asset.image ? (
                  <img 
                    src={asset.image} 
                    alt={asset.name}
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="h-16 w-16 text-gray-300" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Info className="mr-2 h-5 w-5" />
                <h3 className="text-lg font-semibold">Asset Details</h3>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Hash className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Asset ID</span>
                    <span className="block font-medium">{asset.id}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Project ID</span>
                    <span className="block font-medium">{asset.project_id}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Calendar className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Time Period</span>
                    <span className="block font-medium">
                      {new Date(asset.start_date).toLocaleDateString()} - {new Date(asset.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Created</span>
                    <span className="block font-medium">
                      {new Date(asset.created_at).toLocaleString()}
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
                    <span className="block font-medium">
                      {new Date(asset.updated_at).toLocaleString()}
                    </span>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
