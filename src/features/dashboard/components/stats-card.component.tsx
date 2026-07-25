import {
  SchoolIcon,
  CreditCardIcon,
  DollarSignIcon,
  ActivityIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
};

function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground/50">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

type StatsCardsProps = {
  totalSchools: number;
  totalSubscriptionPlans: number;
  totalActiveSubscriptions: number;
  totalRevenue: number;
};

export function StatsCards({
  totalSchools,
  totalSubscriptionPlans,
  totalActiveSubscriptions,
  totalRevenue,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Schools"
        value={totalSchools}
        description="Registered schools"
        icon={<SchoolIcon className="size-4" />}
      />
      <StatCard
        title="Subscription Plans"
        value={totalSubscriptionPlans}
        description="Available plans"
        icon={<CreditCardIcon className="size-4" />}
      />
      <StatCard
        title="Active Subscriptions"
        value={totalActiveSubscriptions}
        description="Currently active"
        icon={<ActivityIcon className="size-4" />}
      />
      <StatCard
        title="Total Revenue"
        value={`$${totalRevenue.toLocaleString()}`}
        description="All-time revenue"
        icon={<DollarSignIcon className="size-4" />}
      />
    </div>
  );
}
