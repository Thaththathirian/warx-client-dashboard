
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Database } from 'lucide-react';
import { useAssetStore } from '@/store/assetStore';

const TorrentClientBarChart = () => {
  const { assetDetail } = useAssetStore();

  if (!assetDetail?.torrent?.client_stats || assetDetail.torrent.client_stats.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Torrent Client Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-center items-center h-[320px]">
            <p className="text-muted-foreground">No client data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort clients by count and limit to top 8
  const clientData = [...assetDetail.torrent.client_stats]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((item, index) => {
      const colors = [
        "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", 
        "#f43f5e", "#fb7185", "#ff9580", "#ffb7a0"
      ];
      return {
        ...item,
        fill: colors[index % colors.length]
      };
    });

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Torrent Client Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[320px] w-full">
          <ChartContainer 
            config={{
              count: { color: "#8b5cf6" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clientData}
                margin={{ top: 5, right: 5, left: 5, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="client" 
                  fontSize={12}
                  angle={-45} 
                  textAnchor="end"
                  height={60}
                  tickFormatter={(value) => value.length > 16 ? `${value.substring(0, 16)}...` : value}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" name="Peer Count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TorrentClientBarChart;
