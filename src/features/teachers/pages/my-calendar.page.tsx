import { LoaderCircleIcon, CalendarDaysIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { PageHeader } from "@/components/custom/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFetchUpcomingEvents } from "@/features/schedules/api/schedules.api";

export function MyCalendarPage() {
  const { data, isLoading, isError } = useFetchUpcomingEvents();
  const events = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <LoaderCircleIcon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <p className="text-sm text-destructive">Failed to load the calendar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="School Calendar"
        description="Upcoming school events."
      />

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <CalendarDaysIcon className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            There are no upcoming events.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-foreground">{event.title}</p>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {format(parseISO(event.startDate), "PPP")}
                  {event.endDate !== event.startDate &&
                    ` – ${format(parseISO(event.endDate), "PPP")}`}
                </p>
                {event.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}