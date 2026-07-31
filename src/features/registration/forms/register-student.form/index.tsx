import { useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { LoaderCircleIcon } from "lucide-react";
import {
  WideDialog,
  WideDialogHeader,
  WideDialogTitle,
  WideDialogFooter,
  WideDialogClose,
} from "@/components/custom/wide-dialog";
import { Button } from "@/components/ui/button";
import { useFetchStudent } from "../../api/registration.api";
import type { Student } from "../../types/registration.types";
import { studentSchema } from "./schema";
import type { StudentFormValues } from "./schema";
import type { RegisterStudentFormProps } from "./types";
import { StudentInfoFields } from "./components/student-info.component";
import { ParentsFields } from "./components/parents.component";

const today = () => format(new Date(), "yyyy-MM-dd");

function buildDefaults(student?: Student): StudentFormValues {
  if (!student) {
    return {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      startingGrade: 1,
      enrollmentDate: today(),
      admissionDate: today(),
      sex: "Male",
      address: "",
      nationality: "Ethiopian",
      previousSchool: "",
      languagePreference: "English",
      phone: "",
      parents: [],
    };
  }

  return {
    firstName: student.firstName,
    middleName: student.middleName,
    lastName: student.lastName,
    dateOfBirth: student.dateOfBirth
      ? format(parseISO(student.dateOfBirth), "yyyy-MM-dd")
      : "",
    startingGrade: student.startingGrade,
    enrollmentDate: student.enrollmentDate
      ? format(parseISO(student.enrollmentDate), "yyyy-MM-dd")
      : "",
    admissionDate: student.admissionDate
      ? format(parseISO(student.admissionDate), "yyyy-MM-dd")
      : "",
    sex: student.sex,
    address: student.address,
    nationality: student.nationality,
    previousSchool: student.previousSchool ?? "",
    languagePreference: student.languagePreference ?? "",
    phone: student.phone ?? "",
    parents: [],
  };
}

function RegisterStudentFormContent({
  studentId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<RegisterStudentFormProps, "open">) {
  const isEditing = !!studentId;
  const { data: studentData, isLoading } = useFetchStudent(studentId ?? "");
  const student = studentData?.data;

  const defaultValues = useMemo(
    () => buildDefaults(student),
    [student],
  );

  const {    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema) as Resolver<StudentFormValues>,
    values: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parents",
  });

  const handleFormSubmit = (values: StudentFormValues) => {
    if (!isEditing && (!values.parents || values.parents.length === 0)) {
      setError("parents", {
        type: "manual",
        message: "Add at least one parent",
      });
      return;
    }
    onSubmit(values);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <WideDialogClose onClick={() => onOpenChange(false)} />
      <WideDialogHeader>
        <WideDialogTitle>
          {isEditing ? "Edit Student" : "Register Student"}
        </WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Student Information
          </p>
          <StudentInfoFields control={control} errors={errors} />
        </div>

        {!isEditing && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Parents</p>
            <ParentsFields
              control={control}
              errors={errors}
              fields={fields}
              append={append}
              remove={remove}
            />
          </div>
        )}

        <WideDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : isEditing
                ? "Update Student"
                : "Register Student"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function RegisterStudentForm({
  open,
  onOpenChange,
  studentId,
  onSubmit,
  isPending,
}: RegisterStudentFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <RegisterStudentFormContent
          key={studentId ?? "__new__"}
          studentId={studentId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
