import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeftIcon, LoaderCircleIcon, PencilIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CustomTable } from "@/components/custom/custom-table";
import { DetailItem } from "@/components/custom/detail-item";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import {
  useFetchSection,
  useFetchSectionStudents,
  useFetchGrades,
  useUpdateSection,
  useDeleteSection,
} from "../api/classes.api";
import { SectionForm } from "../forms/section.form";
import { AssignStudentsDialog } from "../components/assign-students-dialog.component";
import type { SectionFormValues } from "../schemas/section.schema";

export function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenantId } = useAuthContext();

  const { data: sectionData, isLoading: sectionLoading, isError } =
    useFetchSection(id ?? "");
  const { data: studentsData, isLoading: studentsLoading } =
    useFetchSectionStudents(id ?? "");
  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const { data: gradesData } = useFetchGrades();

  const students = studentsData?.data ?? [];
  const branches = branchesData?.data ?? [];
  const grades = gradesData?.data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const updateSection = useUpdateSection(id ?? "");
  const deleteSection = useDeleteSection();

  if (sectionLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !sectionData?.data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate("/classes")}>
          <ArrowLeftIcon />
          Back to Classes
        </Button>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <p className="text-sm text-destructive">Failed to load class details.</p>
        </div>
      </div>
    );
  }

  const section = sectionData.data;
  const grade = grades.find((g) => g.id === section.gradeId);
  const branch = branches.find((b) => b.id === section.branchId);
  const sectionLabel = `Grade ${grade?.grade ?? section.gradeId} · ${section.name}`;

  const handleFormSubmit = (values: SectionFormValues) => {
    updateSection.mutate(values, {
      onSuccess: () => {
        setFormOpen(false);
      },
    });
  };

  const handleDeleteConfirm = () => {
    deleteSection.mutate(section.id, {
      onSuccess: () => {
        navigate("/classes");
      },
    });
  };

  const studentColumns = [
    {
      title: "Name",
      key: "firstName",
      component: (_value: (typeof students)[number][keyof (typeof students)[number]], row: (typeof students)[number]) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/students/${row.id}`);
          }}
          className="cursor-pointer text-left hover:underline"
        >
          <p className="font-medium text-foreground">
            {row.firstName} {row.lastName}
          </p>
          {row.middleName && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {row.middleName}
            </p>
          )}
        </button>
      ),
    },
    {
      title: "Sex",
      key: "sex",
      component: (value: (typeof students)[number][keyof (typeof students)[number]]) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Phone",
      key: "phone",
      component: (value: (typeof students)[number][keyof (typeof students)[number]]) => (
        <span className="text-muted-foreground">
          {value ? String(value) : "-"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      component: (value: (typeof students)[number][keyof (typeof students)[number]]) => (
        <Badge variant="outline">{String(value)}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/classes")}>
          <ArrowLeftIcon />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {sectionLabel}
          </h1>
          <p className="text-sm text-muted-foreground">
            {section.year} · {branch?.name ?? section.branchId}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAssignOpen(true)}>
            <UsersIcon />
            Assign Students
          </Button>
          <Button onClick={() => setFormOpen(true)}>
            <PencilIcon />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Class Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label="Section" value={section.name} />
            <DetailItem
              label="Grade"
              value={grade ? `Grade ${grade.grade}` : section.gradeId}
            />
            <DetailItem label="Year" value={section.year} />
            <DetailItem label="Capacity" value={`${section.capacity} students`} />
            <DetailItem label="Enrolled" value={`${students.length} students`} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Subjects ({grade?.subjects.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!grade || grade.subjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No subjects configured for this grade.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {grade.subjects.map((subject) => (
                  <Badge key={subject.id} variant="outline">
                    {subject.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Students ({students.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <p className="text-muted-foreground">Loading students...</p>
          ) : (
            <CustomTable
              data={students}
              columns={studentColumns}
              emptyMessage="No students assigned to this class yet."
            />
          )}
        </CardContent>
      </Card>

      <SectionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        sectionId={section.id}
        onSubmit={handleFormSubmit}
        isPending={updateSection.isPending}
      />

      <AssignStudentsDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        sectionId={section.id}
        sectionLabel={sectionLabel}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Class"
        description={`Are you sure you want to delete "${sectionLabel}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteSection.isPending}
      />
    </div>
  );
}
