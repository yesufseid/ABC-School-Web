import { useState } from "react";
import { useNavigate } from "react-router";
import { PlusIcon, RefreshCwIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/custom/page-header";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import {
  useFetchGrades,
  useCreateGrade,
  useUpdateGrade,
  useDeleteGrade,
} from "../api/classes.api";
import { GradesTable } from "../components/grades-table.component";
import { GradeForm } from "../forms/grade.form";
import type { Grade } from "../types/classes.types";
import type { GradeFormValues } from "../schemas/grade.schema";

export function GradesPage() {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useFetchGrades();
  const grades = data?.data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingGrade, setDeletingGrade] = useState<Grade | null>(null);

  const createGrade = useCreateGrade();
  const updateGrade = useUpdateGrade(editingGradeId ?? "");
  const deleteGrade = useDeleteGrade();

  const handleCreate = () => {
    setEditingGradeId(null);
    setFormOpen(true);
  };

  const handleEdit = (grade: Grade) => {
    setEditingGradeId(grade.id);
    setFormOpen(true);
  };

  const handleDelete = (grade: Grade) => {
    setDeletingGrade(grade);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (values: GradeFormValues) => {
    if (editingGradeId) {
      updateGrade.mutate(values, {
        onSuccess: () => {
          setFormOpen(false);
          setEditingGradeId(null);
        },
      });
    } else {
      createGrade.mutate(values, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingGrade) {
      deleteGrade.mutate(deletingGrade.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeletingGrade(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Grades" description="Configure grade levels and subjects">
        <Button variant="outline" onClick={() => navigate("/classes")}>
          <ArrowLeftIcon />
          Back to Classes
        </Button>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCwIcon />
          Refresh
        </Button>
        <Button onClick={handleCreate}>
          <PlusIcon />
          New Grade
        </Button>
      </PageHeader>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Loading grades...</p>
        </div>
      ) : (
        <GradesTable
          grades={grades}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <GradeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        gradeId={editingGradeId}
        onSubmit={handleFormSubmit}
        isPending={createGrade.isPending || updateGrade.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Grade"
        description={`Are you sure you want to delete "Grade ${deletingGrade?.grade}"? This will remove the grade and its subjects.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteGrade.isPending}
      />
    </div>
  );
}
