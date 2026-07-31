import { RoleRoute } from "@/components/layouts/RoleRoute";
import type { UserRole } from "@/features/auth/types/user.types";

export function createRoleRoute(allowedRoles: readonly UserRole[]) {
  return function RoleGuardRoute() {
    return <RoleRoute allowedRoles={allowedRoles} />;
  };
}
