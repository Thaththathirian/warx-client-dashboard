
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Activity } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from 'recharts';

interface DetectionActivityChartProps {
  timeframe: 'daily' | 'weekly' | 'monthly';
  setTimeframe: (value: 'daily' | 'weekly' | 'monthly') => void;
  detectionData: any[];
  colors: Record<string, string>;
}

const DetectionActivityChart = ({ 
  timeframe, 
  setTimeframe, 
  detectionData, 
  colors 
}: DetectionActivityChartProps) => {
  return (
    <Card className="h-full">
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
      <CardContent className="pt-2">
        <div className="h-[320px] w-full">
          <ChartContainer
            config={{
              detected: { color: colors.detected },
              enforced: { color: colors.enforced },
              removed: { color: colors.removed },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={detectionData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorDetected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.detected} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors.detected} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorEnforced" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.enforced} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors.enforced} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorRemoved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.removed} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors.removed} stopOpacity={0.1}/>
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
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="detected" 
                  stroke={colors.detected} 
                  fillOpacity={1} 
                  fill="url(#colorDetected)" 
                  name="Detected"
                />
                <Area 
                  type="monotone" 
                  dataKey="enforced" 
                  stroke={colors.enforced} 
                  fillOpacity={1} 
                  fill="url(#colorEnforced)" 
                  name="Enforced"
                />
                <Area 
                  type="monotone" 
                  dataKey="removed" 
                  stroke={colors.removed} 
                  fillOpacity={1}
                  fill="url(#colorRemoved)" 
                  name="Removed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionActivityChart;
