
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface IspDistributionChartProps {
  ispData: Array<{
    name: string;
    value: number;
  }>;
}

const IspDistributionChart = ({ ispData }: IspDistributionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Top ISP Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer 
            config={{
              value: { color: "#8b5cf6" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={ispData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 120, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  fontSize={12}
                  width={120}
                  tickFormatter={(value) => value.length > 18 ? `${value.substring(0, 18)}...` : value}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" name="Connection Count" fill="#8b5cf6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IspDistributionChart;
