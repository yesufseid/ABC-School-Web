export type SummaryStat = {
  id: string;
  label: string;
  value: number;
  growthPercent: number;
  growthLabel: string;
};

export type BranchDistributionItem = {
  branch: string;
  total: number;
  percentage: number;
  color: string;
};

export type DemographicSlice = {
  label: string;
  value: number;
  color: string;
};

export type DashboardAnalytics = {
  summaryStats: SummaryStat[];
  branchDistribution: BranchDistributionItem[];
  languageDistribution: DemographicSlice[];
  sexDistribution: DemographicSlice[];
};

export type BranchDistributionFilter = "Students" | "Teachers" | "Parents";
