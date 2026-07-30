import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  BranchDistributionFilter,
  BranchDistributionItem,
} from "../types/dashboard.types";

type BranchDistributionChartProps = {
  data: BranchDistributionItem[];
};

export function BranchDistributionChart({
  data,
}: BranchDistributionChartProps) {
  const [filter, setFilter] = useState<BranchDistributionFilter>("Students");

  return (
    <Card className="border-border/40 bg-card/80">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base font-semibold">
          Branch Distribution
        </CardTitle>
        <Select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as BranchDistributionFilter)
          }
          className="h-8 w-32"
        >
          <option value="Students">Students</option>
          <option value="Teachers">Teachers</option>
          <option value="Parents">Parents</option>
        </Select>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex h-8 overflow-hidden rounded-lg">
            {data.map((item) => (
              <div
                key={item.branch}
                className="flex items-center justify-center text-[10px] font-medium text-white transition-all"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                  minWidth: item.percentage > 8 ? undefined : "2rem",
                }}
                title={`${item.branch}: ${item.percentage}%`}
              >
                {item.percentage >= 10 ? `${item.percentage}%` : ""}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {data.map((item) => (
              <div
                key={item.branch}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {item.branch}
              </div>
            ))}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider">
                Branch
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider">
                Total
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider">
                Percentage
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.branch}>
                <TableCell className="font-medium">
                  {index + 1} {item.branch}
                </TableCell>
                <TableCell>{item.total.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {item.percentage.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
