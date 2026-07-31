import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecentSubscription } from "../types/dashboard.types";

type RecentSubscriptionsCardProps = {
  data: RecentSubscription[];
};

function formatDate(value: string) {
  return format(parseISO(value), "MMM d, yyyy");
}

export function RecentSubscriptionsCard({
  data,
}: RecentSubscriptionsCardProps) {
  return (
    <Card className="border-border/40 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Recent Subscriptions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider">
                School
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider">
                Plan
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider">
                Start
              </TableHead>
              <TableHead className="text-xs uppercase tracking-wider">
                End
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider">
                Paid
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((subscription, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {subscription.schoolName}
                </TableCell>
                <TableCell>{subscription.planName}</TableCell>
                <TableCell>{formatDate(subscription.startDate)}</TableCell>
                <TableCell>{formatDate(subscription.endDate)}</TableCell>
                <TableCell className="text-right">
                  ${subscription.paidAmount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
