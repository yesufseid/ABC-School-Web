import { useFetchQuery } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { DashboardStats } from "../types/dashboard.types";

export function useDashboardStats() {
  return useFetchQuery<DashboardStats>(
    API.ANALYTICS_DASHBOARD,
    ["dashboard", "stats"],
  );
}
