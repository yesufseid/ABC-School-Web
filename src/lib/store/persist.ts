import type { AuthState } from "@/lib/store/slices/auth.slice";
import type { User } from "@/features/auth/types/user.types";
import { decodeJwt } from "@/utils/token.helpers";

const STORAGE_KEY = "axis-sms.auth";

export type PersistedAuthState = {
  accessToken: string;
  user: User;
};

export function saveAuthState(state: PersistedAuthState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore persistence failures (private mode, storage disabled).
  }
}

export function loadAuthState(): PersistedAuthState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PersistedAuthState;
    if (!parsed.accessToken || !parsed.user) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function clearAuthState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore persistence failures.
  }
}

export function rehydrateAuthState(persisted: PersistedAuthState): AuthState {
  const claims = decodeJwt(persisted.accessToken);
  const user: User = {
    ...persisted.user,
    tenantId: persisted.user.tenantId ?? claims?.tenantId,
    branchId: persisted.user.branchId ?? claims?.branchId,
  };

  return {
    accessToken: persisted.accessToken,
    user,
  };
}
