import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div>
      <h1>This is main layout</h1>
      <Outlet />
    </div>
  );
}
