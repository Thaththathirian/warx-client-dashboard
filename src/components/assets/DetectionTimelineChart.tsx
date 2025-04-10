
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface DetectionTimelineChartProps {
  detectionData: any[];
  timeframe: 'daily' | 'weekly' | 'monthly';
  colors: Record<string, string>;
}

const DetectionTimelineChart = ({ detectionData, timeframe, colors }: DetectionTimelineChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Detection Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              detected: { color: colors.detected },
              enforced: { color: colors.enforced },
              removed: { color: colors.removed },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={detectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                <Line 
                  type="monotone" 
                  dataKey="detected" 
                  stroke={colors.detected} 
                  strokeWidth={2}
                  name="Detected"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="enforced" 
                  stroke={colors.enforced} 
                  strokeWidth={2}
                  name="Enforced"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="removed" 
                  stroke={colors.removed} 
                  strokeWidth={2}
                  name="Removed"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetectionTimelineChart;
