import { useState } from "react";
import { useNavigate } from "react-router";
import {
  PlusIcon,
  RefreshCwIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/custom/page-header";
import { ContextSelector } from "@/components/custom/context-selector";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import {
  useFetchSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useFetchGrades,
} from "../api/classes.api";
import { ClassesTable } from "../components/classes-table.component";
import { SectionForm } from "../forms/section.form";
import type { Section } from "@/features/registration/types/registration.types";
import type { SectionFormValues } from "../schemas/section.schema";

export function ClassesPage() {
  const navigate = useNavigate();
  const { tenantId, branchId, year, role } = useAuthContext();
  const isAdminOrOwner = role === "Admin" || role === "Owner";

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const { data: gradesData } = useFetchGrades();
  const grades = gradesData?.data ?? [];

  const { data: sectionsData, isLoading, refetch } = useFetchSections(
    branchId ? { branchId, year } : undefined,
  );
  const sections = sectionsData?.data ?? [];

  const [gradeFilter, setGradeFilter] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingSection, setDeletingSection] = useState<Section | null>(null);

  const createSection = useCreateSection();
  const updateSection = useUpdateSection(editingSectionId ?? "");
  const deleteSection = useDeleteSection();

  const gradeMap = new Map(grades.map((grade) => [grade.id, grade.grade]));
  const branchMap = new Map(branches.map((branch) => [branch.id, branch.name]));

  const gradeLabel = (gradeId: string) =>
    String(gradeMap.get(gradeId) ?? gradeId);
  const branchLabel = (branchId: string) =>
    branchMap.get(branchId) ?? branchId;

  const filteredSections = gradeFilter
    ? sections.filter((section) => section.gradeId === gradeFilter)
    : sections;

  const handleCreate = () => {
    setEditingSectionId(null);
    setFormOpen(true);
  };

  const handleEdit = (section: Section) => {
    setEditingSectionId(section.id);
    setFormOpen(true);
  };

  const handleDelete = (section: Section) => {
    setDeletingSection(section);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = (values: SectionFormValues) => {
    if (editingSectionId) {
      updateSection.mutate(values, {
        onSuccess: () => {
          setFormOpen(false);
          setEditingSectionId(null);
        },
      });
    } else {
      createSection.mutate(values, {
        onSuccess: () => {
          setFormOpen(false);
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingSection) {
      deleteSection.mutate(deletingSection.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeletingSection(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">      <PageHeader title="Classes" description="Manage classes and sections">
        <ContextSelector
          branches={isAdminOrOwner ? branches.map((b) => ({ id: b.id, name: b.name })) : undefined}
          showTerm={false}
        />
        <Button variant="outline" onClick={() => navigate("/classes/grades")}>
          <Settings2Icon />
          Grades
        </Button>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCwIcon />
          Refresh
        </Button>
        <Button onClick={handleCreate}>
          <PlusIcon />
          New Class
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <Select
          aria-label="Grade filter"
          className="w-44"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="">All grades</option>
          {grades.map((grade) => (
            <option key={grade.id} value={grade.id}>
              Grade {grade.grade}
            </option>
          ))}
        </Select>
        <p className="ml-auto text-sm text-muted-foreground">
          <UsersIcon className="mr-1 inline size-4" />
          {filteredSections.length} class
          {filteredSections.length === 1 ? "" : "es"}
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Loading classes...</p>
        </div>
      ) : (
        <ClassesTable
          sections={filteredSections}
          gradeLabel={gradeLabel}
          branchLabel={branchLabel}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <SectionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        sectionId={editingSectionId}
        onSubmit={handleFormSubmit}
        isPending={createSection.isPending || updateSection.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Class"
        description={`Are you sure you want to delete "Grade ${deletingSection ? gradeLabel(deletingSection.gradeId) : ""} · ${deletingSection?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteSection.isPending}
      />
    </div>
  );
}
