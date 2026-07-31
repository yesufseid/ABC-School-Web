import {
  Building2Icon,
  LayersIcon,
  BadgeCheckIcon,
  BanknoteIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SummaryStat } from "../types/dashboard.types";
import type { UserRole } from "@/features/auth/types/user.types";

const STAT_ICONS = {
  schools: Building2Icon,
  "subscription-plans": LayersIcon,
  "active-subscriptions": BadgeCheckIcon,
  revenue: BanknoteIcon,
} as const;

const STAT_ACCENT = {
  schools: "bg-violet-500/15 text-violet-400",
  "subscription-plans": "bg-cyan-500/15 text-cyan-400",
  "active-subscriptions": "bg-emerald-500/15 text-emerald-400",
  revenue: "bg-amber-500/15 text-amber-400",
} as const;

const STAT_ROLES: Record<string, readonly UserRole[]> = {
  schools: ["Admin"],
  "subscription-plans": ["Admin"],
  "active-subscriptions": ["Admin"],
  revenue: ["Admin"],
};

type SummaryStatCardProps = {
  stat: SummaryStat;
};

function SummaryStatCard({ stat }: SummaryStatCardProps) {
  const Icon = STAT_ICONS[stat.id as keyof typeof STAT_ICONS] ?? Building2Icon;
  const accent =
    STAT_ACCENT[stat.id as keyof typeof STAT_ACCENT] ??
    "bg-primary/15 text-primary";

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
  userRole: UserRole | undefined;
};

export function SummaryStatsRow({ stats, userRole }: SummaryStatsRowProps) {
  const visibleStats = (stats ?? []).filter((stat) => {
    const roles = STAT_ROLES[stat.id];
    if (!roles || !userRole) return false;
    return roles.includes(userRole);
  });

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

export { STAT_ROLES };
