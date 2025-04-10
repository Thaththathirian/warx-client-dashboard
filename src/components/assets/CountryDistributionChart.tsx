
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Globe } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

interface CountryDistributionChartProps {
  countryData: Array<{
    name: string;
    total: number;
    seeders: number;
    leechers: number;
    country_code: string;
  }>;
}

const CountryDistributionChart = ({ countryData }: CountryDistributionChartProps) => {
  return (
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
              <BarChart
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
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountryDistributionChart;
