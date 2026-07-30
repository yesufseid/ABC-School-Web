import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type { CalendarEvent, TimetableEntry, TeacherLoad } from "../types/schedule.types";

export const calendarKeys = {
  all: ["calendar"] as const,
  lists: () => [...calendarKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...calendarKeys.lists(), params] as const,
  details: () => [...calendarKeys.all, "detail"] as const,
  detail: (id: string) => [...calendarKeys.details(), id] as const,
};

export const timetableKeys = {
  all: ["timetable"] as const,
  lists: () => [...timetableKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...timetableKeys.lists(), params] as const,
  details: () => [...timetableKeys.all, "detail"] as const,
  detail: (id: string) => [...timetableKeys.details(), id] as const,
};

export function useFetchCalendarEvents() {
  return useFetchQuery<{ data: CalendarEvent[] }>(
    API.SCHEDULE_CALENDAR,
    calendarKeys.lists(),
  );
}

export function useFetchCalendarEvent(id: string) {
  return useFetchQuery<{ data: CalendarEvent }>(
    API.SCHEDULE_CALENDAR_EVENT(id),
    calendarKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateCalendarEvent() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateEventDto"]
  >(API.SCHEDULE_CALENDAR, "post", {
    successMessage: "Event created successfully!",
    invalidateQueries: [{ key: calendarKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateCalendarEvent(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateEventDto"]
  >(API.SCHEDULE_CALENDAR_EVENT(id), "patch", {
    successMessage: "Event updated successfully!",
    invalidateQueries: [
      { key: calendarKeys.lists() },
      { key: calendarKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteCalendarEvent() {
  return useApiMutation<{ message: string }, string>(
    API.SCHEDULE_CALENDAR,
    "delete",
    {
      successMessage: "Event deleted successfully!",
      invalidateQueries: [{ key: calendarKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useFetchUpcomingEvents() {
  return useFetchQuery<{ data: CalendarEvent[] }>(
    API.SCHEDULE_CALENDAR_UPCOMING,
    [...calendarKeys.all, "upcoming"],
  );
}

export function useFetchEventsByCategory() {
  return useFetchQuery<Record<string, CalendarEvent[]>>(
    API.SCHEDULE_CALENDAR_BY_CATEGORY,
    [...calendarKeys.all, "by-category"],
  );
}

export function useFetchTimetable() {
  return useFetchQuery<{ data: TimetableEntry[] }>(
    API.SCHEDULE_TIMETABLE,
    timetableKeys.lists(),
  );
}

export function useFetchTimetableEntry(id: string) {
  return useFetchQuery<{ data: TimetableEntry }>(
    API.SCHEDULE_TIMETABLE_ENTRY(id),
    timetableKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useGenerateTimetable() {
  return useApiMutation<
    { message: string },
    components["schemas"]["GenerateTimetableDto"]
  >(API.SCHEDULE_TIMETABLE_GENERATE, "post", {
    successMessage: "Timetable generated successfully!",
    invalidateQueries: [{ key: timetableKeys.lists() }],
    mutationOptions: {},
  });
}

export function useDeleteTimetableEntry() {
  return useApiMutation<{ message: string }, string>(
    API.SCHEDULE_TIMETABLE,
    "delete",
    {
      successMessage: "Timetable entry deleted successfully!",
      invalidateQueries: [{ key: timetableKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useActivateTimetable(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.SCHEDULE_TIMETABLE_ACTIVATE(id),
    "post",
    {
      successMessage: "Timetable activated successfully!",
      invalidateQueries: [{ key: timetableKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useFetchTeacherLoad() {
  return useFetchQuery<{ data: TeacherLoad[] }>(
    API.SCHEDULE_TIMETABLE_TEACHER_LOAD,
    [...timetableKeys.all, "teacher-load"],
  );
}
