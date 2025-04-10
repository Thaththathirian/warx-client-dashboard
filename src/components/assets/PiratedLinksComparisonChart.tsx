
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
import { BarChartIcon } from 'lucide-react';
import { useAssetStore } from '@/store/assetStore';

const PiratedLinksComparisonChart = () => {
  const { assetDetail } = useAssetStore();

  if (!assetDetail) return null;

  // Create data for the comparison chart
  const comparisonData = [
    {
      name: 'Today vs Yesterday',
      today: assetDetail.statistics.today.detected,
      yesterday: assetDetail.statistics.yesterday.detected,
    },
    {
      name: 'This Week vs Last Week',
      thisWeek: assetDetail.statistics.this_week.detected,
      lastWeek: assetDetail.statistics.last_week.detected,
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <BarChartIcon className="h-5 w-5 mr-2" />
          Pirated Links Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[320px] w-full">
          <ChartContainer
            config={{
              today: { color: "#0088FE", label: "Today" },
              yesterday: { color: "#8884d8", label: "Yesterday" },
              thisWeek: { color: "#00C49F", label: "This Week" },
              lastWeek: { color: "#FF8042", label: "Last Week" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="today" name="Today" fill="#0088FE" />
                <Bar dataKey="yesterday" name="Yesterday" fill="#8884d8" />
                <Bar dataKey="thisWeek" name="This Week" fill="#00C49F" />
                <Bar dataKey="lastWeek" name="Last Week" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PiratedLinksComparisonChart;
