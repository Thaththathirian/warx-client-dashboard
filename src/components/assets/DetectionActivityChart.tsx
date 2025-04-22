import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChart3 } from "lucide-react";

interface DetectionActivityChartProps {
  timeframe: "daily" | "weekly" | "monthly";
  setTimeframe: (timeframe: "daily" | "weekly" | "monthly") => void;
  detectionData: Array<{
    name: string;
    detected: number;
    enforced: number;
    removed: number;
  }>;
  colors: {
    detected: string;
    enforced: string;
    removed: string;
  };
}

const DetectionActivityChart = ({
  timeframe,
  setTimeframe,
  detectionData,
  colors,
}: DetectionActivityChartProps) => {
  return (
    <Card>
      <CardHeader className="flex sm:flex-row flex-col gap-5 items-center justify-between pb-2">
        <div className="flex items-center ">
          <BarChart3 className="mr-2 h-5 w-5" />
          <CardTitle>Detection Activity</CardTitle>
        </div>

        {/* <div className="flex items-center flex-col space-x-2"> */}
          <ToggleGroup
            type="single"
            defaultValue={timeframe}
            value={timeframe}
            onValueChange={(value) =>
              value && setTimeframe(value as "daily" | "weekly" | "monthly")
            }
            className="justify-end"
          >
            <ToggleGroupItem value="daily" size="sm">
              Daily
            </ToggleGroupItem>
            <ToggleGroupItem value="weekly" size="sm">
              Weekly
            </ToggleGroupItem>
            <ToggleGroupItem value="monthly" size="sm">
              Monthly
            </ToggleGroupItem>
          </ToggleGroup>
        {/* </div> */}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full overflow-hidden">
          <ChartContainer
            config={{
              detected: { color: colors.detected },
              enforced: { color: colors.enforced },
              removed: { color: colors.removed },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={detectionData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) =>
                    value.length > 10 ? `${value.substring(0, 10)}...` : value
                  }
                />
                <YAxis fontSize={12} />
                <Tooltip
                  content={<ChartTooltipContent />}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                  wrapperStyle={{
                    opacity: 0.9,
                    pointerEvents: "none",
                    zIndex: 100,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "4px",
                    padding: "4px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingTop: "8px" }}
                />
                <Area
                  type="monotone"
                  dataKey="detected"
                  name="Detected"
                  stackId="1"
                  stroke={colors.detected}
                  fill={colors.detected}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="enforced"
                  name="Enforced"
                  stackId="1"
                  stroke={colors.enforced}
                  fill={colors.enforced}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="removed"
                  name="Removed"
                  stackId="1"
                  stroke={colors.removed}
                  fill={colors.removed}
                  fillOpacity={0.6}
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
