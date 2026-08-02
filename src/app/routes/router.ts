import { createBrowserRouter, redirect } from "react-router";
import type { ComponentType } from "react";
import AuthLayout from "@/components/layouts/AuthLayout.tsx";
import MainLayout from "@/components/layouts/MainLayout.tsx";
import ProtectedRoute from "@/components/layouts/ProtectedRoute.tsx";
import { createRoleRoute } from "@/app/routes/create-role-route.tsx";
import { RouteErrorBoundary } from "@/components/layouts/RouteErrorBoundary";
import { RouteFallback } from "@/components/layouts/RouteFallback";
import { ROUTE_ACCESS } from "@/config/route-access.config";

function lazyPage<M extends Record<string, ComponentType>>(
  loader: () => Promise<M>,
  name: keyof M,
) {
  return async () => ({
    Component: (await loader())[name],
  });
}

export const router = createBrowserRouter([
  {
    path: "auth",
    Component: AuthLayout,
    ErrorBoundary: RouteErrorBoundary,
    HydrateFallback: RouteFallback,
    children: [
      {
        path: "login",
        lazy: lazyPage(
          () => import("@/features/auth/pages/login.page"),
          "LoginPage",
        ),
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
    ErrorBoundary: RouteErrorBoundary,
    HydrateFallback: RouteFallback,
    children: [
      {
        Component: MainLayout,
        children: [
          {
            index: true,
            lazy: lazyPage(
              () => import("@/features/dashboard/pages/dashboard.page"),
              "DashboardPage",
            ),
          },
          {
            path: "students",
            Component: createRoleRoute(ROUTE_ACCESS["/students"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () =>
                    import("@/features/registration/pages/students.page"),
                  "StudentsPage",
                ),
              },
              {
                path: ":id",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/registration/pages/student-detail.page"
                    ),
                  "StudentDetailPage",
                ),
              },
            ],
          },
          {
            path: "parents",
            Component: createRoleRoute(ROUTE_ACCESS["/parents"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/parents/pages/parents.page"),
                  "ParentsPage",
                ),
              },
              {
                path: ":id",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/parents/pages/parent-detail.page"
                    ),
                  "ParentDetailPage",
                ),
              },
            ],
          },
          {
            path: "teachers",
            Component: createRoleRoute(ROUTE_ACCESS["/teachers"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/teachers/pages/teachers.page"),
                  "TeachersPage",
                ),
              },
              {
                path: ":id",
                lazy: lazyPage(
                  () =>
                    import("@/features/teachers/pages/teacher-detail.page"),
                  "TeacherDetailPage",
                ),
              },
            ],
          },
          {
            path: "principals",
            Component: createRoleRoute(ROUTE_ACCESS["/principals"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/principals/pages/principals.page"),
                  "PrincipalsPage",
                ),
              },
              {
                path: ":id",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/principals/pages/principal-detail.page"
                    ),
                  "PrincipalDetailPage",
                ),
              },
            ],
          },
          {
            path: "materials",
            Component: createRoleRoute(ROUTE_ACCESS["/materials"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/materials/pages/materials.page"),
                  "MaterialsPage",
                ),
              },
            ],
          },
          {
            path: "schedules",
            Component: createRoleRoute(ROUTE_ACCESS["/schedules"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/schedules/pages/schedules.page"),
                  "SchedulesPage",
                ),
              },
            ],
          },
          {
            path: "academics",
            Component: createRoleRoute(ROUTE_ACCESS["/academics"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/academics/pages/academics.page"),
                  "AcademicsPage",
                ),
              },
            ],
          },
          {
            path: "attendance",
            Component: createRoleRoute(ROUTE_ACCESS["/attendance"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/attendance/pages/attendance.page"),
                  "AttendancePage",
                ),
              },
            ],
          },
          {
            path: "classes",
            Component: createRoleRoute(ROUTE_ACCESS["/classes"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/classes/pages/classes.page"),
                  "ClassesPage",
                ),
              },
              {
                path: "grades",
                lazy: lazyPage(
                  () => import("@/features/classes/pages/grades.page"),
                  "GradesPage",
                ),
              },
              {
                path: ":id",
                lazy: lazyPage(
                  () => import("@/features/classes/pages/class-detail.page"),
                  "ClassDetailPage",
                ),
              },
            ],
          },
          {
            path: "messages",
            Component: createRoleRoute(ROUTE_ACCESS["/messages"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/messages/pages/messages.page"),
                  "MessagesPage",
                ),
              },
            ],
          },
          {
            path: "schools",
            Component: createRoleRoute(ROUTE_ACCESS["/schools"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/features/schools/pages/schools.page"),
                  "SchoolsPage",
                ),
              },
              {
                path: ":id",
                lazy: lazyPage(
                  () =>
                    import("@/features/schools/pages/school-detail.page"),
                  "SchoolDetailPage",
                ),
              },
            ],
          },
          {
            path: "subscriptions",
            Component: createRoleRoute(ROUTE_ACCESS["/subscriptions"]),
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/subscriptions/pages/subscriptions.page"
                    ),
                  "SubscriptionsPage",
                ),
              },
              {
                path: ":id",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/subscriptions/pages/subscription-detail.page"
                    ),
                  "SubscriptionDetailPage",
                ),
              },
            ],
          },
          {
            path: "teacher",
            Component: createRoleRoute(ROUTE_ACCESS["/teacher"]),
            children: [
              {
                index: true,
                loader: () => redirect("/teacher/classes"),
              },
              {
                path: "classes",
                lazy: lazyPage(
                  () =>
                    import("@/features/teachers/pages/my-classes.page"),
                  "MyClassesPage",
                ),
              },
              {
                path: "students",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/teachers/pages/my-students.page"
                    ),
                  "MyStudentsPage",
                ),
              },
              {
                path: "timetable",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/teachers/pages/my-timetable.page"
                    ),
                  "MyTimetablePage",
                ),
              },
              {
                path: "attendance",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/teachers/pages/my-attendance.page"
                    ),
                  "MyAttendancePage",
                ),
              },
              {
                path: "gradebook",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/teachers/pages/my-gradebook.page"
                    ),
                  "MyGradebookPage",
                ),
              },
              {
                path: "calendar",
                lazy: lazyPage(
                  () =>
                    import(
                      "@/features/teachers/pages/my-calendar.page"
                    ),
                  "MyCalendarPage",
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
