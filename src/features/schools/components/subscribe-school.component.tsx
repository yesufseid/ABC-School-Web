import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SubscribeSchoolForm } from "../forms/subscribe-school.form";
import type { SubscribeSchoolFormValues } from "../schemas/school.schema";

interface SubscribeSchoolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schoolId: string | null;
  onSubmit: (values: SubscribeSchoolFormValues) => void;
  isPending: boolean;
}

export function SubscribeSchool({
  open,
  onOpenChange,
  schoolId,
  onSubmit,
  isPending,
}: SubscribeSchoolProps) {
  const [formKey, setFormKey] = useState(0);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setFormKey((k) => k + 1);
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {schoolId && (
          <SubscribeSchoolForm
            key={formKey}
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
