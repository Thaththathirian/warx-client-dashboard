
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
  // Add colors to the ISP data
  const coloredIspData = ispData.map((item, index) => {
    const colors = ["#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"];
    return {
      ...item,
      fill: colors[index % colors.length]
    };
  });
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <BarChart className="h-5 w-5 mr-2" />
          Top ISP Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[320px] w-full">
          <ChartContainer 
            config={{
              value: { color: "#8b5cf6" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={coloredIspData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 130, bottom: 5 }}
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
