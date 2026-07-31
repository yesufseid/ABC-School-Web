import { Outlet } from "react-router";
import { NavigationProgress } from "@/components/layouts/NavigationProgress";

export default function AuthLayout() {
  return (
    <>
      <NavigationProgress />
      <Outlet />
    </>
  );
}
