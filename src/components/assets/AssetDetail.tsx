
import { useState } from 'react';
import { useAssetStore, Asset } from '@/store/assetStore';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from '@/components/dashboard/StatCard';
import { Activity, Users, Network, Database, ArrowLeft } from 'lucide-react';
import { Shield, Check } from './icons/CustomIcons';
import AssetMap from './AssetMap';
import PiratedLinksTable from './PiratedLinksTable';
import LatestPeersTable from './LatestPeersTable';
import TorrentClientChart from './TorrentClientChart';
import DetectionActivityChart from './DetectionActivityChart';
import CountryDistributionChart from './CountryDistributionChart';
import IspDistributionChart from './IspDistributionChart';
import DetectionTimelineChart from './DetectionTimelineChart';
import PlatformDistributionChart from './PlatformDistributionChart';
import AssetPreview from './AssetPreview';
import TorrentActivityChart from './TorrentActivityChart';
import AssetDetailsInfo from './AssetDetailsInfo';
import AssetDetailSkeleton from './AssetDetailSkeleton';
import { AssetHeader } from './AssetHeader';

// Also import the missing components that were referenced
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AssetDetailProps {
  asset: Asset;
}

const COLORS = {
  detected: '#0088FE',
  enforced: '#00C49F',
  removed: '#FF8042',
};

export function AssetDetail({ asset }: AssetDetailProps) {
  const { selectAsset, assetDetail, isLoadingDetail } = useAssetStore();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [activeTab, setActiveTab] = useState<'overview' | 'torrents' | 'links'>('overview');

  const handleBack = () => {
    selectAsset(null);
  };

  // Get the activity data based on the selected timeframe
  const getActivityData = () => {
    if (!assetDetail) return [];
    
    switch (timeframe) {
      case 'daily':
        return assetDetail.statistics.daily_stats.map(item => ({
          name: item.day,
          detected: item.count.detected,
          enforced: item.count.enforced,
          removed: item.count.removed,
        }));
      case 'weekly':
        return assetDetail.statistics.weekly_stats.map(item => ({
          name: item.week,
          detected: item.count.detected,
          enforced: item.count.enforced,
          removed: item.count.removed,
        }));
      case 'monthly':
        return assetDetail.statistics.monthly_stats.map(item => ({
          name: item.month,
          detected: item.count.detected,
          enforced: item.count.enforced,
          removed: item.count.removed,
        }));
      default:
        return [];
    }
  };

  // Prepare platform data for a pie chart
  const getPlatformData = () => {
    if (!assetDetail) return [];
    
    return assetDetail.count.detected.map(item => ({
      name: item.name,
      value: item.link_count,
      color: item.color_code,
      icon: item.icon,
    }));
  };

  // Prepare country data for a bar chart
  const getCountryData = () => {
    if (!assetDetail?.torrent?.country_stats) return [];
    
    return assetDetail.torrent.country_stats
      .slice(0, 10) // Top 10 countries
      .map(item => ({
        name: item.country,
        total: item.total,
        seeders: item.seeders,
        leechers: item.leechers,
        country_code: item.country_code,
      }));
  };

  // Prepare ISP data for a bar chart
  const getIspData = () => {
    if (!assetDetail?.torrent?.isp_stats) return [];
    
    return assetDetail.torrent.isp_stats
      .slice(0, 5) // Top 5 ISPs
      .map(item => ({
        name: item.isp,
        value: item.count,
      }));
  };

  // Prepare torrent activity data for a line chart
  const getTorrentActivityData = () => {
    if (!assetDetail?.torrent?.activity) return [];
    
    return assetDetail.torrent.activity.map(item => ({
      name: item.date,
      uniqueIPs: item.unique_ips,
    }));
  };

  // Calculate completion percentage based on days passed
  const calculateProgress = () => {
    if (!assetDetail) return 0;
    
    const startDate = new Date(assetDetail.asset.start_date);
    const endDate = new Date(assetDetail.asset.end_date);
    const currentDate = new Date();
    
    const totalDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    const daysPassed = (currentDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    
    return Math.min(Math.max(Math.round((daysPassed / totalDays) * 100), 0), 100);
  };

  if (isLoadingDetail) {
    return <AssetDetailSkeleton onBack={handleBack} />;
  }

  if (!assetDetail) {
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
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground">No data available for this asset.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const detectionData = getActivityData();
  const platformData = getPlatformData();
  const countryData = getCountryData();
  const ispData = getIspData();
  const torrentActivityData = getTorrentActivityData();
  const hasTorrentData = !!assetDetail.torrent;

  return (
    <div className="space-y-6">
      <AssetHeader 
        asset={asset} 
        onBack={handleBack} 
        assetDetail={assetDetail} 
        calculateProgress={calculateProgress} 
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Detections"
          value={assetDetail.count.totals.detected.toString()}
          icon={<Activity className="h-4 w-4" />}
          delay={0}
        />
        <StatCard
          title="Enforcements"
          value={assetDetail.count.totals.enforced.toString()}
          icon={<Shield className="h-4 w-4" />}
          delay={1}
        />
        <StatCard
          title="Removals"
          value={assetDetail.count.totals.removed.toString()}
          icon={<Check className="h-4 w-4" />}
          delay={2}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'torrents' | 'links')}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="torrents" disabled={!hasTorrentData}>Torrent Data</TabsTrigger>
          <TabsTrigger value="links">Pirated Links</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <DetectionActivityChart 
                timeframe={timeframe} 
                setTimeframe={setTimeframe} 
                detectionData={detectionData} 
                colors={COLORS} 
              />

              {hasTorrentData && (
                <CountryDistributionChart countryData={countryData} />
              )}
            </div>
            
            <div className="space-y-6">
              <AssetPreview 
                imageSrc={assetDetail.asset.image} 
                assetName={assetDetail.asset.name} 
              />
              
              <PlatformDistributionChart platformData={platformData} />
              
              {hasTorrentData && (
                <TorrentActivityChart 
                  torrentActivityData={torrentActivityData} 
                  stats={assetDetail.torrent.stats} 
                />
              )}
              
              <AssetDetailsInfo asset={assetDetail.asset} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="torrents" className="space-y-6 mt-6">
          {!hasTorrentData ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-40">
                  <p className="text-muted-foreground">No torrent data available for this asset.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  title="Total Peers"
                  value={assetDetail.torrent?.stats.peer_count.toString() || "0"}
                  icon={<Users className="h-4 w-4" />}
                  delay={0}
                />
                <StatCard
                  title="Unique IPs"
                  value={assetDetail.torrent?.stats.unique_ip_count.toString() || "0"}
                  icon={<Network className="h-4 w-4" />}
                  delay={1}
                />
                <StatCard
                  title="Torrent Count"
                  value={assetDetail.torrent?.stats.torrent_count.toString() || "0"}
                  icon={<Database className="h-4 w-4" />}
                  delay={2}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AssetMap />
                <TorrentClientChart />
              </div>

              <IspDistributionChart ispData={ispData} />

              <LatestPeersTable />
            </>
          )}
        </TabsContent>

        <TabsContent value="links" className="space-y-6 mt-6">
          <PiratedLinksTable />
          
          <DetectionTimelineChart 
            detectionData={detectionData} 
            timeframe={timeframe} 
            colors={COLORS} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
