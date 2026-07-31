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
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import { useFetchCalendarEvent } from "../api/schedules.api";
import { eventSchema, type EventFormValues } from "../schemas/event.schema";

export type EventFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string | null;
  onSubmit: (values: EventFormValues) => void;
  isPending: boolean;
};

export type { EventFormValues };

function EventFormContent({
  eventId,
  onSubmit,
  isPending,
  onOpenChange,
}: Omit<EventFormProps, "open">) {
  const isEditing = !!eventId;
  const { tenantId } = useAuthContext();

  const { data: eventData, isLoading } = useFetchCalendarEvent(eventId ?? "");
  const event = eventData?.data;

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = useMemo(() => branchesData?.data ?? [], [branchesData]);

  const defaultValues = useMemo<EventFormValues>(
    () => ({
      title: event?.title ?? "",
      category: event?.category ?? "Academic",
      description: event?.description ?? "",
      startDate: event?.startDate ?? "",
      endDate: event?.endDate ?? "",
      branchIds: event?.branchIds ?? (branches.length ? [branches[0].id] : []),
    }),
    [event, branches],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as Resolver<EventFormValues>,
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
          {isEditing ? "Edit Event" : "Add Event"}
        </WideDialogTitle>
      </WideDialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <Input
                  placeholder="e.g. Mid-term Exam"
                  aria-invalid={!!errors.title}
                  {...field}
                />
              )}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select {...field}>
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Sports">Sports</option>
                  <option value="Training">Training</option>
                  <option value="Administration">Administration</option>
                  <option value="Other">Other</option>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input placeholder="Optional" {...field} />
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Start Date</label>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <Input type="date" aria-invalid={!!errors.startDate} {...field} />
              )}
            />
            {errors.startDate && (
              <p className="text-sm text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">End Date</label>
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <Input type="date" aria-invalid={!!errors.endDate} {...field} />
              )}
            />
            {errors.endDate && (
              <p className="text-sm text-destructive">{errors.endDate.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Branches</label>
            <Controller
              control={control}
              name="branchIds"
              render={({ field }) => (
                <div className="space-y-2">
                  {branches.length === 0 && (
                    <p className="text-sm text-muted-foreground">No branches available.</p>
                  )}
                  {branches.map((branch) => {
                    const checked = field.value.includes(branch.id);
                    return (
                      <label
                        key={branch.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...field.value, branch.id]
                              : field.value.filter((id) => id !== branch.id);
                            field.onChange(next);
                          }}
                        />
                        {branch.name}
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.branchIds && (
              <p className="text-sm text-destructive">{errors.branchIds.message}</p>
            )}
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
            {isPending ? "Saving..." : isEditing ? "Update Event" : "Add Event"}
          </Button>
        </WideDialogFooter>
      </form>
    </>
  );
}

export function EventForm({ open, onOpenChange, eventId, onSubmit, isPending }: EventFormProps) {
  return (
    <WideDialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <EventFormContent
          key={eventId ?? "__new__"}
          eventId={eventId}
          onSubmit={onSubmit}
          isPending={isPending}
          onOpenChange={onOpenChange}
        />
      )}
    </WideDialog>
  );
}
