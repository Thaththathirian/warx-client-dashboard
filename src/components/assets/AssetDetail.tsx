
import { useState } from 'react';
import { useAssetStore, Asset, AssetDetail as AssetDetailType } from '@/store/assetStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Image, 
  ArrowLeft, 
  Info, 
  Hash, 
  Clock, 
  FileText,
  Activity,
  Globe,
  BarChart,
  PieChart,
  LineChart,
  Network,
  Users
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import StatCard from '@/components/dashboard/StatCard';

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

  if (isLoadingDetail) {
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
          <Skeleton className="h-6 w-20" />
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-[200px] w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[150px] w-full" />
            <Skeleton className="h-[150px] w-full" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

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
        <Badge variant={assetDetail.asset.status === 'active' ? 'success' : 'outline'}>
          {assetDetail.asset.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
          
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                <CardTitle>Detection Activity</CardTitle>
              </div>
              <Tabs 
                value={timeframe} 
                onValueChange={(value) => setTimeframe(value as 'daily' | 'weekly' | 'monthly')}
                className="ml-auto"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="daily" className="text-xs h-7">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="text-xs h-7">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="text-xs h-7">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ChartContainer
                  config={{
                    detected: { color: COLORS.detected },
                    enforced: { color: COLORS.enforced },
                    removed: { color: COLORS.removed },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={detectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.detected} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.detected} stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorEnforced" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.enforced} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.enforced} stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorRemoved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.removed} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS.removed} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        fontSize={12}
                        tickMargin={10}
                        tickFormatter={(value) => {
                          if (timeframe === 'daily') {
                            return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          } else if (timeframe === 'monthly') {
                            return new Date(value + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                          }
                          return value;
                        }}
                      />
                      <YAxis fontSize={12} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip content={<ChartTooltipContent />} />
                      <Area 
                        type="monotone" 
                        dataKey="detected" 
                        stroke={COLORS.detected} 
                        fillOpacity={1} 
                        fill="url(#colorDetected)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="enforced" 
                        stroke={COLORS.enforced} 
                        fillOpacity={1} 
                        fill="url(#colorEnforced)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="removed" 
                        stroke={COLORS.removed} 
                        fillOpacity={1}
                        fill="url(#colorRemoved)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {assetDetail.torrent && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  <CardTitle>Geographic Distribution</CardTitle>
                </div>
                <CardDescription>
                  Top 10 countries by peer count
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer 
                    config={{
                      total: { color: "#3b82f6" },
                      seeders: { color: "#22c55e" },
                      leechers: { color: "#f97316" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={countryData}
                        layout="vertical"
                        margin={{ top: 10, right: 10, left: 80, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" fontSize={12} />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          fontSize={12}
                          width={75}
                          tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                        />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="leechers" name="Leechers" fill="#f97316" stackId="a" />
                        <Bar dataKey="seeders" name="Seeders" fill="#22c55e" stackId="a" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          )}
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
                {assetDetail.asset.image ? (
                  <img 
                    src={assetDetail.asset.image} 
                    alt={assetDetail.asset.name}
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
                <PieChart className="mr-2 h-5 w-5" />
                <CardTitle>Platform Distribution</CardTitle>
              </div>
              <CardDescription>
                Detection breakdown by platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] w-full">
                <ChartContainer config={{}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltipContent nameKey="name" labelKey="value" />} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          {assetDetail.torrent && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Network className="mr-2 h-5 w-5" />
                  <CardTitle>Torrent Activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ChartContainer
                    config={{
                      uniqueIPs: { color: "#8b5cf6" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={torrentActivityData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis fontSize={12} />
                        <Tooltip content={<ChartTooltipContent labelKey="uniqueIPs" />} />
                        <Line 
                          type="monotone" 
                          dataKey="uniqueIPs"
                          name="Unique IPs" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Seeders</div>
                    <div className="text-lg font-bold">{assetDetail.torrent.stats.seeder_count}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Leechers</div>
                    <div className="text-lg font-bold">{assetDetail.torrent.stats.leecher_count}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
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
                    <span className="block font-medium">{assetDetail.asset.id}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Project ID</span>
                    <span className="block font-medium">{assetDetail.asset.project_id}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Calendar className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Time Period</span>
                    <span className="block font-medium">
                      {new Date(assetDetail.asset.start_date).toLocaleDateString()} - {new Date(assetDetail.asset.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Created</span>
                    <span className="block font-medium">
                      {new Date(assetDetail.asset.created_at).toLocaleString()}
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="mr-2 h-4 w-4 mt-0.5 text-gray-500" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Last Updated</span>
                    <span className="block font-medium">
                      {new Date(assetDetail.asset.updated_at).toLocaleString()}
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

// Additional icons that Lucide doesn't directly provide
const Shield = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const Check = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
