import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { decodeJwt } from "@/utils/token.helpers";
import type { UserRole } from "@/features/auth/types/user.types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export type AuthContext = {
  tenantId: string | null;
  branchId: string | null;
  role: UserRole | undefined;
  year: string;
  term: string;
};

export function useAuthContext(): AuthContext {
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const prefs = useAppSelector((state) => state.prefs);

  const claims = useMemo(
    () => (accessToken ? decodeJwt(accessToken) : null),
    [accessToken],
  );

  const tenantId = user?.tenantId ?? claims?.tenantId ?? null;
  const branchId = user?.branchId ?? claims?.branchId ?? prefs.branchId ?? null;
  const year = prefs.year ?? String(new Date().getFullYear());
  const term = prefs.term ?? "Term 1";

  return { tenantId, branchId, role: user?.type, year, term };
}
