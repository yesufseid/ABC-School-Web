import type { UserRole } from "@/features/auth/types/user.types";

export type DashboardWidgetId =
  | "welcome"
  | "summary-stats"
  | "subscription-plans"
  | "recent-subscriptions";

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
    roles: ["Admin"],
  },
  {
    id: "subscription-plans",
    roles: ["Admin"],
  },
  {
    id: "recent-subscriptions",
    roles: ["Admin"],
  },
];
