import type { UserRole } from "@/features/auth/types/user.types";

export function canAccess(
  allowedRoles: readonly UserRole[],
  userRole: UserRole | undefined,
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function filterByRole<T extends { roles: readonly UserRole[] }>(
  items: readonly T[],
  userRole: UserRole | undefined,
): T[] {
  return items.filter((item) => canAccess(item.roles, userRole));
}
