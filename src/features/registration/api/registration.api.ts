import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type {
  Student,
  Section,
  ParentRecord,
} from "../types/registration.types";

export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id: string) => [...studentKeys.details(), id] as const,
  search: (query: string) => [...studentKeys.all, "search", query] as const,
};

export const sectionKeys = {
  all: ["sections"] as const,
  lists: () => [...sectionKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...sectionKeys.lists(), params] as const,
  details: () => [...sectionKeys.all, "detail"] as const,
  detail: (id: string) => [...sectionKeys.details(), id] as const,
};

export const parentKeys = {
  all: ["parents"] as const,
  search: (query: string) => [...parentKeys.all, "search", query] as const,
};

export function useFetchStudents() {
  return useFetchQuery<{ data: Student[] }>(
    API.REGISTRATION_STUDENTS,
    studentKeys.lists(),
  );
}

export function useFetchStudent(id: string) {
  return useFetchQuery<{ data: Student }>(
    API.REGISTRATION_STUDENT(id),
    studentKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateStudent() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateStudentDto"]
  >(API.REGISTRATION_STUDENTS, "post", {
    successMessage: "Student created successfully!",
    invalidateQueries: [{ key: studentKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateStudent(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateStudentDto"]
  >(API.REGISTRATION_STUDENT(id), "patch", {
    successMessage: "Student updated successfully!",
    invalidateQueries: [
      { key: studentKeys.lists() },
      { key: studentKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteStudent() {
  return useApiMutation<{ message: string }, string>(
    API.REGISTRATION_STUDENTS,
    "delete",
    {
      successMessage: "Student deleted successfully!",
      invalidateQueries: [{ key: studentKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useSearchStudents(q: string) {
  return useFetchQuery<{ data: Student[] }>(
    API.REGISTRATION_STUDENT_SEARCH,
    studentKeys.search(q),
    q ? { q } : undefined,
    { enabled: !!q },
  );
}

export function useFetchStudentConfirmation(id: string) {
  return useFetchQuery<{ data: unknown }>(
    API.REGISTRATION_STUDENT_CONFIRMATION(id),
    [...studentKeys.all, "confirmation", id],
    undefined,
    { enabled: !!id },
  );
}

export function useReAdmitStudent(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["ReAdmitDto"]
  >(API.REGISTRATION_STUDENT_RE_ADMIT(id), "patch", {
    successMessage: "Student re-admitted!",
    invalidateQueries: [
      { key: studentKeys.lists() },
      { key: studentKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useSearchParents(params?: { phone?: string; name?: string }) {
  const hasQuery = !!(params?.phone || params?.name);
  return useFetchQuery<{ data: ParentRecord[] }>(
    API.REGISTRATION_PARENT_SEARCH,
    parentKeys.search(JSON.stringify(params ?? {})),
    params,
    { enabled: hasQuery },
  );
}

export function useFetchSections(params?: {
  gradeId?: string;
  branchId?: string;
  year?: string;
}) {
  return useFetchQuery<{ data: Section[] }>(
    API.REGISTRATION_SECTIONS,
    sectionKeys.lists(),
    params,
  );
}

export function useFetchSection(id: string) {
  return useFetchQuery<{ data: Section }>(
    API.REGISTRATION_SECTION(id),
    sectionKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateSection() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateSectionDto"]
  >(API.REGISTRATION_SECTIONS, "post", {
    successMessage: "Section created!",
    invalidateQueries: [{ key: sectionKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateSection(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateSectionDto"]
  >(API.REGISTRATION_SECTION(id), "patch", {
    successMessage: "Section updated!",
    invalidateQueries: [
      { key: sectionKeys.lists() },
      { key: sectionKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteSection() {
  return useApiMutation<{ message: string }, string>(
    API.REGISTRATION_SECTIONS,
    "delete",
    {
      successMessage: "Section deleted!",
      invalidateQueries: [{ key: sectionKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useFetchSectionStudents(id: string) {
  return useFetchQuery<{ data: Student[] }>(
    API.REGISTRATION_SECTION_STUDENTS(id),
    [...sectionKeys.all, id, "students"],
    undefined,
    { enabled: !!id },
  );
}

export function useAssignStudents() {
  return useApiMutation<
    { message: string },
    components["schemas"]["AssignSectionDto"]
  >(API.REGISTRATION_SECTIONS_ASSIGN, "post", {
    successMessage: "Students assigned!",
    invalidateQueries: [{ key: sectionKeys.all }],
    mutationOptions: {},
  });
}

export function useAutoAssignPreview() {
  return useApiMutation<
    { data: unknown },
    components["schemas"]["AutoAssignSectionDto"]
  >(API.REGISTRATION_SECTIONS_AUTO_ASSIGN, "post", {
    mutationOptions: {},
  });
}

export function useConfirmAutoAssign() {
  return useApiMutation<{ message: string }, void>(
    API.REGISTRATION_SECTIONS_AUTO_ASSIGN_CONFIRM,
    "post",
    {
      successMessage: "Students assigned!",
      invalidateQueries: [
        { key: studentKeys.lists() },
        { key: sectionKeys.all },
      ],
      mutationOptions: {},
    },
  );
}
