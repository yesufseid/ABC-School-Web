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

export type ListColumn = {
  key: string;
  label: string;
};

export type ListWidget = {
  title: string;
  columns: ListColumn[];
  rows: Record<string, string | number>[];
};

export type DashboardAnalytics = {
  summary: SummaryStat[];
  plans?: SubscriptionPlanStat[];
  recentSubscriptions?: RecentSubscription[];
  list?: ListWidget;
};
