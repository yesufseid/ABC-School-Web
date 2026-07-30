import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type { StaffMember } from "../types/staff.types";

export const staffKeys = {
  all: ["staff"] as const,
  lists: () => [...staffKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...staffKeys.lists(), params] as const,
  details: () => [...staffKeys.all, "detail"] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
};

export function useFetchStaff() {
  return useFetchQuery<{ data: StaffMember[] }>(API.STAFF, staffKeys.lists());
}

export function useFetchStaffMember(id: string) {
  return useFetchQuery<{ data: StaffMember }>(
    API.STAFF_MEMBER(id),
    staffKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateStaff() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreateStaffDto"]
  >(API.STAFF, "post", {
    successMessage: "Staff member created successfully!",
    invalidateQueries: [{ key: staffKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdateStaff(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdateStaffDto"]
  >(API.STAFF_MEMBER(id), "patch", {
    successMessage: "Staff member updated successfully!",
    invalidateQueries: [
      { key: staffKeys.lists() },
      { key: staffKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeleteStaff() {
  return useApiMutation<{ message: string }, string>(API.STAFF, "delete", {
    successMessage: "Staff member deleted successfully!",
    invalidateQueries: [{ key: staffKeys.lists() }],
    mutationOptions: {},
  });
}
