import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type {
  Teacher,
  MyTeacher,
  MySection,
  MyStudent,
  MyTimetableDay,
} from "../types/teacher.types";

export const teacherKeys = {
  all: ["teachers"] as const,
  lists: () => [...teacherKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...teacherKeys.lists(), params] as const,
  details: () => [...teacherKeys.all, "detail"] as const,
  detail: (id: string) => [...teacherKeys.details(), id] as const,
  me: () => [...teacherKeys.all, "me"] as const,
  meSections: () => [...teacherKeys.me(), "sections"] as const,
  meStudents: () => [...teacherKeys.me(), "students"] as const,
  meTimetable: () => [...teacherKeys.me(), "timetable"] as const,
};

export function useFetchTeachers() {
  return useFetchQuery<{ data: Teacher[] }>(API.TEACHERS, teacherKeys.lists());
}

export function useFetchTeacher(id: string) {
  return useFetchQuery<{ data: Teacher }>(
    API.TEACHER(id),
    teacherKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useFetchMyTeacher() {
  return useFetchQuery<{ data: MyTeacher }>(API.TEACHER_ME, teacherKeys.me());
}

export function useFetchMySections() {
  return useFetchQuery<{ data: MySection[] }>(
    API.TEACHER_ME_SECTIONS,
    teacherKeys.meSections(),
  );
}

export function useFetchMyStudents() {
  return useFetchQuery<{ data: MyStudent[] }>(
    API.TEACHER_ME_STUDENTS,
    teacherKeys.meStudents(),
  );
}

export function useFetchMyTimetable() {
  return useFetchQuery<{ data: MyTimetableDay[] }>(
    API.TEACHER_ME_TIMETABLE,
    teacherKeys.meTimetable(),
  );
}

export function useCreateTeacher() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateTeacherDto"]
  >(API.TEACHERS, "post", {
    successMessage: "Teacher created successfully!",
    invalidateQueries: [{ key: teacherKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateTeacher(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateTeacherDto"]
  >(API.TEACHER(id), "patch", {
    successMessage: "Teacher updated successfully!",
    invalidateQueries: [
      { key: teacherKeys.lists() },
      { key: teacherKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteTeacher() {
  return useApiMutation<{ message: string }, string>(API.TEACHERS, "delete", {
    successMessage: "Teacher deleted successfully!",
    invalidateQueries: [{ key: teacherKeys.lists() }],
    mutationOptions: {},
  });
}
