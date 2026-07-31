import { useForm, useWatch, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { useFetchSections } from "../api/registration.api";
import { reAdmitSchema } from "../schemas/re-admit.schema";
import type { ReAdmitFormValues } from "../schemas/re-admit.schema";

interface ReAdmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  onSubmit: (values: ReAdmitFormValues) => void;
  isPending: boolean;
}

export function ReAdmitDialog({
  open,
  onOpenChange,
  studentName,
  onSubmit,
  isPending,
}: ReAdmitDialogProps) {
  const { tenantId, year } = useAuthContext();
  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReAdmitFormValues>({
    resolver: zodResolver(reAdmitSchema) as Resolver<ReAdmitFormValues>,
    defaultValues: {
      scenario: "GRADE_PROMOTION",
      startingGrade: 1,
    },
  });

  const scenario = useWatch({ control, name: "scenario" });
  const branchId = useWatch({ control, name: "branchId" });

  const { data: sectionsData } = useFetchSections(
    branchId ? { branchId, year } : undefined,
  );
  const sections = sectionsData?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Re-admit Student</DialogTitle>
          <DialogDescription>
            Re-admit {studentName} under a new scenario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Scenario
            </label>
            <Controller
              control={control}
              name="scenario"
              render={({ field }) => (
                <Select {...field}>
                  <option value="GRADE_PROMOTION">Grade Promotion</option>
                  <option value="RE_ENROLLMENT">Re-enrollment</option>
                  <option value="BRANCH_TRANSFER">Branch Transfer</option>
                </Select>
              )}
            />
          </div>

          {scenario === "GRADE_PROMOTION" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Starting Grade
              </label>
              <Controller
                control={control}
                name="startingGrade"
                render={({ field }) => (
                  <Select
                    aria-invalid={!!errors.startingGrade}
                    {...field}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </Select>
                )}
              />
              {errors.startingGrade && (
                <p className="text-sm text-destructive">
                  {errors.startingGrade.message}
                </p>
              )}
            </div>
          )}

          {scenario === "BRANCH_TRANSFER" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Branch
                </label>
                <Controller
                  control={control}
                  name="branchId"
                  render={({ field }) => (
                    <Select {...field}>
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
              </div>

              {branchId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Section
                  </label>
                  <Controller
                    control={control}
                    name="sectionId"
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="" disabled>
                          Select section
                        </option>
                        {sections.map((section) => (
                          <option key={section.id} value={section.id}>
                            Grade {section.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Address (optional)
            </label>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Input placeholder="e.g. New Address" {...field} />
              )}
            />
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
              {isPending ? "Re-admitting..." : "Re-admit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
