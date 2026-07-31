import { useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Select } from "@/components/ui/select";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { useFetchGrades } from "@/features/classes/api/classes.api";
import { useFetchTeacher } from "../../api/teachers.api";
import { teacherSchema } from "./schema";
import type { TeacherFormValues } from "./schema";
import type { TeacherFormProps } from "./types";
import { TeacherInfoFields } from "./components/teacher-info.component";
import { TeacherGradesFields } from "./components/grades.component";

function TeacherFormContent({
  teacherId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<TeacherFormProps, "open">) {
  const isEditing = !!teacherId;
  const { tenantId, branchId: authBranchId } = useAuthContext();

  const { data: teacherData, isLoading } = useFetchTeacher(teacherId ?? "");
  const teacher = teacherData?.data;

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const { data: gradesData } = useFetchGrades();
  const grades = gradesData?.data ?? [];

  const defaultValues = useMemo<TeacherFormValues>(
    () => ({
      branchId: teacher?.branchId ?? authBranchId ?? "",
      firstName: teacher?.firstName ?? "",
      middleName: teacher?.middleName ?? "",
      lastName: teacher?.lastName ?? "",
      phone: teacher?.phone ?? "",
      email: teacher?.email ?? "",
      address: teacher?.address ?? "",
      sex: teacher?.sex ?? "Male",
      startingDate: teacher?.startingDate
        ? format(parseISO(teacher.startingDate), "yyyy-MM-dd")
        : "",
      weeklyPeriods: teacher?.weeklyPeriods ?? 24,
      grades:
        teacher?.grades.map((grade) => ({
          gradeId: grade.gradeId,
          subjectIds: [...grade.subjectIds],
        })) ?? [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teacher],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema) as Resolver<TeacherFormValues>,
    values: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "grades",
  });

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
          {isEditing ? "Edit Teacher" : "Add Teacher"}
        </WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Teacher Information
          </p>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Branch
            </label>
            <Controller
              control={control}
              name="branchId"
              render={({ field }) => (
                <Select aria-invalid={!!errors.branchId} {...field}>
                  <option value="" disabled>
                    Select branch
                  </option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.branchId && (
              <p className="text-sm text-destructive">
                {errors.branchId.message}
              </p>
            )}
          </div>
          <TeacherInfoFields control={control} errors={errors} />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            Grade Assignments
          </p>
          <TeacherGradesFields
            control={control}
            errors={errors}
            fields={fields}
            append={append}
            remove={remove}
            grades={grades}
          />
        </div>

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
                ? "Update Teacher"
                : "Add Teacher"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function TeacherForm({
  open,
  onOpenChange,
  teacherId,
  onSubmit,
  isPending,
}: TeacherFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <TeacherFormContent
          key={teacherId ?? "__new__"}
          teacherId={teacherId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
