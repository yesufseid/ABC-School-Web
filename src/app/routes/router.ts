import { createBrowserRouter, redirect } from "react-router";
import AuthLayout from "@/components/layouts/AuthLayout.tsx";
import MainLayout from "@/components/layouts/MainLayout.tsx";
import { createRoleRoute } from "@/components/layouts/RoleRoute.tsx";
import { LoginPage } from "@/features/auth/pages/login.page.tsx";
import { DashboardPage } from "@/features/dashboard/pages/dashboard.page.tsx";
import { ComingSoonPage } from "@/features/shared/pages/coming-soon.page.tsx";
import ProtectedRoute from "@/components/layouts/ProtectedRoute.tsx";

function comingSoonRoute(title: string) {
  return {
    Component: ComingSoonPage,
    handle: { title },
  };
}

export const router = createBrowserRouter([
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "*",
        loader: () => redirect("/auth/login"),
      },
    ],
  },
  {
    path: "/",
    Component: ProtectedRoute,
    children: [
      {
        Component: MainLayout,
        children: [
          {
            index: true,
            Component: DashboardPage,
          },
          {
            path: "students",
            Component: createRoleRoute([
              "Admin",
              "Owner",
              "Principal",
              "Teacher",
            ]),
            children: [{ index: true, ...comingSoonRoute("Students") }],
          },
          {
            path: "parents",
            Component: createRoleRoute(["Admin", "Owner", "Principal"]),
            children: [{ index: true, ...comingSoonRoute("Parents") }],
          },
          {
            path: "teachers",
            Component: createRoleRoute(["Admin", "Owner", "Principal"]),
            children: [{ index: true, ...comingSoonRoute("Teachers") }],
          },
          {
            path: "principals",
            Component: createRoleRoute(["Admin", "Owner"]),
            children: [{ index: true, ...comingSoonRoute("Principals") }],
          },
          {
            path: "materials",
            ...comingSoonRoute("Materials"),
          },
          {
            path: "schedules",
            ...comingSoonRoute("Schedules"),
          },
          {
            path: "academics",
            ...comingSoonRoute("Academics"),
          },
          {
            path: "attendance",
            Component: createRoleRoute([
              "Admin",
              "Owner",
              "Principal",
              "Teacher",
            ]),
            children: [{ index: true, ...comingSoonRoute("Attendance") }],
          },
          {
            path: "classes",
            Component: createRoleRoute([
              "Admin",
              "Owner",
              "Principal",
              "Teacher",
            ]),
            children: [{ index: true, ...comingSoonRoute("Classes") }],
          },
          {
            path: "messages",
            ...comingSoonRoute("Messages"),
          },
        ],
      },
    ],
  },
]);
