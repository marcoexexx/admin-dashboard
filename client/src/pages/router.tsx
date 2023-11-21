import { ErrorBoundary, PagePermission } from "@/components";
import { createBrowserRouter } from "react-router-dom";
import Loader from "./loader";
import { lazy } from "react";
import { BaseLayout } from "@/layouts";

const HomePage = Loader(lazy(() => import("@/pages/home.page")))

const Status404Page = Loader(lazy(() => import("@/pages/status404.page")))

const StatusUnauthorizedPage = Loader(lazy(() => import("@/pages/unauthorized.page")))

const RegisterPage = Loader(lazy(() => import("@/pages/register.page")))

const LoginPage = Loader(lazy(() => import("@/pages/login.page")))


const routes = createBrowserRouter([
  {
    path: "",
    ErrorBoundary,
    Component: BaseLayout,
    children: [
      {
        path: "home",
        element: <PagePermission allowedRoles={["Admin"]} />,
        children: [
          {
            path: "",
            Component: HomePage
          }
        ]
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            Component: LoginPage
          },
          {
            path: "register",
            Component: RegisterPage
          },
        ]
      },
      {
        path: "status",
        children: [
          {
            path: "404",
            Component: Status404Page
          },
          {
            path: "unauthorized",
            Component: StatusUnauthorizedPage
          }
        ]
      },
    ]
  }
])


export default routes
