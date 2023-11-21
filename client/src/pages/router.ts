import { ErrorBoundary } from "@/components/ErrorBoundary";
import { createBrowserRouter } from "react-router-dom";
import Loader from "./loader";
import { lazy } from "react";
import { BaseLayout } from "@/layouts";

const HomePage = Loader(lazy(() => import("@/pages/home.page")))

const Status404Page = Loader(lazy(() => import("@/pages/Status404.page")))

const LoginPage = Loader(lazy(() => import("@/pages/login.page")))


const routes = createBrowserRouter([
  {
    path: "",
    ErrorBoundary,
    Component: BaseLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "auth",
        children: [
          {
            path: "login",
            Component: LoginPage
          }
        ]
      },
      {
        path: "status",
        children: [
          {
            path: "404",
            Component: Status404Page
          }
        ]
      },
    ]
  }
])


export default routes
