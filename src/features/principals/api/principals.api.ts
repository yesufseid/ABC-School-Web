import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { components } from "@/lib/api/generated/api-types";
import type { Principal } from "../types/principal.types";

export const principalKeys = {
  all: ["principals"] as const,
  lists: () => [...principalKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...principalKeys.lists(), params] as const,
  details: () => [...principalKeys.all, "detail"] as const,
  detail: (id: string) => [...principalKeys.details(), id] as const,
};

export function useFetchPrincipals() {
  return useFetchQuery<{ data: Principal[] }>(API.PRINCIPALS, principalKeys.lists());
}

export function useFetchPrincipal(id: string) {
  return useFetchQuery<{ data: Principal }>(
    API.PRINCIPAL(id),
    principalKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreatePrincipal() {
  return useApiMutation<
    { message: string },
    components["schemas"]["CreatePrincipalDto"]
  >(API.PRINCIPALS, "post", {
    successMessage: "Principal created successfully!",
    invalidateQueries: [{ key: principalKeys.lists() }],
    mutationOptions: {},
  });
}

export function useUpdatePrincipal(id: string) {
  return useApiMutation<
    { message: string },
    components["schemas"]["UpdatePrincipalDto"]
  >(API.PRINCIPAL(id), "patch", {
    successMessage: "Principal updated successfully!",
    invalidateQueries: [
      { key: principalKeys.lists() },
      { key: principalKeys.detail(id) },
    ],
    mutationOptions: {},
  });
}

export function useDeletePrincipal() {
  return useApiMutation<{ message: string }, string>(API.PRINCIPALS, "delete", {
    successMessage: "Principal deleted successfully!",
    invalidateQueries: [{ key: principalKeys.lists() }],
    mutationOptions: {},
  });
}
