import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/lib/store";

export default function ProtectedRoute() {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
