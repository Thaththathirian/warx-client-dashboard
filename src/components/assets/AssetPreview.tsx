
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Image } from 'lucide-react';

interface AssetPreviewProps {
  imageSrc: string;
  assetName: string;
}

const AssetPreview = ({ imageSrc, assetName }: AssetPreviewProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Image className="mr-2 h-5 w-5" />
          <h3 className="text-lg font-semibold">Asset Preview</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={assetName}
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
  );
};

export default AssetPreview;
