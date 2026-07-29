import { useQuery } from "@tanstack/react-query";
import { fetchMockDashboardAnalytics } from "../mocks/dashboard.mock";
import type { DashboardAnalytics } from "../types/dashboard.types";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  analytics: () => [...dashboardKeys.all, "analytics"] as const,
};

export function useDashboardAnalytics(options?: { enabled?: boolean }) {
  return useQuery<DashboardAnalytics>({
    queryKey: dashboardKeys.analytics(),
    queryFn: fetchMockDashboardAnalytics,
    enabled: options?.enabled ?? true,
  });
}
