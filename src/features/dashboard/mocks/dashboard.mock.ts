import type { DashboardAnalytics } from "../types/dashboard.types";

export const MOCK_DASHBOARD_ANALYTICS: DashboardAnalytics = {
  summary: [
    { id: "schools", label: "Total Schools", value: 12 },
    { id: "subscription-plans", label: "Subscription Plans", value: 3 },
    { id: "active-subscriptions", label: "Active Subscriptions", value: 9 },
    { id: "revenue", label: "Total Revenue", value: 254000 },
  ],
  plans: [
    {
      subscriptionId: "plan-basic",
      name: "Basic",
      price: 1000,
      tenantCount: 5,
      activeCount: 3,
      totalRevenue: 40000,
    },
    {
      subscriptionId: "plan-premium",
      name: "Premium",
      price: 2500,
      tenantCount: 5,
      activeCount: 4,
      totalRevenue: 140000,
    },
    {
      subscriptionId: "plan-enterprise",
      name: "Enterprise",
      price: 5000,
      tenantCount: 2,
      activeCount: 2,
      totalRevenue: 74000,
    },
  ],
  recentSubscriptions: [
    {
      schoolName: "College School",
      planName: "Premium",
      startDate: "2026-07-01T00:00:00.000Z",
      endDate: "2027-07-01T00:00:00.000Z",
      paidAmount: 30000,
    },
    {
      schoolName: "Bole Academy",
      planName: "Basic",
      startDate: "2026-06-15T00:00:00.000Z",
      endDate: "2027-06-15T00:00:00.000Z",
      paidAmount: 12000,
    },
    {
      schoolName: "Awra Godana School",
      planName: "Enterprise",
      startDate: "2026-05-20T00:00:00.000Z",
      endDate: "2027-05-20T00:00:00.000Z",
      paidAmount: 60000,
    },
  ],
  charts: [
    {
      type: "pie",
      title: "Students by Sex",
      data: [
        { name: "Male", value: 312 },
        { name: "Female", value: 288 },
      ],
    },
    {
      type: "bar",
      title: "Revenue by Plan",
      data: [
        { name: "Basic", value: 40000 },
        { name: "Premium", value: 140000 },
        { name: "Enterprise", value: 74000 },
      ],
    },
    {
      type: "line",
      title: "Admissions per Month",
      data: [
        { name: "2026-01", value: 24 },
        { name: "2026-02", value: 31 },
        { name: "2026-03", value: 28 },
        { name: "2026-04", value: 42 },
        { name: "2026-05", value: 37 },
        { name: "2026-06", value: 51 },
      ],
    },
  ],
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMockDashboardAnalytics(): Promise<DashboardAnalytics> {
  await delay(600);
  return MOCK_DASHBOARD_ANALYTICS;
}
