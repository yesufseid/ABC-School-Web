import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type { Teacher } from "../types/teacher.types";

export const teacherKeys = {
  all: ["teachers"] as const,
  lists: () => [...teacherKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...teacherKeys.lists(), params] as const,
  details: () => [...teacherKeys.all, "detail"] as const,
  detail: (id: string) => [...teacherKeys.details(), id] as const,
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
