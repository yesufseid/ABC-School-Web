import { useFetchQuery } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { DashboardAnalytics } from "../types/dashboard.types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  analytics: () => [...dashboardKeys.all, "analytics"] as const,
};

export function useDashboardAnalytics(options?: { enabled?: boolean }) {
  return useFetchQuery<{ data: DashboardAnalytics }>(
    API.ANALYTICS_DASHBOARD,
    dashboardKeys.analytics(),
    undefined,
    { enabled: options?.enabled ?? true },
  );
}
