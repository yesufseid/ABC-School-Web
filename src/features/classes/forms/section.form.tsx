import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { useFetchSection, useFetchGrades } from "../api/classes.api";
import { sectionSchema } from "../schemas/section.schema";
import type { SectionFormValues } from "../schemas/section.schema";

interface SectionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId?: string | null;
  onSubmit: (values: SectionFormValues) => void;
  isPending: boolean;
}

function currentYearOptions(): string[] {
  const year = new Date().getFullYear();
  return [String(year - 1), String(year), String(year + 1)];
}

function SectionFormContent({
  sectionId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<SectionFormProps, "open">) {
  const isEditing = !!sectionId;
  const { tenantId, branchId: authBranchId, year: authYear } = useAuthContext();

  const { data: sectionData, isLoading } = useFetchSection(sectionId ?? "");
  const section = sectionData?.data;

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const { data: gradesData } = useFetchGrades();
  const grades = gradesData?.data ?? [];

  const defaultValues = useMemo<SectionFormValues>(
    () => ({
      name: section?.name ?? "",
      year: section?.year ?? authYear,
      capacity: section?.capacity ?? 30,
      gradeId: section?.gradeId ?? "",
      branchId: section?.branchId ?? authBranchId ?? "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [section],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SectionFormValues>({
    resolver: zodResolver(sectionSchema) as Resolver<SectionFormValues>,
    values: defaultValues,
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
          {isEditing ? "Edit Class" : "New Class"}
        </WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Section Name
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="e.g. A"
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
            <label className="text-sm font-medium text-foreground">
              Grade
            </label>
            <Controller
              control={control}
              name="gradeId"
              render={({ field }) => (
                <Select
                  aria-invalid={!!errors.gradeId}
                  {...field}
                >
                  <option value="" disabled>
                    Select grade
                  </option>
                  {grades.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      Grade {grade.grade}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.gradeId && (
              <p className="text-sm text-destructive">
                {errors.gradeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Year
            </label>
            <Controller
              control={control}
              name="year"
              render={({ field }) => (
                <Select
                  aria-invalid={!!errors.year}
                  {...field}
                >
                  {currentYearOptions().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              )}
            />
            {errors.year && (
              <p className="text-sm text-destructive">{errors.year.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Capacity
            </label>
            <Controller
              control={control}
              name="capacity"
              render={({ field }) => (
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 30"
                  aria-invalid={!!errors.capacity}
                  {...field}
                />
              )}
            />
            {errors.capacity && (
              <p className="text-sm text-destructive">
                {errors.capacity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Branch
            </label>
            <Controller
              control={control}
              name="branchId"
              render={({ field }) => (
                <Select
                  aria-invalid={!!errors.branchId}
                  {...field}
                >
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
                ? "Update Class"
                : "Create Class"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function SectionForm({
  open,
  onOpenChange,
  sectionId,
  onSubmit,
  isPending,
}: SectionFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <SectionFormContent
          key={sectionId ?? "__new__"}
          sectionId={sectionId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
