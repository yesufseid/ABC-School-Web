import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PlusIcon, RefreshCwIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/custom/page-header";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import {
  useFetchStudents,
  useSearchStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
  useReAdmitStudent,
  useFetchSections,
} from "../api/registration.api";
import { RegisterStudentForm } from "../forms/register-student.form";
import { StudentsTable } from "../components/students-table.component";
import { ReAdmitDialog } from "../components/re-admit-dialog.component";
import type { Student } from "../types/registration.types";
import type { StudentFormValues } from "../schemas/student.schema";
import type { ReAdmitFormValues } from "../schemas/re-admit.schema";

export function StudentsPage() {
  const navigate = useNavigate();
  const { branchId, year } = useAuthContext();

  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const [reAdmitOpen, setReAdmitOpen] = useState(false);
  const [reAdmittingStudent, setReAdmittingStudent] = useState<Student | null>(
    null,
  );

  const { data: listData, isLoading: listLoading, refetch } = useFetchStudents();
  const { data: searchData, isLoading: searchLoading } =
    useSearchStudents(query);
  const { data: sectionsData } = useFetchSections(
    branchId ? { branchId, year } : undefined,
  );

  const sections = sectionsData?.data ?? [];
  const isSearching = query.trim().length > 0;
  const rawStudents = isSearching
    ? (searchData?.data ?? [])
    : (listData?.data ?? []);
  const students = sectionFilter
    ? rawStudents.filter((student) => student.sectionId === sectionFilter)
    : rawStudents;
  const isLoading = isSearching ? searchLoading : listLoading;

  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent(editingStudentId ?? "");
  const deleteStudent = useDeleteStudent();
  const reAdmitStudent = useReAdmitStudent(reAdmittingStudent?.id ?? "");

  useEffect(() => {
    const timer = setTimeout(() => setQuery(queryInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [queryInput]);

  const handleCreate = () => {
    setEditingStudentId(null);
    setFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudentId(student.id);
    setFormOpen(true);
  };

  const handleDelete = (student: Student) => {
    setDeletingStudent(student);
    setDeleteConfirmOpen(true);
  };

  const handleReAdmit = (student: Student) => {
    setReAdmittingStudent(student);
    setReAdmitOpen(true);
  };

  const handleFormSubmit = (values: StudentFormValues) => {
    if (editingStudentId) {
      const { parents: _parents, ...rest } = values;
      void _parents;
      updateStudent.mutate(rest, {
        onSuccess: () => {
          setFormOpen(false);
          setEditingStudentId(null);
        },
      });
    } else {
      const { parents = [], ...rest } = values;
      createStudent.mutate(
        { ...rest, parents },
        {
          onSuccess: () => {
            setFormOpen(false);
          },
        },
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingStudent) {
      deleteStudent.mutate(deletingStudent.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setDeletingStudent(null);
        },
      });
    }
  };

  const handleReAdmitSubmit = (values: ReAdmitFormValues) => {
    if (!reAdmittingStudent) return;
    reAdmitStudent.mutate(values, {
      onSuccess: () => {
        setReAdmitOpen(false);
        setReAdmittingStudent(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Manage student registrations">
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCwIcon />
          Refresh
        </Button>
        <Button onClick={handleCreate}>
          <PlusIcon />
          Register Student
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by name or phone..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
        </div>

        <Select
          aria-label="Section"
          className="w-44"
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
        >
          <option value="">All sections</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              Grade {section.name}
            </option>
          ))}
        </Select>

        <Button
          variant="outline"
          onClick={() => navigate("/classes")}
          className="ml-auto"
        >
          Manage Classes
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
          <p className="text-muted-foreground">Loading students...</p>
        </div>
      ) : (
        <StudentsTable
          students={students}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReAdmit={handleReAdmit}
        />
      )}

      <RegisterStudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        studentId={editingStudentId}
        onSubmit={handleFormSubmit}
        isPending={createStudent.isPending || updateStudent.isPending}
      />

      <ReAdmitDialog
        open={reAdmitOpen}
        onOpenChange={setReAdmitOpen}
        studentName={
          reAdmittingStudent
            ? `${reAdmittingStudent.firstName} ${reAdmittingStudent.lastName}`
            : ""
        }
        onSubmit={handleReAdmitSubmit}
        isPending={reAdmitStudent.isPending}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Student"
        description={`Are you sure you want to delete "${deletingStudent?.firstName} ${deletingStudent?.lastName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        isPending={deleteStudent.isPending}
      />
    </div>
  );
}
