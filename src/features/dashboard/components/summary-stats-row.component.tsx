import {
  Building2Icon,
  LayersIcon,
  BadgeCheckIcon,
  BanknoteIcon,
  GraduationCapIcon,
  UsersIcon,
  BriefcaseIcon,
  HeartIcon,
  LayoutGridIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  TrendingUpIcon,
  ClockIcon,
  BookOpenIcon,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SummaryStat } from "../types/dashboard.types";

const STAT_ICONS: Record<string, LucideIcon> = {
  schools: Building2Icon,
  "subscription-plans": LayersIcon,
  "active-subscriptions": BadgeCheckIcon,
  revenue: BanknoteIcon,
  students: GraduationCapIcon,
  teachers: UsersIcon,
  staff: BriefcaseIcon,
  parents: HeartIcon,
  branches: Building2Icon,
  sections: LayoutGridIcon,
  events: CalendarDaysIcon,
  enrolled: UserPlusIcon,
  "new-this-year": UserPlusIcon,
  "present-today": BadgeCheckIcon,
  "attendance-rate": TrendingUpIcon,
  departments: BriefcaseIcon,
  withdrawals: UserPlusIcon,
  "my-sections": LayoutGridIcon,
  "my-students": GraduationCapIcon,
  "my-subjects": BookOpenIcon,
  "periods-per-week": ClockIcon,
  "branch-staff": BriefcaseIcon,
  "my-attendance": TrendingUpIcon,
  children: HeartIcon,
  "avg-attendance": TrendingUpIcon,
  "avg-grade": BookOpenIcon,
  attendance: TrendingUpIcon,
  "avg-score": BookOpenIcon,
  classes: LayoutGridIcon,
};

const STAT_ACCENT: Record<string, string> = {
  schools: "bg-violet-500/15 text-violet-400",
  "subscription-plans": "bg-cyan-500/15 text-cyan-400",
  "active-subscriptions": "bg-emerald-500/15 text-emerald-400",
  revenue: "bg-amber-500/15 text-amber-400",
  students: "bg-violet-500/15 text-violet-400",
  teachers: "bg-cyan-500/15 text-cyan-400",
  staff: "bg-sky-500/15 text-sky-400",
  parents: "bg-rose-500/15 text-rose-400",
  branches: "bg-indigo-500/15 text-indigo-400",
  sections: "bg-teal-500/15 text-teal-400",
  events: "bg-orange-500/15 text-orange-400",
  enrolled: "bg-emerald-500/15 text-emerald-400",
  "new-this-year": "bg-lime-500/15 text-lime-400",
  "present-today": "bg-green-500/15 text-green-400",
  "attendance-rate": "bg-fuchsia-500/15 text-fuchsia-400",
  departments: "bg-blue-500/15 text-blue-400",
  withdrawals: "bg-red-500/15 text-red-400",
  "my-sections": "bg-teal-500/15 text-teal-400",
  "my-students": "bg-violet-500/15 text-violet-400",
  "my-subjects": "bg-amber-500/15 text-amber-400",
  "periods-per-week": "bg-cyan-500/15 text-cyan-400",
  "branch-staff": "bg-sky-500/15 text-sky-400",
  "my-attendance": "bg-fuchsia-500/15 text-fuchsia-400",
  children: "bg-rose-500/15 text-rose-400",
  "avg-attendance": "bg-fuchsia-500/15 text-fuchsia-400",
  "avg-grade": "bg-amber-500/15 text-amber-400",
  attendance: "bg-fuchsia-500/15 text-fuchsia-400",
  "avg-score": "bg-amber-500/15 text-amber-400",
  classes: "bg-teal-500/15 text-teal-400",
};

type SummaryStatCardProps = {
  stat: SummaryStat;
};

function SummaryStatCard({ stat }: SummaryStatCardProps) {
  const Icon = STAT_ICONS[stat.id] ?? Building2Icon;
  const accent =
    STAT_ACCENT[stat.id] ?? "bg-primary/15 text-primary";

  return (
    <Card className="border-border/40 bg-card/80">
      <CardContent className="flex items-start justify-between pt-5">
        <div className="space-y-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              accent,
            )}
          >
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">{stat.value.toLocaleString()}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
          {stat.growthPercent != null && (
            <p className="text-xs text-emerald-400">
              +{stat.growthPercent}% {stat.growthLabel}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type SummaryStatsRowProps = {
  stats: SummaryStat[];
};

export function SummaryStatsRow({ stats }: SummaryStatsRowProps) {
  const visibleStats = (stats ?? []).filter((stat) => stat.value != null);

  if (visibleStats.length === 0) return null;

  return (
    <div
      className={cn(
        "grid gap-4",
        visibleStats.length === 1
          ? "sm:grid-cols-1 lg:max-w-sm"
          : "sm:grid-cols-2 xl:grid-cols-4",
      )}
    >
      {visibleStats.map((stat) => (
        <SummaryStatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
