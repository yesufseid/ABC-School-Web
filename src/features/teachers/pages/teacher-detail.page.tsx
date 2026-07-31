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
import { useFetchGrades } from "@/features/classes/api/classes.api";
import {
  useFetchTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from "../api/teachers.api";
import { TeacherForm } from "../forms/teacher.form";
import type { TeacherFormValues } from "../schemas/teacher.schema";

function formatDate(value?: string) {
  return value ? format(parseISO(value), "MMM d, yyyy") : "-";
}

export function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenantId } = useAuthContext();

  const { data, isLoading, isError } = useFetchTeacher(id ?? "");
  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const { data: gradesData } = useFetchGrades();

  const branches = branchesData?.data ?? [];
  const grades = gradesData?.data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const updateTeacher = useUpdateTeacher(id ?? "");
  const deleteTeacher = useDeleteTeacher();

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
        <Button variant="ghost" onClick={() => navigate("/teachers")}>
          <ArrowLeftIcon />
          Back to Teachers
        </Button>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load teacher details.
          </p>
        </div>
      </div>
    );
  }

  const teacher = data.data;
  const teacherName = `${teacher.firstName} ${teacher.middleName ? `${teacher.middleName} ` : ""}${teacher.lastName}`;
  const branch = branches.find((b) => b.id === teacher.branchId);
  const gradeMap = new Map(grades.map((g) => [g.id, g]));
  const subjectMap = new Map(
    grades.flatMap((grade) =>
      grade.subjects.map((subject) => [subject.id, subject]),
    ),
  );

  const handleFormSubmit = (values: TeacherFormValues) => {
    updateTeacher.mutate(values, {
      onSuccess: () => {
        setFormOpen(false);
      },
    });
  };

  const handleDeleteConfirm = () => {
    deleteTeacher.mutate(teacher.id, {
      onSuccess: () => {
        navigate("/teachers");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/teachers")}>
          <ArrowLeftIcon />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {teacherName}
          </h1>
          <p className="text-sm text-muted-foreground">
            {branch?.name ?? teacher.branchId} · {teacher.phone}
          </p>
        </div>
        <div className="flex gap-2">
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
            <CardTitle className="text-sm font-medium">
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DetailItem label="Full Name" value={teacherName} />
            <DetailItem label="Sex" value={teacher.sex} />
            <DetailItem label="Phone" value={teacher.phone} />
            <DetailItem label="Email" value={teacher.email ?? "-"} />
            <DetailItem label="Address" value={teacher.address} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Assignment</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <DetailItem label="Branch" value={branch?.name ?? teacher.branchId} />
            <DetailItem
              label="Starting Date"
              value={formatDate(teacher.startingDate)}
            />
            <DetailItem
              label="Weekly Periods"
              value={`${teacher.weeklyPeriods} periods`}
            />
            <DetailItem
              label="Assigned Grades"
              value={`${teacher.grades.length} grades`}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Assigned Grades ({teacher.grades.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teacher.grades.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No grades assigned.
            </p>
          ) : (
            <div className="space-y-4">
              {teacher.grades.map((gradeLink, index) => {
                const grade = gradeMap.get(gradeLink.gradeId);
                const subjectNames = gradeLink.subjectIds
                  .map((subjectId) => subjectMap.get(subjectId)?.name)
                  .filter(Boolean);
                return (
                  <div
                    key={`${gradeLink.gradeId}-${index}`}
                    className="space-y-2 rounded-xl border border-border/50 p-4"
                  >
                    <p className="text-sm font-medium text-foreground">
                      Grade {grade?.grade ?? gradeLink.gradeId}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {subjectNames.length === 0 ? (
                        <span className="text-xs text-muted-foreground">
                          No subjects
                        </span>
                      ) : (
                        subjectNames.map((name) => (
                          <Badge key={name} variant="outline">
                            {name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <TeacherForm
        open={formOpen}
        onOpenChange={setFormOpen}
        teacherId={teacher.id}
        onSubmit={handleFormSubmit}
        isPending={updateTeacher.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Teacher"
        description={`Are you sure you want to delete "${teacherName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteTeacher.isPending}
      />
    </div>
  );
}
