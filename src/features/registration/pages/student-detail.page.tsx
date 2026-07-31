import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { format, parseISO } from "date-fns";
import {
  ArrowLeftIcon,
  LoaderCircleIcon,
  PencilIcon,
  RefreshCcwIcon,
  FileCheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DetailItem } from "@/components/custom/detail-item";
import {
  useFetchStudent,
  useUpdateStudent,
  useReAdmitStudent,
  useFetchSection,
} from "../api/registration.api";
import { RegisterStudentForm } from "../forms/register-student.form";
import { ReAdmitDialog } from "../components/re-admit-dialog.component";
import { StudentConfirmationDialog } from "../components/student-confirmation.component";
import type { StudentFormValues } from "../schemas/student.schema";
import type { ReAdmitFormValues } from "../schemas/re-admit.schema";

function statusVariant(status: string) {
  const s = status.toUpperCase();
  if (["ACTIVE", "ENROLLED", "ADMITTED"].includes(s)) return "success";
  if (["INACTIVE", "DROPPED", "WITHDRAWN"].includes(s)) return "secondary";
  return "outline";
}

function formatDate(value?: string) {
  return value ? format(parseISO(value), "MMM d, yyyy") : "-";
}

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useFetchStudent(id ?? "");
  const { data: sectionData } = useFetchSection(data?.data.sectionId ?? "");

  const [formOpen, setFormOpen] = useState(false);
  const [reAdmitOpen, setReAdmitOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const updateStudent = useUpdateStudent(id ?? "");
  const reAdmitStudent = useReAdmitStudent(id ?? "");

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
        <Button variant="ghost" onClick={() => navigate("/students")}>
          <ArrowLeftIcon />
          Back to Students
        </Button>
        <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to load student details.
          </p>
        </div>
      </div>
    );
  }

  const student = data.data;
  const studentName = `${student.firstName} ${student.middleName} ${student.lastName}`;

  const handleFormSubmit = (values: StudentFormValues) => {
    const { parents: _parents, ...rest } = values;
    void _parents;
    updateStudent.mutate(rest, {
      onSuccess: () => {
        setFormOpen(false);
      },
    });
  };

  const handleReAdmitSubmit = (values: ReAdmitFormValues) => {
    reAdmitStudent.mutate(values, {
      onSuccess: () => {
        setReAdmitOpen(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/students")}>
          <ArrowLeftIcon />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {studentName}
            </h1>
            <Badge variant={statusVariant(student.status)}>
              {student.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Grade {student.startingGrade} · {student.sex}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setConfirmationOpen(true)}>
            <FileCheckIcon />
            Confirmation
          </Button>
          <Button variant="outline" onClick={() => setReAdmitOpen(true)}>
            <RefreshCcwIcon />
            Re-admit
          </Button>
          <Button onClick={() => setFormOpen(true)}>
            <PencilIcon />
            Edit
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
            <DetailItem label="Full Name" value={studentName} />
            <DetailItem label="Sex" value={student.sex} />
            <DetailItem
              label="Date of Birth"
              value={formatDate(student.dateOfBirth)}
            />
            <DetailItem label="Phone" value={student.phone ?? "-"} />
            <DetailItem label="Address" value={student.address} />
            <DetailItem label="Nationality" value={student.nationality} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Academics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <DetailItem
              label="Starting Grade"
              value={`Grade ${student.startingGrade}`}
            />
            <DetailItem
              label="Enrollment Date"
              value={formatDate(student.enrollmentDate)}
            />
            <DetailItem
              label="Admission Date"
              value={formatDate(student.admissionDate)}
            />
            <DetailItem
              label="Previous School"
              value={student.previousSchool ?? "-"}
            />
            <DetailItem
              label="Language Preference"
              value={student.languagePreference ?? "-"}
            />
            <DetailItem
              label="Section"
              value={sectionData?.data?.name ? `Grade ${sectionData.data.name}` : "-"}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Parents ({student.parents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {student.parents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No parents linked.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {student.parents.map((parent, index) => (
                <div
                  key={parent.id ?? index}
                  className="space-y-2 rounded-xl border border-border/50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {parent.name}
                    </p>
                    {parent.isPrimary && (
                      <Badge variant="outline">Primary</Badge>
                    )}
                  </div>
                  <DetailItem label="Phone" value={parent.phoneNumber} />
                  <DetailItem label="Relation" value={parent.relation ?? "-"} />
                  <DetailItem label="Address" value={parent.address ?? "-"} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RegisterStudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        studentId={student.id}
        onSubmit={handleFormSubmit}
        isPending={updateStudent.isPending}
      />

      <ReAdmitDialog
        open={reAdmitOpen}
        onOpenChange={setReAdmitOpen}
        studentName={studentName}
        onSubmit={handleReAdmitSubmit}
        isPending={reAdmitStudent.isPending}
      />

      <StudentConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        studentId={student.id}
        studentName={studentName}
      />
    </div>
  );
}
