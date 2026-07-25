import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api/http";
import { toast } from "sonner";

export function useFetchQuery<
  TData,
  TError extends { message: string } = Error,
>(
  url: string,
  key: string[],
  params?: Record<string, string | number | boolean>,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">,
) {
  const queryKey = params ? [...key, { params }] : key;

  return useQuery<TData, TError>({
    queryKey,
    queryFn: () => api.get(url, { params }),
    ...options,
  });
}

export function useApiMutation<
  TData,
  TVariables = void,
  TError extends { message: string } = Error,
>(
  url: string,
  method: "post" | "put" | "patch" | "delete" = "post",
  options?: {
    successMessage?: string;
    errorMessage?: string;
    queryParams?: Record<string, string | number | boolean>;
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: TError, variables: TVariables) => void;
    invalidateQueries?: {
      key: string[];
      params?: Record<string, string | number | boolean>;
    }[];
    mutationOptions: Omit<
      UseMutationOptions<TData, TError, TVariables>,
      "mutationFn"
    >;
  },
) {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables>({
    mutationFn: async (variables) => {
      const config = options?.queryParams
        ? { params: options.queryParams }
        : undefined;

      if (method === "delete") {
        const response = await api.delete<TData>(url, config);
        return response.data;
      }

      const response = await api[method]<TData>(url, variables, config);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach(({ key, params }) => {
          const queryKey = params ? [...key, { params }] : key;
          queryClient.invalidateQueries({ queryKey });
        });
      }

      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      const message =
        options?.errorMessage || error?.message || "Operation Failed";
      toast.error(message);

      options?.onError?.(error, variables);
    },
    ...options?.mutationOptions,
  });
}
