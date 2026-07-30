import { LoaderCircleIcon } from "lucide-react";
import { useAppSelector } from "@/lib/store";
import { filterByRole } from "@/utils/rbac.helpers";
import { useDashboardAnalytics } from "../api/dashboard.api";
import { DASHBOARD_WIDGETS } from "../config/dashboard-widgets.config";
import { SummaryStatsRow } from "../components/summary-stats-row.component";
import { BranchDistributionChart } from "../components/branch-distribution-chart.component";
import { DemographicsDistributionChart } from "../components/demographics-distribution-chart.component";
import { DashboardWelcome } from "../components/dashboard-welcome.component";

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
  const showCharts = visibleWidgets.some(
    (w) => w.id === "branch-distribution" || w.id === "demographics",
  );

  return (
    <div className="space-y-6">
      {visibleWidgets.some((w) => w.id === "welcome") && user && (
        <DashboardWelcome userName={user.name} />
      )}

      {showSummaryStats && data && (
        <SummaryStatsRow stats={data.summaryStats} userRole={user?.type} />
      )}

      {showCharts && data && (
        <div className="grid gap-6 xl:grid-cols-2">
          {visibleWidgets.some((w) => w.id === "branch-distribution") && (
            <BranchDistributionChart data={data.branchDistribution} />
          )}
          {visibleWidgets.some((w) => w.id === "demographics") && (
            <DemographicsDistributionChart
              languageData={data.languageDistribution}
              sexData={data.sexDistribution}
            />
          )}
        </div>
      )}
    </div>
  );
}
