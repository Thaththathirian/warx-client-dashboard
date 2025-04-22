import { useState } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Activity } from 'lucide-react';
import { Shield, Check } from './icons/CustomIcons';
import PiratedLinksTable from './PiratedLinksTable';
import DetectionTimelineChart from './DetectionTimelineChart';
import PiratedLinksBarChart from './PiratedLinksBarChart';
import PiratedLinksComparisonChart from './PiratedLinksComparisonChart';
import PiratedLinksPieCharts from './PiratedLinksPieCharts';
import AssetDetailsInfo from './AssetDetailsInfo';

const LinksTabContent = ({ assetDetail, detectionData, timeframe, colors }) => {
  return (
    <TabsContent value="links" className="space-y-6 mt-6">
      <PiratedLinksPieCharts />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PiratedLinksBarChart />
          </div>
          <div className="lg:col-span-1">
            <AssetDetailsInfo asset={assetDetail.asset} />
          </div>
        </div>
        <DetectionTimelineChart 
          detectionData={detectionData} 
          timeframe={timeframe} 
          colors={colors} 
        />
      </div>
      
      <div className="mb-6">
        <PiratedLinksComparisonChart />
      </div>
      
      <PiratedLinksTable />
    </TabsContent>
  );
};

export default LinksTabContent;