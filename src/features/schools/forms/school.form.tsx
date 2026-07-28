import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PlusIcon,
  TrashIcon,
  LoaderCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
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
import { useFetchSchoolDetail } from "../api/schools.api";
import {
  schoolSchema,
  createSchoolSchema,
} from "../schemas/school.schema";
import type {
  SchoolFormValues,
  CreateSchoolFormValues,
} from "../schemas/school.schema";
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
      initialBranch?: {
        name: string;
        description: string;
        branchCode: string;
        branchPrefix: string;
        details: Record<string, string | number | boolean>;
      };
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
  const [branchOpen, setBranchOpen] = useState(false);
  const [branchDetails, setBranchDetails] = useState<DetailEntry[]>([]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateSchoolFormValues>({
    resolver: zodResolver(isEditing ? schoolSchema : createSchoolSchema),
    defaultValues: {
      ownerPhone: school?.owner.phoneNumber ?? "",
      ownerName: school?.owner.name ?? "",
      password: "",
      name: school?.name ?? "",
      description: school?.description ?? "",
      details: [],
      ...(isEditing
        ? {}
        : {
            initialBranch: {
              name: "",
              description: "",
              branchCode: "",
              branchPrefix: "",
              details: [],
            },
          }),
    },
  });

  const handleFormSubmit = (values: CreateSchoolFormValues) => {
    const password = values.password ?? "";
    if (!isEditing && password.length < 6) {
      setError("password", {
        message: "Password must be at least 6 characters",
      });
      return;
    }

    const detailsRecord = entriesToRecord(details);

    if (isEditing) {
      const { initialBranch: _branch, ...rest } = values;
      void _branch;
      onSubmit({
        ...rest,
        password: values.password,
        details: detailsRecord,
      });
    } else {
      const { initialBranch, ...schoolValues } = values;
      const hasBranch =
        initialBranch &&
        (initialBranch.name ||
          initialBranch.description ||
          initialBranch.branchCode ||
          initialBranch.branchPrefix);

      const payload: Parameters<typeof onSubmit>[0] = {
        ...schoolValues,
        details: detailsRecord,
      };

      if (hasBranch) {
        payload.initialBranch = {
          name: String(initialBranch.name),
          description: String(initialBranch.description),
          branchCode: String(initialBranch.branchCode),
          branchPrefix: String(initialBranch.branchPrefix),
          details: entriesToRecord(branchDetails),
        };
      }

      onSubmit(payload);
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

  const addBranchDetail = () =>
    setBranchDetails([...branchDetails, { key: "", value: "" }]);
  const removeBranchDetail = (index: number) =>
    setBranchDetails(branchDetails.filter((_, i) => i !== index));
  const updateBranchDetail = (
    index: number,
    field: "key" | "value",
    val: string,
  ) => {
    const next = [...branchDetails];
    next[index] = { ...next[index], [field]: val };
    setBranchDetails(next);
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
      <WideDialogClose onClick={() => onOpenChange(false)} />
      <WideDialogHeader>
        <WideDialogTitle>{isEditing ? "Edit School" : "Create School"}</WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
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

        {!isEditing && (
          <div className="space-y-3 rounded-xl border border-border/50 p-4">
            <button
              type="button"
              className="flex w-full items-center justify-between text-sm font-medium text-foreground"
              onClick={() => setBranchOpen(!branchOpen)}
            >
              <span className="flex items-center gap-2">
                Initial Branch
                <span className="text-xs text-muted-foreground font-normal">
                  (optional)
                </span>
              </span>
              {branchOpen ? (
                <ChevronUpIcon className="size-4" />
              ) : (
                <ChevronDownIcon className="size-4" />
              )}
            </button>

            {branchOpen && (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-muted-foreground">
                  Add an initial branch when creating the school. You can add
                  more branches later from the school detail page.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Branch Name
                    </label>
                    <Controller
                      control={control}
                      name="initialBranch.name"
                      render={({ field }) => (
                        <Input placeholder="e.g. Bole Campus" {...field} />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Branch Code
                    </label>
                    <Controller
                      control={control}
                      name="initialBranch.branchCode"
                      render={({ field }) => (
                        <Input placeholder="e.g. BL-001" {...field} />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Branch Prefix
                    </label>
                    <Controller
                      control={control}
                      name="initialBranch.branchPrefix"
                      render={({ field }) => (
                        <Input placeholder="e.g. BL" {...field} />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Branch Description
                  </label>
                  <Controller
                    control={control}
                    name="initialBranch.description"
                    render={({ field }) => (
                      <Textarea
                        placeholder="Brief branch description"
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Branch Details
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBranchDetail}
                    >
                      <PlusIcon />
                      Add Detail
                    </Button>
                  </div>
                  {branchDetails.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No additional details.
                    </p>
                  )}
                  {branchDetails.map((entry, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        placeholder="Key"
                        value={entry.key}
                        onChange={(e) =>
                          updateBranchDetail(i, "key", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Value"
                        value={String(entry.value)}
                        onChange={(e) =>
                          updateBranchDetail(i, "value", e.target.value)
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-destructive hover:text-destructive"
                        onClick={() => removeBranchDetail(i)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                ? "Update School"
                : "Create School"}
          </Button>
        </WideDialogFooter>
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
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <SchoolFormContent
          key={schoolId ?? "__new__"}
          schoolId={schoolId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
