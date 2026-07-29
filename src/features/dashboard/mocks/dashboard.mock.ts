import type { DashboardAnalytics } from "../types/dashboard.types";

export const MOCK_DASHBOARD_ANALYTICS: DashboardAnalytics = {
  summaryStats: [
    {
      id: "students",
      label: "Total Students",
      value: 1981,
      growthPercent: 18.2,
      growthLabel: "than last academic year",
    },
    {
      id: "parents",
      label: "Total Parents",
      value: 1981,
      growthPercent: 18.2,
      growthLabel: "than last academic year",
    },
    {
      id: "teachers",
      label: "Total Teachers",
      value: 52,
      growthPercent: 18.2,
      growthLabel: "than last academic year",
    },
    {
      id: "branches",
      label: "Total Branches",
      value: 4,
      growthPercent: 18.2,
      growthLabel: "than last academic year",
    },
  ],
  branchDistribution: [
    {
      branch: "College",
      total: 952,
      percentage: 48.06,
      color: "#22c55e",
    },
    {
      branch: "Bole",
      total: 467,
      percentage: 23.57,
      color: "#eab308",
    },
    {
      branch: "Awra Godana",
      total: 337,
      percentage: 17.01,
      color: "#a855f7",
    },
    {
      branch: "Meto",
      total: 225,
      percentage: 11.36,
      color: "#ef4444",
    },
  ],
  languageDistribution: [
    { label: "Amharic", value: 62, color: "#22d3ee" },
    { label: "Oromo", value: 23, color: "#34d399" },
    { label: "English", value: 15, color: "#818cf8" },
  ],
  sexDistribution: [
    { label: "Male", value: 54, color: "#22c55e" },
    { label: "Female", value: 46, color: "#06b6d4" },
  ],
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchMockDashboardAnalytics(): Promise<DashboardAnalytics> {
  await delay(600);
  return MOCK_DASHBOARD_ANALYTICS;
}
