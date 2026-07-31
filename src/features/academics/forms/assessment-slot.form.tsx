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
import { useFetchSlot } from "../api/academics.api";
import {
  assessmentSlotSchema,
  type AssessmentSlotFormValues,
} from "../schemas/assessment-slot.schema";

export type SlotFormValues = AssessmentSlotFormValues;

interface SlotFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slotId?: string | null;
  onSubmit: (values: SlotFormValues) => void;
  isPending: boolean;
}

function SlotFormContent({
  slotId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<SlotFormProps, "open">) {
  const isEditing = !!slotId;

  const { data: slotData, isLoading } = useFetchSlot(slotId ?? "");
  const slot = slotData?.data;

  const defaultValues = useMemo<AssessmentSlotFormValues>(
    () => ({
      name: slot?.name ?? "",
      slotType: slot?.slotType ?? "TEST",
      weight: slot?.weight ?? 0.4,
      maxMark: slot?.maxMark ?? 100,
      gradeCycle: slot?.gradeCycle ?? "LOWER_PRIMARY",
    }),
    [slot],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentSlotFormValues>({
    resolver: zodResolver(assessmentSlotSchema) as Resolver<AssessmentSlotFormValues>,
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
          {isEditing ? "Edit Assessment Slot" : "Add Assessment Slot"}
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
                  placeholder="e.g. Final Exam"
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
            <label className="text-sm font-medium text-foreground">Slot Type</label>
            <Controller
              control={control}
              name="slotType"
              render={({ field }) => (
                <Select {...field}>
                  <option value="TEST">Test</option>
                  <option value="MID_ASSIGNMENT">Mid Assignment</option>
                  <option value="FINAL">Final</option>
                  <option value="ASSESSMENT_COMPONENT">Assessment Component</option>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Weight (0–1)
            </label>
            <Controller
              control={control}
              name="weight"
              render={({ field }) => (
                <Input
                  type="number"
                  step="0.05"
                  min={0}
                  max={1}
                  placeholder="e.g. 0.4"
                  aria-invalid={!!errors.weight}
                  {...field}
                />
              )}
            />
            {errors.weight && (
              <p className="text-sm text-destructive">{errors.weight.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Max Mark</label>
            <Controller
              control={control}
              name="maxMark"
              render={({ field }) => (
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 100"
                  aria-invalid={!!errors.maxMark}
                  {...field}
                />
              )}
            />
            {errors.maxMark && (
              <p className="text-sm text-destructive">{errors.maxMark.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Grade Cycle</label>
            <Controller
              control={control}
              name="gradeCycle"
              render={({ field }) => (
                <Select {...field}>
                  <option value="KG">KG</option>
                  <option value="LOWER_PRIMARY">Lower Primary</option>
                  <option value="UPPER_PRIMARY">Upper Primary</option>
                  <option value="SECONDARY">Secondary</option>
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
            {isPending ? "Saving..." : isEditing ? "Update Slot" : "Add Slot"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function SlotForm({ open, onOpenChange, slotId, onSubmit, isPending }: SlotFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <SlotFormContent
          key={slotId ?? "__new__"}
          slotId={slotId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
