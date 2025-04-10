
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Legend
} from 'recharts';
import { ChartPie } from 'lucide-react';
import { useAssetStore } from '@/store/assetStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PiratedLinksPieCharts = () => {
  const { assetDetail } = useAssetStore();
  const [dailyTab, setDailyTab] = useState('today');
  const [weeklyTab, setWeeklyTab] = useState('thisWeek');

  if (!assetDetail) return null;

  const COLORS = {
    detected: '#0088FE',
    enforced: '#00C49F',
    removed: '#FF8042',
  };

  // Create data for the daily comparison
  const todayData = [
    { name: 'Detected', value: assetDetail.statistics.today.detected, color: COLORS.detected },
    { name: 'Enforced', value: assetDetail.statistics.today.enforced, color: COLORS.enforced },
    { name: 'Removed', value: assetDetail.statistics.today.removed, color: COLORS.removed },
  ].filter(item => item.value > 0);

  const yesterdayData = [
    { name: 'Detected', value: assetDetail.statistics.yesterday.detected, color: COLORS.detected },
    { name: 'Enforced', value: assetDetail.statistics.yesterday.enforced, color: COLORS.enforced },
    { name: 'Removed', value: assetDetail.statistics.yesterday.removed, color: COLORS.removed },
  ].filter(item => item.value > 0);

  // Create data for the weekly comparison
  const thisWeekData = [
    { name: 'Detected', value: assetDetail.statistics.this_week.detected, color: COLORS.detected },
    { name: 'Enforced', value: assetDetail.statistics.this_week.enforced, color: COLORS.enforced },
    { name: 'Removed', value: assetDetail.statistics.this_week.removed, color: COLORS.removed },
  ].filter(item => item.value > 0);

  const lastWeekData = [
    { name: 'Detected', value: assetDetail.statistics.last_week.detected, color: COLORS.detected },
    { name: 'Enforced', value: assetDetail.statistics.last_week.enforced, color: COLORS.enforced },
    { name: 'Removed', value: assetDetail.statistics.last_week.removed, color: COLORS.removed },
  ].filter(item => item.value > 0);

  // Check if we have data to display
  const hasData = {
    today: todayData.length > 0,
    yesterday: yesterdayData.length > 0,
    thisWeek: thisWeekData.length > 0,
    lastWeek: lastWeekData.length > 0
  };

  const renderNoDataMessage = () => (
    <div className="flex items-center justify-center h-[280px]">
      <p className="text-muted-foreground">No data available for this period</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Today vs Yesterday Pie Chart */}
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <ChartPie className="h-5 w-5 mr-2" />
            Today vs Yesterday
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={dailyTab} onValueChange={(value) => setDailyTab(value)}>
            <TabsList className="mb-4">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
            </TabsList>
            <TabsContent value="today">
              {hasData.today ? (
                <div className="h-[280px] w-full">
                  <ChartContainer
                    config={{
                      detected: { color: COLORS.detected, label: "Detected" },
                      enforced: { color: COLORS.enforced, label: "Enforced" },
                      removed: { color: COLORS.removed, label: "Removed" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={todayData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {todayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : renderNoDataMessage()}
            </TabsContent>
            <TabsContent value="yesterday">
              {hasData.yesterday ? (
                <div className="h-[280px] w-full">
                  <ChartContainer
                    config={{
                      detected: { color: COLORS.detected, label: "Detected" },
                      enforced: { color: COLORS.enforced, label: "Enforced" },
                      removed: { color: COLORS.removed, label: "Removed" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={yesterdayData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {yesterdayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : renderNoDataMessage()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* This Week vs Last Week Pie Chart */}
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center">
            <ChartPie className="h-5 w-5 mr-2" />
            This Week vs Last Week
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={weeklyTab} onValueChange={(value) => setWeeklyTab(value)}>
            <TabsList className="mb-4">
              <TabsTrigger value="thisWeek">This Week</TabsTrigger>
              <TabsTrigger value="lastWeek">Last Week</TabsTrigger>
            </TabsList>
            <TabsContent value="thisWeek">
              {hasData.thisWeek ? (
                <div className="h-[280px] w-full">
                  <ChartContainer
                    config={{
                      detected: { color: COLORS.detected, label: "Detected" },
                      enforced: { color: COLORS.enforced, label: "Enforced" },
                      removed: { color: COLORS.removed, label: "Removed" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={thisWeekData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {thisWeekData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : renderNoDataMessage()}
            </TabsContent>
            <TabsContent value="lastWeek">
              {hasData.lastWeek ? (
                <div className="h-[280px] w-full">
                  <ChartContainer
                    config={{
                      detected: { color: COLORS.detected, label: "Detected" },
                      enforced: { color: COLORS.enforced, label: "Enforced" },
                      removed: { color: COLORS.removed, label: "Removed" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={lastWeekData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {lastWeekData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : renderNoDataMessage()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PiratedLinksPieCharts;
