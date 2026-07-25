import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type {
  School,
  SchoolDetail,
  CreateSchoolInput,
  UpdateSchoolInput,
  SubscribeSchoolInput,
} from "../types/school.types";

export const schoolKeys = {
  all: ["schools"] as const,
  lists: () => [...schoolKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...schoolKeys.lists(), params] as const,
  details: () => [...schoolKeys.all, "detail"] as const,
  detail: (id: string) => [...schoolKeys.details(), id] as const,
};

export function useFetchSchools() {
  return useFetchQuery<{ data: School[] }>(API.TENANTS, schoolKeys.lists());
}

export function useFetchSchoolDetail(id: string) {
  return useFetchQuery<{ data: SchoolDetail }>(
    `${API.TENANTS}/${id}`,
    schoolKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateSchool() {
  return useApiMutation<{ message: string }, CreateSchoolInput>(
    API.TENANTS,
    "post",
    {
      successMessage: "School created successfully!",
      invalidateQueries: [{ key: schoolKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useUpdateSchool(id: string) {
  return useApiMutation<{ message: string }, UpdateSchoolInput>(
    `${API.TENANTS}/${id}`,
    "patch",
    {
      successMessage: "School updated successfully!",
      invalidateQueries: [
        { key: schoolKeys.lists() },
        { key: schoolKeys.detail(id) },
      ],
      mutationOptions: {},
    },
  );
}

export function useDeleteSchool() {
  return useApiMutation<{ message: string }, string>(API.TENANTS, "delete", {
    successMessage: "School deleted successfully!",
    invalidateQueries: [{ key: schoolKeys.lists() }],
    mutationOptions: {},
  });
}

export function useSubscribeSchool() {
  return useApiMutation<{ message: string }, SubscribeSchoolInput>(
    API.TENANT_SUBSCRIBE,
    "post",
    {
      successMessage: "School subscribed successfully!",
      invalidateQueries: [{ key: schoolKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useRemoveSchoolSubscription() {
  return useApiMutation<{ message: string }, string>(
    API.TENANT_SUBSCRIBE,
    "delete",
    {
      successMessage: "Subscription removed successfully!",
      invalidateQueries: [{ key: schoolKeys.lists() }],
      mutationOptions: {},
    },
  );
}
