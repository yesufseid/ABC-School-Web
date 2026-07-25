import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, differenceInDays, parseISO } from "date-fns";
import { LoaderCircleIcon } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFetchSubscriptions } from "@/features/subscriptions/api/subscriptions.api";
import { useFetchSchoolDetail } from "../api/schools.api";
import { subscribeSchoolSchema } from "../schemas/school.schema";
import type { SubscribeSchoolFormValues } from "../schemas/school.schema";

interface SubscribeSchoolFormProps {
  schoolId: string;
  onSubmit: (values: SubscribeSchoolFormValues) => void;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
}

type Warning = {
  type: "active" | "mismatch";
  message: string;
};

function findCurrentSubscription(
  subs: { endDate: string; subscription: { name: string } }[],
): { endDate: string; name: string; daysLeft: number } | null {
  const now = new Date();
  for (const ts of subs) {
    if (parseISO(ts.endDate) > now) {
      return {
        endDate: ts.endDate,
        name: ts.subscription.name,
        daysLeft: differenceInDays(parseISO(ts.endDate), now),
      };
    }
  }
  return null;
}

export function SubscribeSchoolForm({
  schoolId,
  onSubmit,
  isPending,
  onOpenChange,
}: SubscribeSchoolFormProps) {
  const { data: schoolData, isLoading: schoolLoading } =
    useFetchSchoolDetail(schoolId);
  const { data: subscriptionsData } = useFetchSubscriptions();

  const school = schoolData?.data;
  const subscriptions = useMemo(
    () => subscriptionsData?.data ?? [],
    [subscriptionsData],
  );

  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [pendingValues, setPendingValues] =
    useState<SubscribeSchoolFormValues | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SubscribeSchoolFormValues>({
    resolver: zodResolver(subscribeSchoolSchema),
    defaultValues: {
      subscriptionId: "",
      startDate: new Date().toISOString().split("T")[0],
      paidAmount: 0,
    },
  });

  const selectedSubscriptionId = watch("subscriptionId");
  const paidAmount = watch("paidAmount");
  const startDate = watch("startDate");

  const selectedSubscription = useMemo(
    () => subscriptions.find((s) => s.id === selectedSubscriptionId),
    [subscriptions, selectedSubscriptionId],
  );

  const collectWarnings = (values: SubscribeSchoolFormValues): Warning[] => {
    const result: Warning[] = [];
    if (!school) return result;

    const currentSub = findCurrentSubscription(school.tenantSubscriptions);
    if (currentSub && currentSub.daysLeft > 7) {
      result.push({
        type: "active",
        message: `This school has an active subscription ("${currentSub.name}") that expires in ${currentSub.daysLeft} days (${currentSub.endDate.split("T")[0]}). Are you sure you want to add a new subscription?`,
      });
    }

    const sub = subscriptions.find((s) => s.id === values.subscriptionId);
    if (sub && sub.price !== values.paidAmount) {
      result.push({
        type: "mismatch",
        message: `The subscription plan "${sub.name}" costs ${sub.price.toLocaleString()} but the paid amount is ${values.paidAmount.toLocaleString()}. The amounts don't match.`,
      });
    }

    return result;
  };

  const handleFormSubmit = (values: SubscribeSchoolFormValues) => {
    const found = collectWarnings(values);
    if (found.length > 0) {
      setWarnings(found);
      setPendingValues(values);
    } else {
      onSubmit(values);
    }
  };

  const handleConfirmWarning = () => {
    if (pendingValues) {
      onSubmit(pendingValues);
    }
  };

  const currentSubscription = school
    ? findCurrentSubscription(school.tenantSubscriptions)
    : null;

  if (schoolLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (warnings.length > 0) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Subscribe School</DialogTitle>
          <DialogDescription>
            Assign a subscription plan to &quot;{school?.name}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {warnings.map((w, i) => (
            <div
              key={i}
              className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/50"
            >
              <div className="flex items-start gap-3">
                <Badge variant="warning" className="mt-0.5 shrink-0">
                  {w.type === "active" ? "Warning" : "Mismatch"}
                </Badge>
                <p className="text-sm text-foreground">{w.message}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setWarnings([]);
                setPendingValues(null);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmWarning}>
              Confirm &amp; Save
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DialogClose onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <DialogTitle>Subscribe School</DialogTitle>
        <DialogDescription>
          Assign a subscription plan to &quot;{school?.name}&quot;
        </DialogDescription>
      </DialogHeader>

      {currentSubscription ? (
        <div className="rounded-xl bg-muted/50 p-3 text-sm">
          <p className="text-muted-foreground">Current subscription:</p>
          <p className="font-medium text-foreground">
            {currentSubscription.name} — Expires{" "}
            {currentSubscription.endDate.split("T")[0]} (
            {currentSubscription.daysLeft} days remaining)
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-muted/50 p-3 text-sm">
          <p className="text-muted-foreground">No active subscription.</p>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Subscription Plan
          </label>
          <Controller
            control={control}
            name="subscriptionId"
            render={({ field }) => (
              <Select aria-invalid={!!errors.subscriptionId} {...field}>
                <option value="">Select a plan</option>
                {subscriptions.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} — {sub.months}mo —{" "}
                    {sub.price.toLocaleString()}
                  </option>
                ))}
              </Select>
            )}
          />
          {errors.subscriptionId && (
            <p className="text-sm text-destructive">
              {errors.subscriptionId.message}
            </p>
          )}
        </div>

        {selectedSubscription && (
          <div className="rounded-xl bg-muted/50 p-3 text-sm">
            <p className="text-muted-foreground">Plan details:</p>
            <p className="font-medium text-foreground">
              {selectedSubscription.name} — {selectedSubscription.months}{" "}
              months — Price: {selectedSubscription.price.toLocaleString()}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Start Date
          </label>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <Input
                type="date"
                aria-invalid={!!errors.startDate}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        {selectedSubscription && startDate && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              End Date
            </label>
            <Input
              type="date"
              disabled
              value={
                startDate
                  ? addMonths(
                      parseISO(startDate),
                      selectedSubscription.months,
                    )
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Paid Amount
          </label>
          <Controller
            control={control}
            name="paidAmount"
            render={({ field }) => (
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                aria-invalid={!!errors.paidAmount}
                value={field.value}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          {errors.paidAmount && (
            <p className="text-sm text-destructive">
              {errors.paidAmount.message}
            </p>
          )}
        </div>

        {selectedSubscription &&
          paidAmount > 0 &&
          paidAmount !== selectedSubscription.price && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
              Paid amount ({paidAmount.toLocaleString()}) differs from plan
              price ({selectedSubscription.price.toLocaleString()}).
            </div>
          )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Subscribe"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
