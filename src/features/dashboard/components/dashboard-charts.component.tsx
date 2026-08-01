import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ReactNode } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import type { ChartWidget } from "../types/dashboard.types";

const CHART_PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="border-border/40 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

type PieStatChartProps = {
  data: ChartWidget["data"];
};

function PieStatChart({ data }: PieStatChartProps) {
  const config = data.reduce<ChartConfig>((config, item) => {
    config[item.name] = { label: item.name };
    return config;
  }, {});

  return (
    <div className="flex flex-col items-center">
      <ChartContainer config={config} className="aspect-auto h-64 w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={CHART_PALETTE[index % CHART_PALETTE.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((entry, index) => (
          <div
            key={entry.name}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{
                backgroundColor:
                  CHART_PALETTE[index % CHART_PALETTE.length],
              }}
            />
            <span className="font-medium text-foreground">{entry.name}</span>
            <span>{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type BarStatChartProps = {
  data: ChartWidget["data"];
};

function BarStatChart({ data }: BarStatChartProps) {
  return (
    <ChartContainer
      config={{ value: { label: "Count" } }}
      className="aspect-auto h-64 w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Bar
          dataKey="value"
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

type LineStatChartProps = {
  data: ChartWidget["data"];
};

function LineStatChart({ data }: LineStatChartProps) {
  return (
    <ChartContainer
      config={{ value: { label: "Count" } }}
      className="aspect-auto h-64 w-full"
    >
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="value"
          type="monotone"
          stroke="var(--chart-1)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  );
}

type DashboardChartsProps = {
  data: ChartWidget[];
};

export function DashboardCharts({ data }: DashboardChartsProps) {
  if (data.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((chart) => (
        <ChartCard key={`${chart.type}-${chart.title}`} title={chart.title}>
          {chart.type === "pie" && <PieStatChart data={chart.data} />}
          {chart.type === "bar" && <BarStatChart data={chart.data} />}
          {chart.type === "line" && <LineStatChart data={chart.data} />}
        </ChartCard>
      ))}
    </div>
  );
}
