import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "../types/dashboard.types";

type RecentSubscriptionsTableProps = {
  data: DashboardStats["data"]["recentSubscriptions"];
};

export function RecentSubscriptionsTable({
  data,
}: RecentSubscriptionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Recent Subscriptions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No subscriptions yet
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((sub, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    {sub.schoolName}
                  </TableCell>
                  <TableCell>{sub.planName}</TableCell>
                  <TableCell>
                    {format(new Date(sub.startDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(sub.endDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    ${sub.paidAmount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
