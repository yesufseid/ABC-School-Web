import { useFetchQuery, useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type {
  Subscription,
  SubscriptionDetail,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
} from "../types/subscription.types";

export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...subscriptionKeys.lists(), params] as const,
  details: () => [...subscriptionKeys.all, "detail"] as const,
  detail: (id: string) => [...subscriptionKeys.details(), id] as const,
};

export function useFetchSubscriptions() {
  return useFetchQuery<{ data: Subscription[] }>(
    API.SUBSCRIPTIONS,
    subscriptionKeys.lists(),
  );
}

export function useFetchSubscriptionDetail(id: string) {
  return useFetchQuery<{ data: SubscriptionDetail }>(
    `${API.SUBSCRIPTIONS}/${id}`,
    subscriptionKeys.detail(id),
    undefined,
    { enabled: !!id },
  );
}

export function useCreateSubscription() {
  return useApiMutation<{ message: string }, CreateSubscriptionInput>(
    API.SUBSCRIPTIONS,
    "post",
    {
      successMessage: "Subscription created successfully!",
      invalidateQueries: [{ key: subscriptionKeys.lists() }],
      mutationOptions: {},
    },
  );
}

export function useUpdateSubscription(id: string) {
  return useApiMutation<{ message: string }, UpdateSubscriptionInput>(
    `${API.SUBSCRIPTIONS}/${id}`,
    "patch",
    {
      successMessage: "Subscription updated successfully!",
      invalidateQueries: [
        { key: subscriptionKeys.lists() },
        { key: subscriptionKeys.detail(id) },
      ],
      mutationOptions: {},
    },
  );
}

export function useDeleteSubscription() {
  return useApiMutation<{ message: string }, string>(
    API.SUBSCRIPTIONS,
    "delete",
    {
      successMessage: "Subscription deleted successfully!",
      invalidateQueries: [{ key: subscriptionKeys.lists() }],
      mutationOptions: {},
    },
  );
}
