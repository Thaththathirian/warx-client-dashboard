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
  YAxis,
  Legend
} from 'recharts';
import { BarChart as BarChartIcon } from 'lucide-react';
import { useAssetStore } from '@/store/assetStore';

const PiratedLinksBarChart = () => {
  const { assetDetail } = useAssetStore();

  if (!assetDetail) return null;

  // Prepare data from all platforms (detected, enforced, removed)
  const platforms = new Map();
  
  // Process detected links
  assetDetail.count.detected.forEach(item => {
    platforms.set(item.name, { 
      name: item.name,
      detected: item.link_count,
      enforced: 0,
      removed: 0,
      color: item.color_code
    });
  });
  
  // Process enforced links
  assetDetail.count.enforced.forEach(item => {
    if (platforms.has(item.name)) {
      const platform = platforms.get(item.name);
      platform.enforced = item.link_count;
    } else {
      platforms.set(item.name, { 
        name: item.name,
        detected: 0,
        enforced: item.link_count,
        removed: 0,
        color: item.color_code
      });
    }
  });
  
  // Process removed links
  assetDetail.count.removed.forEach(item => {
    if (platforms.has(item.name)) {
      const platform = platforms.get(item.name);
      platform.removed = item.link_count;
    } else {
      platforms.set(item.name, { 
        name: item.name,
        detected: 0,
        enforced: 0,
        removed: item.link_count,
        color: item.color_code
      });
    }
  });
  
  const chartData = Array.from(platforms.values())
    .sort((a, b) => (b.detected + b.enforced + b.removed) - (a.detected + a.enforced + a.removed))
    .slice(0, 5); // Top 5 platforms
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <BarChartIcon className="h-5 w-5 mr-2" />
          Top Pirated Platforms
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex-grow">
        <div className="h-full w-full">
          <ChartContainer 
            config={{
              detected: { color: "#0088FE" },
              enforced: { color: "#00C49F" },
              removed: { color: "#FF8042" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category"
                  width={120}
                  fontSize={12}
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip 
                  content={<ChartTooltipContent />} 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                  wrapperStyle={{ 
                    opacity: 0.9, 
                    pointerEvents: 'none',
                    zIndex: 100,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '4px',
                    padding: '4px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend verticalAlign="bottom" />
                <Bar dataKey="detected" name="Detected" stackId="a" fill="#0088FE" />
                <Bar dataKey="enforced" name="Enforced" stackId="a" fill="#00C49F" />
                <Bar dataKey="removed" name="Removed" stackId="a" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PiratedLinksBarChart;