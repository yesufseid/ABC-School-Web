import { LoaderCircleIcon } from "lucide-react";
import { useAppSelector } from "@/lib/store";
import { filterByRole } from "@/utils/rbac.helpers";
import { useDashboardAnalytics } from "../api/dashboard.api";
import { DASHBOARD_WIDGETS } from "../config/dashboard-widgets.config";
import { SummaryStatsRow } from "../components/summary-stats-row.component";
import { SubscriptionPlansCard } from "../components/subscription-plans-card.component";
import { RecentSubscriptionsCard } from "../components/recent-subscriptions-card.component";
import { DashboardWelcome } from "../components/dashboard-welcome.component";
import type { SummaryStat } from "../types/dashboard.types";

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const visibleWidgets = filterByRole(DASHBOARD_WIDGETS, user?.type);
  const needsAnalytics = visibleWidgets.some((widget) => widget.id !== "welcome");
  const { data, isLoading, isError } = useDashboardAnalytics({
    enabled: needsAnalytics,
  });

  if (needsAnalytics && isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (needsAnalytics && (isError || !data)) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-destructive">
          Failed to load dashboard data.
        </p>
      </div>
    );
  }

  const showSummaryStats = visibleWidgets.some((w) => w.id === "summary-stats");
  const showPlans = visibleWidgets.some((w) => w.id === "subscription-plans");
  const showRecent = visibleWidgets.some((w) => w.id === "recent-subscriptions");

  const summaryStats: SummaryStat[] = data
    ? [
        {
          id: "schools",
          label: "Total Schools",
          value: data.data.totalSchools,
        },
        {
          id: "subscription-plans",
          label: "Subscription Plans",
          value: data.data.totalSubscriptionPlans,
        },
        {
          id: "active-subscriptions",
          label: "Active Subscriptions",
          value: data.data.totalActiveSubscriptions,
        },
        {
          id: "revenue",
          label: "Total Revenue",
          value: data.data.totalRevenue,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {visibleWidgets.some((w) => w.id === "welcome") && user && (
        <DashboardWelcome userName={user.name} />
      )}

      {showSummaryStats && data && (
        <SummaryStatsRow stats={summaryStats} userRole={user?.type} />
      )}

      {showPlans && data && (
        <SubscriptionPlansCard data={data.data.subscriptionsByPlan} />
      )}

      {showRecent && data && (
        <RecentSubscriptionsCard data={data.data.recentSubscriptions} />
      )}
    </div>
  );
}
