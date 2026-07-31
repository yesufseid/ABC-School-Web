import { useState } from "react";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/custom/page-header";
import { ContextSelector } from "@/components/custom/context-selector";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import {
  useFetchTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from "../api/teachers.api";
import { TeachersTable } from "../components/teachers-table.component";
import { TeacherForm } from "../forms/teacher.form";
import type { Teacher } from "../types/teacher.types";
import type { TeacherFormValues } from "../schemas/teacher.schema";

export function TeachersPage() {
  const { tenantId, role } = useAuthContext();
  const isAdminOrOwner = role === "Admin" || role === "Owner";

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const { data: teachersData, isLoading, refetch } = useFetchTeachers();
  const teachers = teachersData?.data ?? [];

  const createTeacher = useCreateTeacher();
  const deleteTeacher = useDeleteTeacher();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  const updateTeacher = useUpdateTeacher(editingTeacherId ?? "");

  const branchMap = new Map(branches.map((branch) => [branch.id, branch.name]));
  const branchLabel = (branchId: string) =>
    branchMap.get(branchId) ?? branchId;

  const handleCreate = () => {
    setEditingTeacherId(null);
    setFormOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacherId(teacher.id);
    setFormOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setDeletingTeacher(teacher);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (values: TeacherFormValues) => {
    if (editingTeacherId) {
      updateTeacher.mutate(values, {
        onSuccess: () => {
          setFormOpen(false);
          setEditingTeacherId(null);
        },
      });
    } else {
      createTeacher.mutate(values, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingTeacher) {
      deleteTeacher.mutate(deletingTeacher.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeletingTeacher(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description="Manage teachers and assignments">
        <ContextSelector
          branches={
            isAdminOrOwner
              ? branches.map((b) => ({ id: b.id, name: b.name }))
              : undefined
          }
          showTerm={false}
        />
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCwIcon />
          Refresh
        </Button>
        <Button onClick={handleCreate}>
          <PlusIcon />
          Add Teacher
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Loading teachers...</p>
        </div>
      ) : (
        <TeachersTable
          teachers={teachers}
          branchLabel={branchLabel}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <TeacherForm
        open={formOpen}
        onOpenChange={setFormOpen}
        teacherId={editingTeacherId}
        onSubmit={handleFormSubmit}
        isPending={createTeacher.isPending || updateTeacher.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Teacher"
        description={`Are you sure you want to delete "${deletingTeacher?.firstName} ${deletingTeacher?.lastName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteTeacher.isPending}
      />
    </div>
  );
}
