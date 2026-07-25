import { useApiMutation } from "@/lib/api/query";
import { API } from "@/lib/api/api.constants";
import type { LoginFormValues } from "../schemas/login.schema";
import type { LoginResponse } from "../types/user.types";

export const authKeys = {
  all: ["auth"] as const,
};

export function useLogin() {
  return useApiMutation<LoginResponse, LoginFormValues>(
    API.AUTH_LOGIN,
    "post",
    {
      errorMessage: "Invalid phone number or password",
      mutationOptions: {},
    },
  );
}
