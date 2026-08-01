import { LoaderCircleIcon } from "lucide-react";
import { useAppSelector } from "@/lib/store";
import { useDashboardAnalytics } from "../api/dashboard.api";
import { SummaryStatsRow } from "../components/summary-stats-row.component";
import { SubscriptionPlansCard } from "../components/subscription-plans-card.component";
import { RecentSubscriptionsCard } from "../components/recent-subscriptions-card.component";
import { ListCard } from "../components/list-card.component";
import { DashboardWelcome } from "../components/dashboard-welcome.component";
import { DashboardCharts } from "../components/dashboard-charts.component";

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data, isLoading, isError } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-destructive">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  const { summary, plans, recentSubscriptions, list } = data.data;

  return (
    <div className="space-y-6">
      {user && <DashboardWelcome userName={user.name} />}

      {summary.length > 0 && <SummaryStatsRow stats={summary} />}

      {data.data.charts && data.data.charts.length > 0 && (
        <DashboardCharts data={data.data.charts} />
      )}

      {plans && plans.length > 0 && (
        <SubscriptionPlansCard data={plans} />
      )}

      {recentSubscriptions && recentSubscriptions.length > 0 && (
        <RecentSubscriptionsCard data={recentSubscriptions} />
      )}

      {list && list.rows.length > 0 && <ListCard data={list} />}
    </div>
  );
}
