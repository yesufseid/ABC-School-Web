import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubscriptionPlanStat } from "../types/dashboard.types";

type SubscriptionPlansCardProps = {
  data: SubscriptionPlanStat[];
};

export function SubscriptionPlansCard({ data }: SubscriptionPlansCardProps) {
  return (
    <Card className="border-border/40 bg-card/80">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Subscription Plans
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs uppercase tracking-wider">
                Plan
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider">
                Price
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider">
                Schools
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider">
                Active
              </TableHead>
              <TableHead className="text-right text-xs uppercase tracking-wider">
                Revenue
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((plan) => (
              <TableRow key={plan.subscriptionId}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell className="text-right">
                  ${plan.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {plan.tenantCount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {plan.activeCount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  ${plan.totalRevenue.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
