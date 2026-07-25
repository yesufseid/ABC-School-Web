import { createBrowserRouter, redirect } from "react-router";
import AuthLayout from "@/components/layouts/AuthLayout.tsx";
import MainLayout from "@/components/layouts/MainLayout.tsx";
import { LoginPage } from "@/features/auth/pages/login.page.tsx";
import { DashboardPage } from "@/features/dashboard/pages/dashboard.page.tsx";
import { SchoolsPage } from "@/features/schools/pages/schools.page.tsx";
import { SubscriptionsPage } from "@/features/subscriptions/pages/subscriptions.page.tsx";
import ProtectedRoute from "@/components/layouts/ProtectedRoute.tsx";

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
            path: "schools",
            Component: SchoolsPage,
          },
          {
            path: "subscriptions",
            Component: SubscriptionsPage,
          },
        ],
      },
    ],
  },
]);
