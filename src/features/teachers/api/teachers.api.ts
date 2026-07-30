import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type { Teacher, TeacherGrade } from "../types/teacher.types";

export const teacherKeys = {
  all: ["teachers"] as const,
  lists: () => [...teacherKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...teacherKeys.lists(), params] as const,
  details: () => [...teacherKeys.all, "detail"] as const,
  detail: (id: string) => [...teacherKeys.details(), id] as const,
};

export const teacherGradeKeys = {
  all: ["teacher-grades"] as const,
  lists: () => [...teacherGradeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...teacherGradeKeys.lists(), params] as const,
  details: () => [...teacherGradeKeys.all, "detail"] as const,
  detail: (id: string) => [...teacherGradeKeys.details(), id] as const,
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

export function useFetchTeacherGrades() {
  return useFetchQuery<{ data: TeacherGrade[] }>(
    API.TEACHER_GRADES,
    teacherGradeKeys.lists(),
  );
}

export function useFetchTeacherGrade(id: string) {
  return useFetchQuery<{ data: TeacherGrade }>(
    API.TEACHER_GRADE(id),
    teacherGradeKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateTeacherGrade() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateGradeDto"]
  >(API.TEACHER_GRADES, "post", {
    successMessage: "Grade created successfully!",
    invalidateQueries: [{ key: teacherGradeKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateTeacherGrade(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateGradeDto"]
  >(API.TEACHER_GRADE(id), "patch", {
    successMessage: "Grade updated successfully!",
    invalidateQueries: [
      { key: teacherGradeKeys.lists() },
      { key: teacherGradeKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteTeacherGrade() {
  return useApiMutation<{ message: string }, string>(
    API.TEACHER_GRADES,
    "delete",
    {
      successMessage: "Grade deleted successfully!",
      invalidateQueries: [{ key: teacherGradeKeys.lists() }],
      mutationOptions: {},
    },
  );
}
