import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type { Grade } from "../types/classes.types";

export const gradeKeys = {
  all: ["grades"] as const,
  lists: () => [...gradeKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...gradeKeys.lists(), params] as const,
  details: () => [...gradeKeys.all, "detail"] as const,
  detail: (id: string) => [...gradeKeys.details(), id] as const,
};

export function useFetchGrades() {
  return useFetchQuery<{ data: Grade[] }>(API.TEACHER_GRADES, gradeKeys.lists());
}

export function useFetchGrade(id: string) {
  return useFetchQuery<{ data: Grade }>(
    API.TEACHER_GRADE(id),
    gradeKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateGrade() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateGradeDto"]
  >(API.TEACHER_GRADES, "post", {
    successMessage: "Grade created!",
    invalidateQueries: [{ key: gradeKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateGrade(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateGradeDto"]
  >(API.TEACHER_GRADE(id), "patch", {
    successMessage: "Grade updated!",
    invalidateQueries: [
      { key: gradeKeys.lists() },
      { key: gradeKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteGrade() {
  return useApiMutation<{ message: string }, string>(
    API.TEACHER_GRADES,
    "delete",
    {
      successMessage: "Grade deleted!",
      invalidateQueries: [{ key: gradeKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export {
  sectionKeys,
  useFetchSections,
  useFetchSection,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useFetchSectionStudents,
  useAssignStudents,
  useAutoAssignPreview,
  useConfirmAutoAssign,
  useFetchStudents,
} from "@/features/registration/api/registration.api";
