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
import { useFetchGradingRule } from "../api/academics.api";
import {
  gradingRuleSchema,
  type GradingRuleFormValues,
} from "../schemas/grading-rule.schema";

export type RuleFormValues = GradingRuleFormValues;

interface GradingRuleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleId?: string | null;
  onSubmit: (values: RuleFormValues) => void;
  isPending: boolean;
}

function GradingRuleFormContent({
  ruleId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<GradingRuleFormProps, "open">) {
  const isEditing = !!ruleId;

  const { data: ruleData, isLoading } = useFetchGradingRule(ruleId ?? "");
  const rule = ruleData?.data;

  const defaultValues = useMemo<GradingRuleFormValues>(
    () => ({
      minMarks: rule?.minMarks ?? 0,
      maxMarks: rule?.maxMarks ?? 100,
      grade: rule?.grade ?? "A",
      points: rule?.points ?? 4,
      isPass: rule?.isPass ?? true,
    }),
    [rule],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GradingRuleFormValues>({
    resolver: zodResolver(gradingRuleSchema) as Resolver<GradingRuleFormValues>,
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
          {isEditing ? "Edit Grading Rule" : "Add Grading Rule"}
        </WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Min Marks</label>
            <Controller
              control={control}
              name="minMarks"
              render={({ field }) => (
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 90"
                  aria-invalid={!!errors.minMarks}
                  {...field}
                />
              )}
            />
            {errors.minMarks && (
              <p className="text-sm text-destructive">{errors.minMarks.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Max Marks</label>
            <Controller
              control={control}
              name="maxMarks"
              render={({ field }) => (
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 100"
                  aria-invalid={!!errors.maxMarks}
                  {...field}
                />
              )}
            />
            {errors.maxMarks && (
              <p className="text-sm text-destructive">{errors.maxMarks.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Grade</label>
            <Controller
              control={control}
              name="grade"
              render={({ field }) => (
                <Input
                  placeholder="e.g. A"
                  aria-invalid={!!errors.grade}
                  {...field}
                />
              )}
            />
            {errors.grade && (
              <p className="text-sm text-destructive">{errors.grade.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Points</label>
            <Controller
              control={control}
              name="points"
              render={({ field }) => (
                <Input
                  type="number"
                  min={0}
                  step="0.5"
                  placeholder="e.g. 4"
                  aria-invalid={!!errors.points}
                  {...field}
                />
              )}
            />
            {errors.points && (
              <p className="text-sm text-destructive">{errors.points.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Passing?</label>
            <Controller
              control={control}
              name="isPass"
              render={({ field }) => (
                <Select
                  value={field.value ? "true" : "false"}
                  onChange={(e) => field.onChange(e.target.value === "true")}
                >
                  <option value="true">Pass</option>
                  <option value="false">Fail</option>
                </Select>
              )}
            />
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
            {isPending ? "Saving..." : isEditing ? "Update Rule" : "Add Rule"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function GradingRuleForm({
  open,
  onOpenChange,
  ruleId,
  onSubmit,
  isPending,
}: GradingRuleFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <GradingRuleFormContent
          key={ruleId ?? "__new__"}
          ruleId={ruleId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
