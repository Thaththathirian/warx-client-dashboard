
import { useAssetStore } from '@/store/assetStore';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Image } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function AssetGrid() {
  const { assets, isLoading, selectAsset } = useAssetStore();

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!assets.length) {
    return (
      <div className="text-center py-10 border rounded-md bg-white dark:bg-gray-800">
        <Image className="w-10 h-10 mx-auto text-gray-400" />
        <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">No assets found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your content assets will appear here once they are added.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
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
            <div className="absolute top-2 right-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                asset.status === 'active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {asset.status}
              </span>
            </div>
          </div>
          
          <CardHeader className="pb-2">
            <h3 className="text-lg font-semibold truncate">{asset.name}</h3>
          </CardHeader>
          
          <CardContent className="pb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{asset.description}</p>
            
            <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="mr-1 h-3 w-3" />
              <span>
                {new Date(asset.start_date).toLocaleDateString()} - {new Date(asset.end_date).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
          
          <CardFooter className="pt-0 flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Updated {formatDistanceToNow(new Date(asset.updated_at), { addSuffix: true })}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => selectAsset(asset)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
