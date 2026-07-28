export const API = {
  AUTH_LOGIN: "/auth/login",
  TENANTS: "/tenant",
  TENANT_SUBSCRIBE: "/tenant/subscribe",
  TENANT_BRANCHES: (tenantId: string) => `/tenant/${tenantId}/branches`,
  SUBSCRIPTIONS: "/subscription",
  ANALYTICS_DASHBOARD: "/analytics/dashboard",
} as const;
