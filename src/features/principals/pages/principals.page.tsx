import { useState } from "react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/custom/page-header";
import { ContextSelector } from "@/components/custom/context-selector";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import {
  useFetchPrincipals,
  useCreatePrincipal,
  useUpdatePrincipal,
  useDeletePrincipal,
} from "../api/principals.api";
import { PrincipalsTable } from "../components/principals-table.component";
import { PrincipalForm } from "../forms/principal.form";
import type { Principal } from "../types/principal.types";
import type { PrincipalFormValues } from "../schemas/principal.schema";

export function PrincipalsPage() {
  const { tenantId } = useAuthContext();

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const { data: principalsData, isLoading, refetch } = useFetchPrincipals();
  const principals = principalsData?.data ?? [];

  const createPrincipal = useCreatePrincipal();
  const deletePrincipal = useDeletePrincipal();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPrincipalId, setEditingPrincipalId] = useState<string | null>(
    null,
  );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingPrincipal, setDeletingPrincipal] =
    useState<Principal | null>(null);

  const updatePrincipal = useUpdatePrincipal(editingPrincipalId ?? "");

  const branchMap = new Map(branches.map((branch) => [branch.id, branch.name]));
  const branchLabel = (branchId: string) =>
    branchMap.get(branchId) ?? branchId;

  const handleCreate = () => {
    setEditingPrincipalId(null);
    setFormOpen(true);
  };

  const handleEdit = (principal: Principal) => {
    setEditingPrincipalId(principal.id);
    setFormOpen(true);
  };

  const handleDelete = (principal: Principal) => {
    setDeletingPrincipal(principal);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (values: PrincipalFormValues) => {
    if (editingPrincipalId) {
      updatePrincipal.mutate(values, {
        onSuccess: () => {
          setFormOpen(false);
          setEditingPrincipalId(null);
        },
      });
    } else {
      createPrincipal.mutate(values, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingPrincipal) {
      deletePrincipal.mutate(deletingPrincipal.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeletingPrincipal(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Principals" description="Manage principals and vice principals">
        <ContextSelector
          branches={branches.map((b) => ({ id: b.id, name: b.name }))}
          showTerm={false}
        />
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCwIcon />
          Refresh
        </Button>
        <Button onClick={handleCreate}>
          <PlusIcon />
          Add Principal
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Loading principals...</p>
        </div>
      ) : (
        <PrincipalsTable
          principals={principals}
          branchLabel={branchLabel}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PrincipalForm
        open={formOpen}
        onOpenChange={setFormOpen}
        principalId={editingPrincipalId}
        onSubmit={handleFormSubmit}
        isPending={createPrincipal.isPending || updatePrincipal.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Principal"
        description={`Are you sure you want to delete "${deletingPrincipal?.firstName} ${deletingPrincipal?.lastName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deletePrincipal.isPending}
      />
    </div>
  );
}
