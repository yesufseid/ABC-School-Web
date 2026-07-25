import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { SubscriptionFormInner } from "../forms/subscription.form";
import type { CreateSubscriptionFormValues } from "../schemas/subscription.schema";

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId?: string | null;
  onSubmit: (values: CreateSubscriptionFormValues) => void;
  isPending: boolean;
}

export function SubscriptionForm({
  open,
  onOpenChange,
  subscriptionId,
  onSubmit,
  isPending,
}: SubscriptionFormProps) {
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setFormKey((k) => k + 1);
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <SubscriptionFormInner
          key={formKey}
          subscriptionId={subscriptionId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
