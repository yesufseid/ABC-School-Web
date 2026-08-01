import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PhoneInput } from "@/components/custom/phone-input";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { useFetchPrincipal } from "../../api/principals.api";
import { principalSchema } from "./schema";
import type { PrincipalFormValues } from "./schema";
import type { PrincipalFormProps } from "./types";

function PrincipalFormContent({
  principalId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<PrincipalFormProps, "open">) {
  const isEditing = !!principalId;
  const { tenantId, branchId: authBranchId } = useAuthContext();

  const { data: principalData, isLoading } = useFetchPrincipal(
    principalId ?? "",
  );
  const principal = principalData?.data;

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const defaultValues = useMemo<PrincipalFormValues>(
    () => ({
      branchId: principal?.branchId ?? authBranchId ?? "",
      firstName: principal?.firstName ?? "",
      middleName: principal?.middleName ?? "",
      lastName: principal?.lastName ?? "",
      phone: principal?.phone ?? "",
      email: principal?.email ?? "",
      address: principal?.address ?? "",
      sex: principal?.sex ?? "Male",
      startingDate: principal?.startingDate
        ? format(parseISO(principal.startingDate), "yyyy-MM-dd")
        : "",
      isVicePrincipal: principal?.isVicePrincipal ?? false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [principal],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PrincipalFormValues>({
    resolver: zodResolver(principalSchema) as Resolver<PrincipalFormValues>,
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
          {isEditing ? "Edit Principal" : "Add Principal"}
        </WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              First Name
            </label>
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <Input
                  placeholder="e.g. Abebe"
                  aria-invalid={!!errors.firstName}
                  {...field}
                />
              )}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Middle Name
            </label>
            <Controller
              control={control}
              name="middleName"
              render={({ field }) => (
                <Input placeholder="e.g. Kebede" {...field} />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Last Name
            </label>
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <Input
                  placeholder="e.g. Lemma"
                  aria-invalid={!!errors.lastName}
                  {...field}
                />
              )}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Phone</label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <PhoneInput
                  placeholder="e.g. +251911223344"
                  aria-invalid={!!errors.phone}
                  {...field}
                />
              )}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="e.g. abebe@school.com"
                  {...field}
                />
              )}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sex</label>
            <Controller
              control={control}
              name="sex"
              render={({ field }) => (
                <Select {...field}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Address
            </label>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Input
                  placeholder="e.g. Bole Subcity, Addis Ababa"
                  aria-invalid={!!errors.address}
                  {...field}
                />
              )}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Starting Date
            </label>
            <Controller
              control={control}
              name="startingDate"
              render={({ field }) => (
                <Input
                  type="date"
                  aria-invalid={!!errors.startingDate}
                  {...field}
                />
              )}
            />
            {errors.startingDate && (
              <p className="text-sm text-destructive">
                {errors.startingDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Role
            </label>
            <Controller
              control={control}
              name="isVicePrincipal"
              render={({ field }) => (
                <Select
                  value={field.value ? "true" : "false"}
                  onChange={(e) => field.onChange(e.target.value === "true")}
                >
                  <option value="false">Principal</option>
                  <option value="true">Vice Principal</option>
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
            {isPending
              ? "Saving..."
              : isEditing
                ? "Update Principal"
                : "Add Principal"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function PrincipalForm({
  open,
  onOpenChange,
  principalId,
  onSubmit,
  isPending,
}: PrincipalFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <PrincipalFormContent
          key={principalId ?? "__new__"}
          principalId={principalId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
