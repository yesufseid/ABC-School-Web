import { useState } from "react";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CustomTable } from "@/components/custom/custom-table";
import { ConfirmDialog } from "@/features/schools/components/confirm-dialog.component";
import { useAuthContext } from "@/lib/store";
import { useFetchBranches } from "@/features/schools/api/schools.api";
import {
  useFetchCalendarEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from "../api/schedules.api";
import { EventForm } from "../forms/event.form";
import type { EventFormValues } from "../forms/event.form";
import type { CalendarEvent, EventCategory } from "../types/schedule.types";

const CATEGORY_STYLES: Record<string, "default" | "secondary" | "success" | "warning"> = {
  Academic: "secondary",
  Examination: "warning",
  Holiday: "success",
  Meeting: "default",
  Sports: "warning",
  Training: "secondary",
  Administration: "default",
  Other: "default",
};

const CATEGORIES: EventCategory[] = [
  "Academic",
  "Examination",
  "Holiday",
  "Meeting",
  "Sports",
  "Training",
  "Administration",
  "Other",
];

export function CalendarComponent() {
  const { tenantId, branchId } = useAuthContext();

  const { data: branchesData } = useFetchBranches(tenantId ?? "");
  const branches = branchesData?.data ?? [];

  const now = new Date();
  const [startDate, setStartDate] = useState(format(startOfMonth(now), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(endOfMonth(now), "yyyy-MM-dd"));
  const [category, setCategory] = useState("");
  const [selectedBranchId, setSelectedBranchId] = useState(branchId ?? "");

  const { data: eventsData, isLoading } = useFetchCalendarEvents({
    startDate,
    endDate,
    category: category || undefined,
    branchId: selectedBranchId || undefined,
  });
  const events = eventsData?.data ?? [];

  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();

  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);

  const updateEvent = useUpdateEvent(editingEventId ?? "");

  const handleSubmit = (values: EventFormValues) => {
    if (editingEventId) {
      updateEvent.mutate(values, {
        onSuccess: () => {
          setEventFormOpen(false);
          setEditingEventId(null);
        },
      });
    } else {
      createEvent.mutate(values, {
        onSuccess: () => {
          setEventFormOpen(false);
        },
      });
    }
  };

  const columns = [
    {
      title: "Title",
      key: "title",
      component: (value: (typeof events)[number][keyof (typeof events)[number]]) => (
        <span className="font-medium text-foreground">{String(value)}</span>
      ),
    },
    {
      title: "Category",
      key: "category",
      component: (value: (typeof events)[number][keyof (typeof events)[number]]) => (
        <Badge variant={CATEGORY_STYLES[String(value)] ?? "secondary"}>
          {String(value)}
        </Badge>
      ),
    },
    {
      title: "Start Date",
      key: "startDate",
      component: (value: (typeof events)[number][keyof (typeof events)[number]]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(String(value)), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      title: "End Date",
      key: "endDate",
      component: (value: (typeof events)[number][keyof (typeof events)[number]]) => (
        <span className="text-muted-foreground">
          {value ? format(parseISO(String(value)), "MMM d, yyyy") : "-"}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      className: "w-24",
      component: (
        _value: (typeof events)[number][keyof (typeof events)[number]],
        row: (typeof events)[number],
      ) => (
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setEditingEventId(row.id);
              setEventFormOpen(true);
            }}
          >
            <PencilIcon />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 dark:text-red-400"
            onClick={() => {
              setDeletingEvent(row);
              setDeleteOpen(true);
            }}
          >
            <TrashIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingEventId(null);
                setEventFormOpen(true);
              }}
            >
              <PlusIcon />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">From</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </div>
            {branches.length > 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Branch</label>
                <Select
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                >
                  <option value="">All</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Loading events...
            </p>
          ) : (
            <CustomTable
              data={events}
              columns={columns}
              emptyMessage="No events in the selected range."
            />
          )}
        </CardContent>
      </Card>

      <EventForm
        open={eventFormOpen}
        onOpenChange={setEventFormOpen}
        eventId={editingEventId}
        onSubmit={handleSubmit}
        isPending={createEvent.isPending || updateEvent.isPending}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Event"
        description={`Are you sure you want to delete "${deletingEvent?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deletingEvent) {
            deleteEvent.mutate(deletingEvent.id, {
              onSuccess: () => {
                setDeleteOpen(false);
                setDeletingEvent(null);
              },
            });
          }
        }}
        isPending={deleteEvent.isPending}
      />
    </div>
  );
}
