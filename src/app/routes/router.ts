import { createBrowserRouter, redirect } from "react-router";
import App from "../../App.tsx";
import AuthLayout from "../../components/layouts/AuthLayout.tsx";
import MainLayout from "../../components/layouts/MainLayout.tsx";
import { LoginPage } from "../../features/auth/login.page.tsx";

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
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: App,
      },
    ],
  },
]);
