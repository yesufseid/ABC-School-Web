import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type {
  School,
  SchoolDetail,
  Branch,
  CreateSchoolInput,
  UpdateSchoolInput,
  CreateBranchInput,
  UpdateBranchInput,
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

export const branchKeys = {
  all: ["branches"] as const,
  lists: (tenantId: string) => [...branchKeys.all, tenantId, "list"] as const,
  list: (tenantId: string, params: Record<string, unknown>) =>
    [...branchKeys.lists(tenantId), params] as const,
  details: (tenantId: string) =>
    [...branchKeys.all, tenantId, "detail"] as const,
  detail: (tenantId: string, id: string) =>
    [...branchKeys.details(tenantId), id] as const,
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
  return useApiMutation<
    { message: string; tenantId: string },
    CreateSchoolInput
  >(API.TENANTS, "post", {
    successMessage: "School created successfully!",
    invalidateQueries: [{ key: schoolKeys.lists() }],
    mutationOptions: {},
  });
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

export function useFetchBranches(tenantId: string) {
  return useFetchQuery<{ data: Branch[] }>(
    API.TENANT_BRANCHES(tenantId),
    branchKeys.lists(tenantId),
    undefined,
    { enabled: !!tenantId },
  );
}

export function useFetchBranchDetail(tenantId: string, branchId: string) {
  return useFetchQuery<{ data: Branch }>(
    `${API.TENANT_BRANCHES(tenantId)}/${branchId}`,
    branchKeys.detail(tenantId, branchId),
    undefined,
    { enabled: !!tenantId && !!branchId },
  );
}

export function useCreateBranch(tenantId: string) {
  return useApiMutation<{ data: Branch }, CreateBranchInput>(
    API.TENANT_BRANCHES(tenantId),
    "post",
    {
      successMessage: "Branch created successfully!",
      invalidateQueries: [{ key: branchKeys.lists(tenantId) }],
      mutationOptions: {},
    },
  );
}

export function useUpdateBranch(tenantId: string, branchId: string) {
  return useApiMutation<{ data: Branch }, UpdateBranchInput>(
    `${API.TENANT_BRANCHES(tenantId)}/${branchId}`,
    "patch",
    {
      successMessage: "Branch updated successfully!",
      invalidateQueries: [
        { key: branchKeys.lists(tenantId) },
        { key: branchKeys.detail(tenantId, branchId) },
      ],
      mutationOptions: {},
    },
  );
}

export function useDeleteBranch(tenantId: string) {
  return useApiMutation<{ message: string }, string>(
    API.TENANT_BRANCHES(tenantId),
    "delete",
    {
      successMessage: "Branch deleted successfully!",
      invalidateQueries: [{ key: branchKeys.lists(tenantId) }],
      mutationOptions: {},
    },
  );
}
