import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Hash, FileText, Calendar, Clock, Info } from 'lucide-react';

interface AssetDetailsInfoProps {
  asset: {
    id: number;
    project_id: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
  };
}

const AssetDetailsInfo = ({ asset }: AssetDetailsInfoProps) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Info className="mr-2 h-5 w-5" />
          <h3 className="text-lg font-semibold">Asset Details</h3>
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow overflow-auto text-sm">
        <ul className="space-y-2">
          <li className="flex items-start">
            <Hash className="mr-2 h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <span className="block text-xs text-gray-500 dark:text-gray-400">Asset ID</span>
              <span className="block font-medium truncate">{asset.id}</span>
            </div>
          </li>
          <li className="flex items-start">
            <FileText className="mr-2 h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <span className="block text-xs text-gray-500 dark:text-gray-400">Project ID</span>
              <span className="block font-medium truncate">{asset.project_id}</span>
            </div>
          </li>
          <li className="flex items-start">
            <Calendar className="mr-2 h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <span className="block text-xs text-gray-500 dark:text-gray-400">Time Period</span>
              <span className="block font-medium truncate">
                {new Date(asset.start_date).toLocaleDateString()} - {new Date(asset.end_date).toLocaleDateString()}
              </span>
            </div>
          </li>
          <li className="flex items-start">
            <Clock className="mr-2 h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <span className="block text-xs text-gray-500 dark:text-gray-400">Created</span>
              <span className="block font-medium truncate">
                {new Date(asset.created_at).toLocaleString()}
              </span>
            </div>
          </li>
          <li className="flex items-start">
            <Clock className="mr-2 h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
            <div className="overflow-hidden">
              <span className="block text-xs text-gray-500 dark:text-gray-400">Last Updated</span>
              <span className="block font-medium truncate">
                {new Date(asset.updated_at).toLocaleString()}
              </span>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default AssetDetailsInfo;