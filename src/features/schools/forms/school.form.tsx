import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon, LoaderCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFetchSchoolDetail } from "../api/schools.api";
import { schoolSchema } from "../schemas/school.schema";
import type { SchoolFormValues } from "../schemas/school.schema";
import type { DetailEntry } from "../types/school.types";
import { entriesToRecord, recordToEntries } from "../helpers";

interface SchoolFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId?: string | null;
  onSubmit: (
    values: Omit<SchoolFormValues, "details"> & {
      details: Record<string, string | number | boolean>;
      password?: string;
    },
  ) => void;
  isPending: boolean;
}

function SchoolFormContent({
  schoolId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<SchoolFormProps, "open">) {
  const isEditing = !!schoolId;
  const { data: schoolData, isLoading: schoolLoading } = useFetchSchoolDetail(
    schoolId ?? "",
  );
  const school = schoolData?.data;

  const [details, setDetails] = useState<DetailEntry[]>(() =>
    recordToEntries(school?.details),
  );

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      ownerPhone: school?.owner.phoneNumber ?? "",
      ownerName: school?.owner.name ?? "",
      password: "",
      name: school?.name ?? "",
      description: school?.description ?? "",
      branchCode: school?.branchCode ?? "",
      branchPrefix: school?.branchPrefix ?? "",
      details: [],
    },
  });

  const handleFormSubmit = (values: SchoolFormValues) => {
    if (!isEditing && (!values.password || values.password.length < 6)) {
      setError("password", {
        message: "Password must be at least 6 characters",
      });
      return;
    }
    const withDetails = { ...values, details: entriesToRecord(details) };
    if (isEditing) {
      const { password: _password, ...rest } = withDetails;
      void _password;
      onSubmit(rest);
    } else {
      onSubmit(withDetails);
    }
  };

  const addDetail = () => setDetails([...details, { key: "", value: "" }]);
  const removeDetail = (index: number) =>
    setDetails(details.filter((_, i) => i !== index));
  const updateDetail = (index: number, field: "key" | "value", val: string) => {
    const next = [...details];
    next[index] = { ...next[index], [field]: val };
    setDetails(next);
  };

  if (schoolLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit School" : "Create School"}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              School Name
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  placeholder="e.g. Axis International School"
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
              Owner Name
            </label>
            <Controller
              control={control}
              name="ownerName"
              render={({ field }) => (
                <Input
                  placeholder="e.g. Girma Beyene"
                  aria-invalid={!!errors.ownerName}
                  {...field}
                />
              )}
            />
            {errors.ownerName && (
              <p className="text-sm text-destructive">
                {errors.ownerName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Owner Phone
            </label>
            <Controller
              control={control}
              name="ownerPhone"
              render={({ field }) => (
                <Input
                  type="tel"
                  placeholder="e.g. 0912345678"
                  autoComplete="off"
                  aria-invalid={!!errors.ownerPhone}
                  {...field}
                />
              )}
            />
            {errors.ownerPhone && (
              <p className="text-sm text-destructive">
                {errors.ownerPhone.message}
              </p>
            )}
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    type="password"
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    {...field}
                  />
                )}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
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
                placeholder="A brief description of the school"
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Branch Code
            </label>
            <Controller
              control={control}
              name="branchCode"
              render={({ field }) => (
                <Input
                  placeholder="e.g. CRZ"
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
                  placeholder="e.g. CRZ"
                  disabled={isEditing}
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

        <DialogFooter>
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
                ? "Update School"
                : "Create School"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export function SchoolForm({
  open,
  onOpenChange,
  schoolId,
  onSubmit,
  isPending,
}: SchoolFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        {open && (
          <SchoolFormContent
            key={schoolId ?? "__new__"}
            schoolId={schoolId}
            onSubmit={onSubmit}
            isPending={isPending}
            onOpenChange={onOpenChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
