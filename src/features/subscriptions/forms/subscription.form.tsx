import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, TrashIcon, PlusIcon } from "lucide-react";
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchSubscriptionDetail } from "../api/subscriptions.api";
import { createSubscriptionSchema } from "../schemas/subscription.schema";
import type { CreateSubscriptionFormValues } from "../schemas/subscription.schema";

interface SubscriptionFormProps {
  subscriptionId?: string | null;
  onSubmit: (values: CreateSubscriptionFormValues) => void;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
}

type FeatureEntry = { key: string; value: string };

function featuresToEntries(
  features: Record<string, string | number | boolean> | undefined,
): FeatureEntry[] {
  if (!features || Object.keys(features).length === 0) {
    return [{ key: "", value: "" }];
  }
  return Object.entries(features).map(([k, v]) => ({
    key: k,
    value: String(v),
  }));
}

function entriesToFeatures(entries: FeatureEntry[]): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};
  for (const entry of entries) {
    if (!entry.key.trim()) continue;
    const trimmed = entry.value.trim();
    if (trimmed === "true") {
      result[entry.key] = true;
    } else if (trimmed === "false") {
      result[entry.key] = false;
    } else if (trimmed !== "" && !isNaN(Number(trimmed))) {
      result[entry.key] = Number(trimmed);
    } else {
      result[entry.key] = entry.value;
    }
  }
  return result;
}

export function SubscriptionFormInner({
  subscriptionId,
  onSubmit,
  isPending,
  onOpenChange,
}: SubscriptionFormProps) {
  const isEditing = !!subscriptionId;
  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useFetchSubscriptionDetail(subscriptionId ?? "");
  const subscription = subscriptionData?.data;

  const [features, setFeatures] = useState<FeatureEntry[]>(() =>
    featuresToEntries(subscription?.features),
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubscriptionFormValues>({
    resolver: zodResolver(createSubscriptionSchema) as Resolver<CreateSubscriptionFormValues>,
    defaultValues: {
      name: subscription?.name ?? "",
      months: subscription?.months ?? 1,
      price: Number(subscription?.price) || 0,
      active: subscription?.active ?? true,
    },
  });

  const addFeature = () => {
    setFeatures((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFeature = (
    index: number,
    field: "key" | "value",
    newValue: string,
  ) => {
    setFeatures((prev) =>
      prev.map((entry, i) =>
        i === index ? { ...entry, [field]: newValue } : entry,
      ),
    );
  };

  const handleFormSubmit = (values: CreateSubscriptionFormValues) => {
    onSubmit({ ...values, features: entriesToFeatures(features) });
  };

  if (subscriptionLoading) {
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
        <DialogTitle>
          {isEditing ? "Edit Subscription" : "Create Subscription"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Plan Name
          </label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                placeholder="e.g. Basic Plan"
                aria-invalid={!!errors.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            )}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Duration (months)
            </label>
            <Controller
              control={control}
              name="months"
              render={({ field }) => (
                <Input
                  type="number"
                  min={1}
                  aria-invalid={!!errors.months}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value) || 1)
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
            {errors.months && (
              <p className="text-sm text-destructive">
                {errors.months.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Price
            </label>
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  aria-invalid={!!errors.price}
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
            {errors.price && (
              <p className="text-sm text-destructive">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Features
          </label>
          <div className="space-y-2">
            {features.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Key"
                  value={entry.key}
                  onChange={(e) => updateFeature(index, "key", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={entry.value}
                  onChange={(e) =>
                    updateFeature(index, "value", e.target.value)
                  }
                  className="flex-1"
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeFeature(index)}
                  >
                    <TrashIcon />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeature}
          >
            <PlusIcon />
            Add Feature
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Controller
            control={control}
            name="active"
            render={({ field }) => (
              <input
                type="checkbox"
                id="active"
                checked={field.value}
                onChange={field.onChange}
                className="size-4 rounded border-border"
              />
            )}
          />
          <label
            htmlFor="active"
            className="text-sm font-medium text-foreground"
          >
            Active
          </label>
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
                ? "Update Subscription"
                : "Create Subscription"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}
