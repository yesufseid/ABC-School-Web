export type SubscriptionPlanStat = {
  subscriptionId: string;
  name: string;
  price: number;
  tenantCount: number;
  activeCount: number;
  totalRevenue: number;
};

export type DashboardStats = {
  data: {
    totalSchools: number;
    totalSubscriptionPlans: number;
    totalActiveSubscriptions: number;
    totalRevenue: number;
    subscriptionsByPlan: SubscriptionPlanStat[];
    recentSubscriptions: Array<{
      schoolName: string;
      planName: string;
      startDate: string;
      endDate: string;
      paidAmount: number;
    }>;
  };
};
