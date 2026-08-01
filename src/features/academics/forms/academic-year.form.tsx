import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  WideDialog,
  WideDialogHeader,
  WideDialogTitle,
  WideDialogFooter,
  WideDialogClose,
} from "@/components/custom/wide-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  academicYearSchema,
  type AcademicYearFormValues,
} from "../schemas/academic-year.schema";
import type { AcademicYear } from "../types/academics.types";

export type YearFormValues = AcademicYearFormValues;

interface AcademicYearFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  year?: AcademicYear | null;
  onSubmit: (values: YearFormValues) => void;
  isPending: boolean;
}

function toDateInputValue(value?: string): string {
  return value ? value.slice(0, 10) : "";
}

export function AcademicYearForm({
  open,
  onOpenChange,
  year,
  onSubmit,
  isPending,
}: AcademicYearFormProps) {
  const isEditing = !!year;

  const defaultValues = useMemo<AcademicYearFormValues>(
    () => ({
      name: year?.name ?? "",
      calendarType: year?.calendarType ?? "TERM",
      startDate: toDateInputValue(year?.startDate),
      endDate: toDateInputValue(year?.endDate),
      status: year?.status ?? "ACTIVE",
      isCurrent: year?.isCurrent ?? false,
    }),
    [year],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearSchema) as Resolver<AcademicYearFormValues>,
    values: defaultValues,
  });

  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <>
          <WideDialogClose onClick={() => onOpenChange(false)} />
          <WideDialogHeader>
            <WideDialogTitle>
              {isEditing ? "Edit Academic Year" : "Add Academic Year"}
            </WideDialogTitle>
          </WideDialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      placeholder="e.g. 2026/2027"
                      aria-invalid={!!errors.name}
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Calendar Type</label>
                <Controller
                  control={control}
                  name="calendarType"
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="SEMESTER">Semester</option>
                      <option value="TERM">Term</option>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Start Date</label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Input
                      type="date"
                      aria-invalid={!!errors.startDate}
                      {...field}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">End Date</label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <Input
                      type="date"
                      aria-invalid={!!errors.endDate}
                      {...field}
                    />
                  )}
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Status</label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CLOSED">Closed</option>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Controller
                    control={control}
                    name="isCurrent"
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border accent-primary"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    )}
                  />
                  Set as current year
                </label>
              </div>
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
                {isPending ? "Saving..." : isEditing ? "Update Year" : "Add Year"}
              </Button>
            </WideDialogFooter>
          </form>
        </>
      )}
    </WideDialog>
  );
}
