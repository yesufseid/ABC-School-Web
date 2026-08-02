import { LoaderCircleIcon, CalendarDaysIcon } from "lucide-react";
import { PageHeader } from "@/components/custom/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { useFetchMyTimetable } from "../api/teachers.api";

export function MyTimetablePage() {
  const { data, isLoading, isError } = useFetchMyTimetable();
  const days = data?.data ?? [];

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
        <p className="text-sm text-destructive">Failed to load your timetable.</p>
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Timetable" description="Your weekly teaching schedule." />
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <CalendarDaysIcon className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No timetable has been generated for your sections yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Timetable" description="Your weekly teaching schedule." />

      <div className="grid gap-4 lg:grid-cols-5">
        {days.map((day) => (
          <Card key={day.dayOfWeek}>
            <CardContent className="pt-6">
              <p className="mb-3 font-semibold text-foreground">{day.dayOfWeek}</p>
              <div className="space-y-2">
                {day.periods.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No classes</p>
                ) : (
                  day.periods.map((period) => (
                    <div
                      key={`${day.dayOfWeek}-${period.periodNumber}`}
                      className="rounded-lg border p-2"
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        Period {period.periodNumber} · {period.startTime}–
                        {period.endTime}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {period.subjectName ?? "Subject"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Section {period.sectionName} · Grade {period.grade}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}