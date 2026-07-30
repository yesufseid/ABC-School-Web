import type { UserRole } from "@/features/auth/types/user.types";

export type DashboardWidgetId =
  | "welcome"
  | "summary-stats"
  | "branch-distribution"
  | "demographics";

export type DashboardWidgetConfig = {
  id: DashboardWidgetId;
  roles: readonly UserRole[];
};

export const DASHBOARD_WIDGETS: DashboardWidgetConfig[] = [
  {
    id: "welcome",
    roles: ["Student"],
  },
  {
    id: "summary-stats",
    roles: ["Admin", "Owner", "Principal", "Teacher"],
  },
  {
    id: "branch-distribution",
    roles: ["Admin", "Owner", "Principal"],
  },
  {
    id: "demographics",
    roles: ["Admin", "Owner", "Principal"],
  },
];
