import { useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useFetchGrade } from "../../api/classes.api";
import { gradeSchema } from "./schema";
import type { GradeFormValues } from "./schema";
import type { GradeFormProps } from "./types";
import { SubjectsFields } from "./components/subjects.component";

function GradeFormContent({
  gradeId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<GradeFormProps, "open">) {
  const isEditing = !!gradeId;
  const { data: gradeData, isLoading } = useFetchGrade(gradeId ?? "");
  const grade = gradeData?.data;

  const defaultValues = useMemo<GradeFormValues>(
    () => ({
      grade: grade?.grade ?? 1,
      subjects: grade?.subjects.map((subject) => ({ name: subject.name })) ?? [
        { name: "" },
      ],
    }),
    [grade],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema) as Resolver<GradeFormValues>,
    values: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
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
          {isEditing ? "Edit Grade" : "New Grade"}
        </WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Grade Level
          </label>
          <Controller
            control={control}
            name="grade"
            render={({ field }) => (
              <Select
                aria-invalid={!!errors.grade}
                {...field}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((level) => (
                  <option key={level} value={level}>
                    Grade {level}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.grade && (
            <p className="text-sm text-destructive">{errors.grade.message}</p>
          )}
        </div>

        <SubjectsFields
          control={control}
          errors={errors}
          fields={fields}
          append={append}
          remove={remove}
        />

        <WideDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Grade" : "Create Grade"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function GradeForm({
  open,
  onOpenChange,
  gradeId,
  onSubmit,
  isPending,
}: GradeFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <GradeFormContent
          key={gradeId ?? "__new__"}
          gradeId={gradeId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
