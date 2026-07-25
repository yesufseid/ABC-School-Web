import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SubscriptionPlanStat } from "../types/dashboard.types";

type SubscriptionsByPlanChartProps = {
  data: SubscriptionPlanStat[];
};

const chartConfig = {
  schools: {
    label: "Schools",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function SubscriptionsByPlanChart({
  data,
}: SubscriptionsByPlanChartProps) {
  const chartData = data.map((d) => ({
    name: d.name,
    schools: d.tenantCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Subscriptions by Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No subscription data available
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="schools" fill="var(--color-schools)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
