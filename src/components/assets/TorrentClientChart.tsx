
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAssetStore } from '@/store/assetStore';
import { PieChart as PieIcon } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const TorrentClientChart = () => {
  const { assetDetail } = useAssetStore();
  
  if (!assetDetail?.torrent?.client_stats || assetDetail.torrent.client_stats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieIcon className="h-5 w-5 mr-2" />
            Client Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center p-6">
            <p className="text-muted-foreground">No client data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = assetDetail.torrent.client_stats.map((item, index) => ({
    name: item.client,
    value: item.count,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <PieIcon className="h-5 w-5 mr-2" />
          Client Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer
            config={{}}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent nameKey="name" labelKey="value" />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TorrentClientChart;
