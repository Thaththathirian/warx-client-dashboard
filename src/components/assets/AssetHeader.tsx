
import { useState } from 'react';
import { Asset } from '@/store/assetStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';

interface AssetHeaderProps {
  asset: Asset;
  onBack: () => void;
  assetDetail: any; // Using any type to avoid duplicating the entire type structure
  calculateProgress: () => number;
}

export function AssetHeader({ asset, onBack, assetDetail, calculateProgress }: AssetHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to all assets
        </Button>
        <Badge variant={asset.status === 'active' ? 'success' : 'outline'}>
          {asset.status}
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{assetDetail.asset.name}</h2>
            <div className="text-sm text-muted-foreground">
              Project ID: {assetDetail.asset.project_id}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{assetDetail.asset.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Timeline Progress</span>
              <span>{calculateProgress()}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{new Date(assetDetail.asset.start_date).toLocaleDateString()}</span>
              <span>{new Date(assetDetail.asset.end_date).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
