import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type {
  CalendarEvent,
  Timetable,
  TimetableEntry,
  TeacherLoad,
} from "../types/schedule.types";

export const scheduleKeys = {
  all: ["schedules"] as const,
  events: () => [...scheduleKeys.all, "events"] as const,
  event: (id: string) => [...scheduleKeys.events(), id] as const,
  upcoming: () => [...scheduleKeys.all, "events", "upcoming"] as const,
  byCategory: (category: string) =>
    [...scheduleKeys.events(), "category", category] as const,
  timetables: () => [...scheduleKeys.all, "timetables"] as const,
  timetable: (sectionId: string, year: string) =>
    [...scheduleKeys.timetables(), sectionId, year] as const,
  timetableEntry: (id: string) => [...scheduleKeys.timetables(), id] as const,
  teacherLoad: (sectionId: string, year: string) =>
    [...scheduleKeys.all, "teacher-load", sectionId, year] as const,
};

export function useFetchCalendarEvents(params: {
  startDate?: string;
  endDate?: string;
  category?: string;
  branchId?: string;
}) {
  const enabled = !!params.startDate && !!params.endDate;
  return useFetchQuery<{ data: CalendarEvent[] }>(
    API.SCHEDULE_CALENDAR,
    scheduleKeys.events(),
    params,
    { enabled },
  );
}

export function useFetchCalendarEvent(id: string) {
  return useFetchQuery<{ data: CalendarEvent }>(
    API.SCHEDULE_CALENDAR_EVENT(id),
    scheduleKeys.event(id),
    undefined,
    { enabled: !!id },
  );
}

export function useFetchUpcomingEvents() {
  return useFetchQuery<{ data: CalendarEvent[] }>(
    API.SCHEDULE_CALENDAR_UPCOMING,
    scheduleKeys.upcoming(),
  );
}

export function useCreateEvent() {
  return useApiMutation<{ message: string }, components["schemas"]["CreateEventDto"]>(
    API.SCHEDULE_CALENDAR,
    "post",
    {
      successMessage: "Event created!",
      invalidateQueries: [
        { key: scheduleKeys.events() },
        { key: scheduleKeys.upcoming() },
      ],
      mutationOptions: {},
    },
  );
}

export function useUpdateEvent(id: string) {
  return useApiMutation<{ message: string }, components["schemas"]["UpdateEventDto"]>(
    API.SCHEDULE_CALENDAR_EVENT(id),
    "patch",
    {
      successMessage: "Event updated!",
      invalidateQueries: [
        { key: scheduleKeys.events() },
        { key: scheduleKeys.upcoming() },
        { key: scheduleKeys.event(id) },
      ],
      mutationOptions: {},
    },
  );
}

export function useDeleteEvent() {
  return useApiMutation<{ message: string }, string>(
    API.SCHEDULE_CALENDAR_EVENT(""),
    "delete",
    {
      successMessage: "Event deleted!",
      invalidateQueries: [
        { key: scheduleKeys.events() },
        { key: scheduleKeys.upcoming() },
      ],
      mutationOptions: {},
    },
  );
}

export function useFetchTimetable(sectionId: string, year: string) {
  return useFetchQuery<{ data: Timetable }>(
    API.SCHEDULE_TIMETABLE,
    scheduleKeys.timetable(sectionId, year),
    sectionId && year ? { sectionId, year } : undefined,
    { enabled: !!sectionId && !!year },
  );
}

export function useGenerateTimetable() {
  return useApiMutation<
    { message: string },
    components["schemas"]["GenerateTimetableDto"]
  >(API.SCHEDULE_TIMETABLE_GENERATE, "post", {
    successMessage: "Timetable generated!",
    invalidateQueries: [{ key: scheduleKeys.timetables() }],
    mutationOptions: {},
  });
}

export function useActivateTimetable(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.SCHEDULE_TIMETABLE_ACTIVATE(id),
    "post",
    {
      successMessage: "Timetable activated!",
      invalidateQueries: [{ key: scheduleKeys.timetables() }],
      mutationOptions: {},
    },
  );
}

export function useDeleteTimetableEntry(id: string) {
  return useApiMutation<{ message: string }, void>(
    API.SCHEDULE_TIMETABLE_ENTRY(id),
    "delete",
    {
      successMessage: "Timetable entry removed!",
      invalidateQueries: [{ key: scheduleKeys.timetables() }],
      mutationOptions: {},
    },
  );
}

export function useFetchTimetableEntry(id: string) {
  return useFetchQuery<{ data: TimetableEntry }>(
    API.SCHEDULE_TIMETABLE_ENTRY(id),
    scheduleKeys.timetableEntry(id),
    undefined,
    { enabled: !!id },
  );
}

export function useFetchTeacherLoad(sectionId: string, year: string) {
  return useFetchQuery<{ data: TeacherLoad[] }>(
    API.SCHEDULE_TIMETABLE_TEACHER_LOAD,
    scheduleKeys.teacherLoad(sectionId, year),
    sectionId && year ? { sectionId, year } : undefined,
    { enabled: !!sectionId && !!year },
  );
}
