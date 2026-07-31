import { createBrowserRouter, redirect } from "react-router";
import AuthLayout from "@/components/layouts/AuthLayout.tsx";
import MainLayout from "@/components/layouts/MainLayout.tsx";
import { createRoleRoute } from "@/components/layouts/RoleRoute.tsx";
import { LoginPage } from "@/features/auth/pages/login.page.tsx";
import { DashboardPage } from "@/features/dashboard/pages/dashboard.page.tsx";
import { StudentsPage } from "@/features/registration/pages/students.page.tsx";
import { StudentDetailPage } from "@/features/registration/pages/student-detail.page.tsx";
import { ClassesPage } from "@/features/classes/pages/classes.page.tsx";
import { ClassDetailPage } from "@/features/classes/pages/class-detail.page.tsx";
import { GradesPage } from "@/features/classes/pages/grades.page.tsx";
import { TeachersPage } from "@/features/teachers/pages/teachers.page.tsx";
import { TeacherDetailPage } from "@/features/teachers/pages/teacher-detail.page.tsx";
import { PrincipalsPage } from "@/features/principals/pages/principals.page.tsx";
import { PrincipalDetailPage } from "@/features/principals/pages/principal-detail.page.tsx";
import { SchoolsPage } from "@/features/schools/pages/schools.page.tsx";
import { SchoolDetailPage } from "@/features/schools/pages/school-detail.page.tsx";
import { SubscriptionsPage } from "@/features/subscriptions/pages/subscriptions.page.tsx";
import { SubscriptionDetailPage } from "@/features/subscriptions/pages/subscription-detail.page.tsx";
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
            children: [
              { index: true, Component: StudentsPage },
              { path: ":id", Component: StudentDetailPage },
            ],
          },
          {
            path: "parents",
            Component: createRoleRoute(["Admin", "Owner", "Principal"]),
            children: [{ index: true, ...comingSoonRoute("Parents") }],
          },
          {
            path: "teachers",
            Component: createRoleRoute(["Admin", "Owner", "Principal"]),
            children: [
              { index: true, Component: TeachersPage },
              { path: ":id", Component: TeacherDetailPage },
            ],
          },
          {
            path: "principals",
            Component: createRoleRoute(["Admin", "Owner"]),
            children: [
              { index: true, Component: PrincipalsPage },
              { path: ":id", Component: PrincipalDetailPage },
            ],
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
            children: [
              { index: true, Component: ClassesPage },
              { path: "grades", Component: GradesPage },
              { path: ":id", Component: ClassDetailPage },
            ],
          },
          {
            path: "messages",
            ...comingSoonRoute("Messages"),
          },
          {
            path: "schools",
            Component: createRoleRoute(["Admin", "Owner"]),
            children: [
              { index: true, Component: SchoolsPage },
              { path: ":id", Component: SchoolDetailPage },
            ],
          },
          {
            path: "subscriptions",
            Component: createRoleRoute(["Admin", "Owner"]),
            children: [
              { index: true, Component: SubscriptionsPage },
              { path: ":id", Component: SubscriptionDetailPage },
            ],
          },
        ],
      },
    ],
  },
]);
