import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon, LoaderCircleIcon } from "lucide-react";
import {
  WideDialog,
  WideDialogHeader,
  WideDialogTitle,
  WideDialogFooter,
  WideDialogClose,
} from "@/components/custom/wide-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFetchBranchDetail } from "../api/schools.api";
import { branchSchema } from "../schemas/school.schema";
import type { BranchFormValues } from "../schemas/school.schema";
import type { DetailEntry } from "../types/school.types";
import { entriesToRecord, recordToEntries } from "../helpers";

interface BranchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantId: string;
  branchId?: string | null;
  onSubmit: (
    values: Omit<BranchFormValues, "details"> & {
      details: Record<string, string | number | boolean>;
    },
  ) => void;
  isPending: boolean;
}

function BranchFormContent({
  tenantId,
  branchId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<BranchFormProps, "open">) {
  const isEditing = !!branchId;
  const { data: branchData, isLoading: branchLoading } = useFetchBranchDetail(
    tenantId,
    branchId ?? "",
  );
  const branch = branchData?.data;

  const [details, setDetails] = useState<DetailEntry[]>([]);

  const defaultValues = useMemo<BranchFormValues>(
    () => ({
      name: branch?.name ?? "",
      description: branch?.description ?? "",
      branchCode: branch?.branchCode ?? "",
      branchPrefix: branch?.branchPrefix ?? "",
      details: [],
    }),
    [branch],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    values: defaultValues,
  });

  const [lastBranchId, setLastBranchId] = useState(branch?.id);
  if (branch && branch.id !== lastBranchId) {
    setLastBranchId(branch.id);
    setDetails(recordToEntries(branch.details));
  }

  const handleFormSubmit = (values: BranchFormValues) => {
    onSubmit({ ...values, details: entriesToRecord(details) });
  };

  const addDetail = () => setDetails([...details, { key: "", value: "" }]);
  const removeDetail = (index: number) =>
    setDetails(details.filter((_, i) => i !== index));
  const updateDetail = (index: number, field: "key" | "value", val: string) => {
    const next = [...details];
    next[index] = { ...next[index], [field]: val };
    setDetails(next);
  };

  if (branchLoading) {
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
          {isEditing ? "Edit Branch" : "Add Branch"}
        </WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Branch Name
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="e.g. Bole Campus"
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
              Branch Code
            </label>
            <Controller
              control={control}
              name="branchCode"
              render={({ field }) => (
                <Input
                  placeholder="e.g. BL-001"
                  aria-invalid={!!errors.branchCode}
                  {...field}
                />
              )}
            />
            {errors.branchCode && (
              <p className="text-sm text-destructive">
                {errors.branchCode.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Branch Prefix
            </label>
            <Controller
              control={control}
              name="branchPrefix"
              render={({ field }) => (
                <Input
                  placeholder="e.g. BL"
                  aria-invalid={!!errors.branchPrefix}
                  {...field}
                />
              )}
            />
            {errors.branchPrefix && (
              <p className="text-sm text-destructive">
                {errors.branchPrefix.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Description
          </label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea
                placeholder="Brief branch description"
                aria-invalid={!!errors.description}
                {...field}
              />
            )}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Details
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDetail}
            >
              <PlusIcon />
              Add Detail
            </Button>
          </div>
          {details.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No additional details.
            </p>
          )}
          {details.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                placeholder="Key"
                value={entry.key}
                onChange={(e) => updateDetail(i, "key", e.target.value)}
              />
              <Input
                placeholder="Value"
                value={String(entry.value)}
                onChange={(e) => updateDetail(i, "value", e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => removeDetail(i)}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          ))}
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
                ? "Update Branch"
                : "Add Branch"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function BranchForm({
  open,
  onOpenChange,
  tenantId,
  branchId,
  onSubmit,
  isPending,
}: BranchFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <BranchFormContent
          key={branchId ?? "__new__"}
          tenantId={tenantId}
          branchId={branchId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
