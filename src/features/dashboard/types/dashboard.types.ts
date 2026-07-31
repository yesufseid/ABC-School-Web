export type SummaryStat = {
  id: string;
  label: string;
  value: number;
  growthPercent?: number;
  growthLabel?: string;
};

export type SubscriptionPlanStat = {
  subscriptionId: string;
  name: string;
  price: number;
  tenantCount: number;
  activeCount: number;
  totalRevenue: number;
};

export type RecentSubscription = {
  schoolName: string;
  planName: string;
  startDate: string;
  endDate: string;
  paidAmount: number;
};

export type DashboardAnalytics = {
  totalSchools: number;
  totalSubscriptionPlans: number;
  totalActiveSubscriptions: number;
  totalRevenue: number;
  subscriptionsByPlan: SubscriptionPlanStat[];
  recentSubscriptions: RecentSubscription[];
};
