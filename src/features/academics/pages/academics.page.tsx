import { useState } from "react";
import { ClipboardListIcon, LibraryIcon, ShieldCheckIcon, Settings2Icon } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { ContextSelector } from "@/components/custom/context-selector";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { GradebookComponent } from "../components/gradebook.component";
import { RostersComponent } from "../components/rosters.component";
import { CorrectionsComponent } from "../components/corrections.component";
import { ConfigComponent } from "../components/config.component";

type AcademicsTab = "gradebook" | "rosters" | "corrections" | "config";

const TABS: { id: AcademicsTab; label: string; icon: typeof LibraryIcon }[] = [
  { id: "gradebook", label: "Gradebook", icon: ClipboardListIcon },
  { id: "rosters", label: "Rosters", icon: LibraryIcon },
  { id: "corrections", label: "Corrections", icon: ShieldCheckIcon },
  { id: "config", label: "Settings", icon: Settings2Icon },
];

export function AcademicsPage() {
  const { tenantId, role } = useAuthContext();
  const isAdminOrOwner = role === "Admin" || role === "Owner";

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const [tab, setTab] = useState<AcademicsTab>("gradebook");

  return (
    <div className="space-y-6">
      <PageHeader title="Academics" description="Gradebook, rosters, and results">
        <ContextSelector
          branches={
            isAdminOrOwner
              ? branches.map((b) => ({ id: b.id, name: b.name }))
              : undefined
          }
        />
      </PageHeader>

      <div className="flex w-fit items-center gap-1 rounded-2xl border border-border/50 bg-card/50 p-1">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "gradebook" && <GradebookComponent />}
      {tab === "rosters" && <RostersComponent />}
      {tab === "corrections" && <CorrectionsComponent />}
      {tab === "config" && <ConfigComponent />}
    </div>
  );
}
