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
  academicPeriodSchema,
  type AcademicPeriodFormValues,
} from "../schemas/academic-period.schema";
import type {
  AcademicPeriod,
  AcademicCalendarType,
} from "../types/academics.types";

export type PeriodFormValues = AcademicPeriodFormValues;

interface AcademicPeriodFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  period?: AcademicPeriod | null;
  calendarType: AcademicCalendarType;
  onSubmit: (values: PeriodFormValues) => void;
  isPending: boolean;
}

function toDateInputValue(value?: string): string {
  return value ? value.slice(0, 10) : "";
}

export function AcademicPeriodForm({
  open,
  onOpenChange,
  period,
  calendarType,
  onSubmit,
  isPending,
}: AcademicPeriodFormProps) {
  const isEditing = !!period;

  const defaultValues = useMemo<AcademicPeriodFormValues>(
    () => ({
      name: period?.name ?? "",
      sequence: period?.sequence ?? 1,
      type: period?.type ?? calendarType,
      startDate: toDateInputValue(period?.startDate),
      endDate: toDateInputValue(period?.endDate),
    }),
    [period, calendarType],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AcademicPeriodFormValues>({
    resolver: zodResolver(academicPeriodSchema) as Resolver<AcademicPeriodFormValues>,
    values: defaultValues,
  });

  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <>
          <WideDialogClose onClick={() => onOpenChange(false)} />
          <WideDialogHeader>
            <WideDialogTitle>
              {isEditing ? "Edit Period" : "Add Period"}
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
                      placeholder={calendarType === "SEMESTER" ? "e.g. Semester 1" : "e.g. Term 1"}
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
                <label className="text-sm font-medium text-foreground">Sequence</label>
                <Controller
                  control={control}
                  name="sequence"
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      placeholder="e.g. 1"
                      aria-invalid={!!errors.sequence}
                      {...field}
                    />
                  )}
                />
                {errors.sequence && (
                  <p className="text-sm text-destructive">{errors.sequence.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Type</label>
                <Controller
                  control={control}
                  name="type"
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

              <div className="space-y-2 sm:col-span-2">
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
                {isPending ? "Saving..." : isEditing ? "Update Period" : "Add Period"}
              </Button>
            </WideDialogFooter>
          </form>
        </>
      )}
    </WideDialog>
  );
}
