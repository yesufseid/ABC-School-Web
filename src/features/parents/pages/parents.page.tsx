import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/custom/page-header";
import { useFetchParents } from "../api/parents.api";
import { ParentsTable } from "../components/parents-table.component";

export function ParentsPage() {
  const { data, isLoading, refetch } = useFetchParents();
  const parents = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parents"
        description="View all parents and their children"
      >
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCwIcon />
          Refresh
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Loading parents...</p>
        </div>
      ) : (
        <ParentsTable parents={parents} />
      )}
    </div>
  );
}
