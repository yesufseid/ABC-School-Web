import { LoaderCircleIcon } from "lucide-react";
import { useDashboardStats } from "../api/dashboard.api";
import { StatsCards } from "../components/stats-card.component";
import { SubscriptionsByPlanChart } from "../components/subscriptions-by-plan-chart.component";
import { RevenueChart } from "../components/revenue-chart.component";
import { RecentSubscriptionsTable } from "../components/recent-subscriptions-table.component";

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-destructive">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your schools and subscriptions.
        </p>
      </div>

      <StatsCards
        totalSchools={stats.totalSchools}
        totalSubscriptionPlans={stats.totalSubscriptionPlans}
        totalActiveSubscriptions={stats.totalActiveSubscriptions}
        totalRevenue={stats.totalRevenue}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SubscriptionsByPlanChart data={stats.subscriptionsByPlan} />
        <RevenueChart data={stats.subscriptionsByPlan} />
      </div>

      <RecentSubscriptionsTable data={stats.recentSubscriptions} />
    </div>
  );
}
