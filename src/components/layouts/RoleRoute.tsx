import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/lib/store";
import { canAccess } from "@/utils/rbac.helpers";
import type { UserRole } from "@/features/auth/types/user.types";

type RoleRouteProps = {
  allowedRoles: readonly UserRole[];
};

export function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const userRole = useAppSelector((state) => state.auth.user?.type);

  if (!canAccess(allowedRoles, userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function createRoleRoute(allowedRoles: readonly UserRole[]) {
  return function RoleGuardRoute() {
    return <RoleRoute allowedRoles={allowedRoles} />;
  };
}
