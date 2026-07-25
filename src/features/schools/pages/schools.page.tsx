import { useState } from "react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useFetchSchools,
  useCreateSchool,
  useUpdateSchool,
  useDeleteSchool,
  useSubscribeSchool,
} from "../api/schools.api";
import { SchoolsTable } from "../components/schools-table.component";
import { SchoolForm } from "../forms/school.form";
import { SubscribeSchool } from "../components/subscribe-school.component";
import { ConfirmDialog } from "../components/confirm-dialog.component";
import type { School } from "../types/school.types";
import type {
  SchoolFormValues,
  SubscribeSchoolFormValues,
} from "../schemas/school.schema";

export function SchoolsPage() {
  const { data, isLoading, refetch } = useFetchSchools();
  const schools = data?.data ?? [];

  const createSchool = useCreateSchool();
  const deleteSchool = useDeleteSchool();
  const subscribeSchool = useSubscribeSchool();

  const [schoolFormOpen, setSchoolFormOpen] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  const updateSchool = useUpdateSchool(editingSchoolId ?? "");

  const handleCreate = () => {
    setEditingSchoolId(null);
    setSchoolFormOpen(true);
  };

  const handleEdit = (school: School) => {
    setEditingSchoolId(school.id);
    setSchoolFormOpen(true);
  };

  const handleDelete = (school: School) => {
    setDeletingSchool(school);
    setDeleteConfirmOpen(true);
  };

  const handleSchoolFormSubmit = (
    values: Omit<SchoolFormValues, "details"> & {
      details: Record<string, string | number | boolean>;
      password?: string;
    },
  ) => {
    if (editingSchoolId) {
      const { password: _password, ...rest } = values;
      void _password;
      updateSchool.mutate(rest, {
        onSuccess: () => {
          setSchoolFormOpen(false);
          setEditingSchoolId(null);
        },
      });
    } else {
      createSchool.mutate(
        {
          ...values,
          password: values.password ?? "",
        },
        {
          onSuccess: () => {
            setSchoolFormOpen(false);
          },
        },
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingSchool) {
      deleteSchool.mutate(deletingSchool.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeletingSchool(null);
        },
      });
    }
  };

  const handleSubscribeSubmit = (values: SubscribeSchoolFormValues) => {
    if (!selectedSchoolId) return;
    subscribeSchool.mutate(
      { ...values, tenantId: selectedSchoolId },
      {
        onSuccess: () => {
          setSubscribeOpen(false);
          setSelectedSchoolId(null);
        },
      },
    );
  };

  const handleSubscribe = (school: School) => {
    setSelectedSchoolId(school.id);
    setSubscribeOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Schools
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage schools and their subscriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCwIcon />
            Refresh
          </Button>
          <Button onClick={handleCreate}>
            <PlusIcon />
            Add School
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Loading schools...</p>
        </div>
      ) : (
        <SchoolsTable
          schools={schools}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSubscribe={handleSubscribe}
        />
      )}

      <SchoolForm
        open={schoolFormOpen}
        onOpenChange={setSchoolFormOpen}
        schoolId={editingSchoolId}
        onSubmit={handleSchoolFormSubmit}
        isPending={createSchool.isPending || updateSchool.isPending}
      />

      <SubscribeSchool
        open={subscribeOpen}
        onOpenChange={setSubscribeOpen}
        schoolId={selectedSchoolId}
        onSubmit={handleSubscribeSubmit}
        isPending={subscribeSchool.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete School"
        description={`Are you sure you want to delete "${deletingSchool?.name}"? This action cannot be undone and will remove all associated data.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteSchool.isPending}
      />
    </div>
  );
}
