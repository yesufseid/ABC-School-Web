import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { format, parseISO } from "date-fns";
import { ArrowLeftIcon, LoaderCircleIcon, PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailItem } from "@/components/custom/detail-item";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import {
  useFetchPrincipal,
  useUpdatePrincipal,
  useDeletePrincipal,
} from "../api/principals.api";
import { PrincipalForm } from "../forms/principal.form";
import type { PrincipalFormValues } from "../schemas/principal.schema";

function formatDate(value?: string) {
  return value ? format(parseISO(value), "MMM d, yyyy") : "-";
}

export function PrincipalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenantId } = useAuthContext();

  const { data, isLoading, isError } = useFetchPrincipal(id ?? "");
  const { data: branchesData } = useFetchBranches(tenantId ?? "");

  const branches = branchesData?.data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const updatePrincipal = useUpdatePrincipal(id ?? "");
  const deletePrincipal = useDeletePrincipal();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/principals")}>
          <ArrowLeftIcon />
          Back to Principals
        </Button>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load principal details.
          </p>
        </div>
      </div>
    );
  }

  const principal = data.data;
  const principalName = `${principal.firstName} ${principal.middleName ? `${principal.middleName} ` : ""}${principal.lastName}`;
  const branch = branches.find((b) => b.id === principal.branchId);

  const handleFormSubmit = (values: PrincipalFormValues) => {
    updatePrincipal.mutate(values, {
      onSuccess: () => {
        setFormOpen(false);
      },
    });
  };

  const handleDeleteConfirm = () => {
    deletePrincipal.mutate(principal.id, {
      onSuccess: () => {
        navigate("/principals");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/principals")}>
          <ArrowLeftIcon />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {principalName}
            </h1>
            <Badge variant={principal.isVicePrincipal ? "secondary" : "default"}>
              {principal.isVicePrincipal ? "Vice Principal" : "Principal"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {branch?.name ?? principal.branchId} · {principal.phone}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setFormOpen(true)}>
            <PencilIcon />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label="Full Name" value={principalName} />
            <DetailItem label="Role" value={principal.isVicePrincipal ? "Vice Principal" : "Principal"} />
            <DetailItem label="Sex" value={principal.sex} />
            <DetailItem label="Phone" value={principal.phone} />
            <DetailItem label="Email" value={principal.email ?? "-"} />
            <DetailItem label="Address" value={principal.address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label="Branch" value={branch?.name ?? principal.branchId} />
            <DetailItem
              label="Starting Date"
              value={formatDate(principal.startingDate)}
            />
          </CardContent>
        </Card>
      </div>

      <PrincipalForm
        open={formOpen}
        onOpenChange={setFormOpen}
        principalId={principal.id}
        onSubmit={handleFormSubmit}
        isPending={updatePrincipal.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Principal"
        description={`Are you sure you want to delete "${principalName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deletePrincipal.isPending}
      />
    </div>
  );
}
