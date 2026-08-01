import { useFetchQuery } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { ParentDetail, ParentListItem } from "../types/parent.types";

export const parentKeys = {
  all: ["parents"] as const,
  lists: () => [...parentKeys.all, "list"] as const,
  list: () => [...parentKeys.lists()] as const,
  details: () => [...parentKeys.all, "detail"] as const,
  detail: (id: string) => [...parentKeys.details(), id] as const,
};

export function useFetchParents() {
  return useFetchQuery<{ data: ParentListItem[] }>(
    API.REGISTRATION_PARENTS,
    parentKeys.list(),
  );
}

export function useFetchParent(id: string) {
  return useFetchQuery<{ data: ParentDetail }>(
    API.REGISTRATION_PARENT(id),
    parentKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}
