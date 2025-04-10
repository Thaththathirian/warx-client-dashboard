
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart as PieIcon } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface PlatformDistributionChartProps {
  platformData: Array<{
    name: string;
    value: number;
    color: string;
    icon: string;
  }>;
}

const PlatformDistributionChart = ({ platformData }: PlatformDistributionChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <PieIcon className="mr-2 h-5 w-5" />
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
              <PieChart>
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
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformDistributionChart;
