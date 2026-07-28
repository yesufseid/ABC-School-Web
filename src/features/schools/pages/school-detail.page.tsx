import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { format, parseISO } from "date-fns";
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LoaderCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomTable } from "@/components/custom/custom-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useFetchSchoolDetail,
  useFetchBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
} from "../api/schools.api";
import { BranchForm } from "../forms/branch.form";
import { ConfirmDialog } from "../components/confirm-dialog.component";
import type { Branch } from "../types/school.types";
import type { BranchFormValues } from "../schemas/school.schema";

export function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useFetchSchoolDetail(id ?? "");
  const { data: branchesData, isLoading: branchesLoading } = useFetchBranches(
    id ?? "",
  );

  const [branchFormOpen, setBranchFormOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [deleteBranchConfirmOpen, setDeleteBranchConfirmOpen] = useState(false);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(
    new Set(),
  );

  const createBranch = useCreateBranch(id ?? "");
  const updateBranch = useUpdateBranch(id ?? "", editingBranchId ?? "");
  const deleteBranch = useDeleteBranch(id ?? "");

  const branches = branchesData?.data ?? [];

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
        <Button variant="ghost" onClick={() => navigate("/schools")}>
          <ArrowLeftIcon />
          Back to Schools
        </Button>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load school details.
          </p>
        </div>
      </div>
    );
  }

  const school = data.data;
  const isSubActive = (endDate: string) => new Date(endDate) > new Date();

  const handleBranchFormSubmit = (
    values: Omit<BranchFormValues, "details"> & {
      details: Record<string, string | number | boolean>;
    },
  ) => {
    if (editingBranchId) {
      updateBranch.mutate(values, {
        onSuccess: () => {
          setBranchFormOpen(false);
          setEditingBranchId(null);
        },
      });
    } else {
      createBranch.mutate(values, {
        onSuccess: () => {
          setBranchFormOpen(false);
        },
      });
    }
  };

  const handleEditBranch = (branch: Branch) => {
    setEditingBranchId(branch.id);
    setBranchFormOpen(true);
  };

  const handleDeleteBranch = (branch: Branch) => {
    setDeletingBranch(branch);
    setDeleteBranchConfirmOpen(true);
  };

  const handleDeleteBranchConfirm = () => {
    if (deletingBranch) {
      deleteBranch.mutate(deletingBranch.id, {
        onSuccess: () => {
          setDeleteBranchConfirmOpen(false);
          setDeletingBranch(null);
        },
      });
    }
  };

  const handleAddBranch = () => {
    setEditingBranchId(null);
    setBranchFormOpen(true);
  };

  const toggleBranch = (branchId: string) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(branchId)) {
        next.delete(branchId);
      } else {
        next.add(branchId);
      }
      return next;
    });
  };

  const memberColumns = [
    {
      title: "Name",
      key: "name",
      className: "font-medium",
    },
    {
      title: "Phone",
      key: "phoneNumber",
      className: "text-muted-foreground",
    },
    {
      title: "Role",
      key: "type",
      component: (value: unknown) => (
        <Badge variant="outline">{String(value)}</Badge>
      ),
    },
  ];

  const subscriptionColumns = [
    {
      title: "Plan",
      key: "subscription",
      component: (value: unknown) => {
        const sub = value as { name: string };
        return <span className="font-medium">{sub.name}</span>;
      },
    },
    {
      title: "Duration",
      key: "subscription",
      component: (value: unknown) => {
        const sub = value as { months: number };
        return (
          <span>
            {sub.months} {sub.months === 1 ? "month" : "months"}
          </span>
        );
      },
    },
    {
      title: "Price",
      key: "subscription",
      component: (value: unknown) => {
        const sub = value as { price: number };
        return <span>{sub.price.toLocaleString()}</span>;
      },
    },
    {
      title: "Paid",
      key: "paidAmount",
      component: (value: unknown) => (
        <span>{(value as number).toLocaleString()}</span>
      ),
    },
    {
      title: "Start",
      key: "startDate",
      component: (value: unknown) => (
        <span>{format(parseISO(value as string), "MMM d, yyyy")}</span>
      ),
    },
    {
      title: "End",
      key: "endDate",
      component: (value: unknown) => (
        <span>{format(parseISO(value as string), "MMM d, yyyy")}</span>
      ),
    },
    {
      title: "Status",
      key: "endDate",
      component: (value: unknown) =>
        isSubActive(value as string) ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="secondary">Expired</Badge>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/schools")}>
          <ArrowLeftIcon />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {school.name}
          </h1>
          <p className="text-sm text-muted-foreground">{school.description}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{school.owner.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{school.owner.phoneNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm font-medium">
                {format(parseISO(school.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Details</CardTitle>
          </CardHeader>
          <CardContent>
            {school.details && Object.keys(school.details).length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(school.details).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-xs text-muted-foreground">{key}</p>
                    <p className="text-sm font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No additional details.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Branches ({branches.length})
          </CardTitle>
          <Button size="sm" onClick={handleAddBranch}>
            <PlusIcon />
            Add Branch
          </Button>
        </CardHeader>
        <CardContent>
          {branchesLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : branches.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No branches. Add one to get started.
            </p>
          ) : (
            <div className="divide-y divide-border rounded-md border">
              {branches.map((branch) => {
                const isExpanded = expandedBranches.has(branch.id);
                const detailEntries = Object.entries(branch.details ?? {});

                return (
                  <div key={branch.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/50"
                      onClick={() => toggleBranch(branch.id)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {branch.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {branch.branchCode}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {branch.branchPrefix}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(branch.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-xl hover:bg-muted hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="sr-only">Actions</span>
                            <span className="size-4 rounded-full bg-muted-foreground/50" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditBranch(branch)}
                            >
                              <PencilIcon />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteBranch(branch)}
                            >
                              <TrashIcon />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {isExpanded ? (
                          <ChevronUpIcon className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronDownIcon className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-border/50 bg-muted/30 px-4 py-3 space-y-3">
                        {branch.description && (
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Description
                            </p>
                            <p className="text-sm">{branch.description}</p>
                          </div>
                        )}

                        {detailEntries.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Details
                            </p>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {detailEntries.map(([key, value]) => (
                                <div key={key}>
                                  <p className="text-xs text-muted-foreground">
                                    {key}
                                  </p>
                                  <p className="text-sm font-medium">
                                    {String(value)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {!branch.description && detailEntries.length === 0 && (
                          <p className="text-xs text-muted-foreground">
                            No additional information.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Members ({school.members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={school.members}
            columns={memberColumns}
            emptyMessage="No members."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Subscriptions ({school.tenantSubscriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomTable
            data={school.tenantSubscriptions}
            columns={subscriptionColumns}
            emptyMessage="No subscriptions."
          />
        </CardContent>
      </Card>

      <BranchForm
        open={branchFormOpen}
        onOpenChange={setBranchFormOpen}
        tenantId={id ?? ""}
        branchId={editingBranchId}
        onSubmit={handleBranchFormSubmit}
        isPending={createBranch.isPending || updateBranch.isPending}
      />

      <ConfirmDialog
        open={deleteBranchConfirmOpen}
        onOpenChange={setDeleteBranchConfirmOpen}
        title="Delete Branch"
        description={`Are you sure you want to delete "${deletingBranch?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteBranchConfirm}
        isPending={deleteBranch.isPending}
      />
    </div>
  );
}
