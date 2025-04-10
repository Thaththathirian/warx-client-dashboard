
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface TorrentActivityChartProps {
  torrentActivityData: Array<{
    name: string;
    uniqueIPs: number;
  }>;
  stats: {
    seeder_count: number;
    leecher_count: number;
  };
}

const TorrentActivityChart = ({ torrentActivityData, stats }: TorrentActivityChartProps) => {
  return (
    <Card className="h-full">
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
              <LineChart
                data={torrentActivityData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
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
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Seeders</div>
            <div className="text-lg font-bold">{stats.seeder_count || 0}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Leechers</div>
            <div className="text-lg font-bold">{stats.leecher_count || 0}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TorrentActivityChart;
