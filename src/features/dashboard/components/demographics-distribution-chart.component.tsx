import { Pie, PieChart, Cell, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DemographicSlice } from "../types/dashboard.types";

type DemographicsDistributionChartProps = {
  languageData: DemographicSlice[];
  sexData: DemographicSlice[];
};

const languageChartConfig = {
  value: { label: "Language" },
  Amharic: { label: "Amharic", color: "#22d3ee" },
  Oromo: { label: "Oromo", color: "#34d399" },
  English: { label: "English", color: "#818cf8" },
} satisfies ChartConfig;

const sexChartConfig = {
  value: { label: "Sex" },
  Male: { label: "Male", color: "#22c55e" },
  Female: { label: "Female", color: "#06b6d4" },
} satisfies ChartConfig;

export function DemographicsDistributionChart({
  languageData,
  sexData,
}: DemographicsDistributionChartProps) {
  return (
    <Card className="border-border/40 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Language and Sex Distribution
        </CardTitle>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{ ...languageChartConfig, ...sexChartConfig }}
          className="mx-auto aspect-square max-h-[320px] w-full"
        >
          <PieChart>
            <Pie
              data={languageData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              strokeWidth={2}
              stroke="transparent"
            >
              {languageData.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
            <Pie
              data={sexData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              strokeWidth={2}
              stroke="transparent"
            >
              {sexData.map((entry) => (
                <Cell key={entry.label} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ChartContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground">Language</p>
            {languageData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
                <span className="ml-auto text-muted-foreground">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <p className="font-medium text-muted-foreground">Sex</p>
            {sexData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.label}</span>
                <span className="ml-auto text-muted-foreground">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
