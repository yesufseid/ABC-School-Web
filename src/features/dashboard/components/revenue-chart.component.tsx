import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubscriptionPlanStat } from "../types/dashboard.types";

type RevenueChartProps = {
  data: SubscriptionPlanStat[];
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function RevenueChart({ data }: RevenueChartProps) {
  const chartConfig: ChartConfig = {};
  const chartData = data.map((d, i) => {
    const key = d.subscriptionId;
    chartConfig[key] = {
      label: d.name,
      color: COLORS[i % COLORS.length],
    };
    return {
      name: d.name,
      value: d.totalRevenue,
      fill: COLORS[i % COLORS.length],
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Revenue by Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No revenue data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <PieChart>
              <Tooltip
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Legend
                content={<ChartLegendContent nameKey="name" />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                strokeWidth={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
