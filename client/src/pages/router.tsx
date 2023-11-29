import { ErrorBoundary, PagePermission } from "@/components";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Loader from "./loader";
import { lazy } from "react";
import { BaseLayout, SlidebarLayout } from "@/layouts";

const HomePage = Loader(lazy(() => import("@/pages/home.page")))

// Status
const Status404Page = Loader(lazy(() => import("@/pages/status404.page")))
const StatusUnauthorizedPage = Loader(lazy(() => import("@/pages/unauthorized.page")))

// produts
const ListExchangePage = Loader(lazy(() => import("@/pages/exchanges/ListExchange")))
const CreateExchangePage = Loader(lazy(() => import("@/pages/exchanges/CreateExchange")))

// Auth
const RegisterPage = Loader(lazy(() => import("@/pages/register.page")))
const LoginPage = Loader(lazy(() => import("@/pages/login.page")))

// produts
const ListProductPage = Loader(lazy(() => import("@/pages/products/ListProduct")))
const CreateProductPage = Loader(lazy(() => import("@/pages/products/CreateProduct")))

// brands
const ListBrandPage = Loader(lazy(() => import("@/pages/brands/ListBrand")))
const CreateBrandPage = Loader(lazy(() => import("@/pages/brands/CreateBrand")))

// categories
const ListCategoryPage = Loader(lazy(() => import("@/pages/categories/ListCategory")))
const CreateCategoryPage = Loader(lazy(() => import("@/pages/categories/CreateCategory")))

// sales categories
const ListSalesCategoryPage = Loader(lazy(() => import("@/pages/salesCategories/ListSalesCategory")))
const CreateSalesCategoryPage = Loader(lazy(() => import("@/pages/salesCategories/CreateSalesCategory")))


const routes = createBrowserRouter([
  {
    path: "",
    ErrorBoundary,
    children: [
      /// MAIN ROUTES
      {
        path: "",
        Component: SlidebarLayout,
        children: [
          {
            path: "",
            Component: HomePage
          },

          {
            path: "home",
            element: <Navigate to="/" />
          },

          /// EXCHANGES ROUTES
          {
            path: "exchanges",
            children: [
              {
                path: "",
                element: <Navigate to="/exchanges/list" />
              },
              {
                path: "list",
                Component: ListExchangePage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateExchangePage
                  }
                ]
              }
            ]
          },


          /// BRAND ROUTES
          {
            path: "brands",
            children: [
              {
                path: "",
                element: <Navigate to="/brands/list" />
              },
              {
                path: "list",
                Component: ListBrandPage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateBrandPage
                  }
                ]
              }
            ]
          },

          /// SALES-CATEGORY ROUTES
          {
            path: "sales-categories",
            children: [
              {
                path: "",
                element: <Navigate to="/sales-categories/list" />
              },
              {
                path: "list",
                Component: ListSalesCategoryPage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateSalesCategoryPage
                  }
                ]
              }
            ]
          },

          /// CATEGORY ROUTES
          {
            path: "categories",
            children: [
              {
                path: "",
                element: <Navigate to="/categories/list" />
              },
              {
                path: "list",
                Component: ListCategoryPage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateCategoryPage
                  }
                ]
              }
            ]
          },

          /// PRODUCT ROUTES
          {
            path: "products",
            children: [
              {
                path: "",
                element: <Navigate to="/products/list" />
              },
              {
                path: "list",
                Component: ListProductPage
              },
              {
                path: "create",
                element: <PagePermission allowedRoles={["Admin", "Employee"]} />,
                children: [
                  {
                    path: "",
                    Component: CreateProductPage
                  }
                ]
              }
            ]
          },
        ]
      },

      /// AUTHORIZATION ROUTES
      {
        path: "auth",
        Component: BaseLayout,
        children: [
          {
            path: "register",
            Component: RegisterPage,
          },
          {
            path: "login",
            Component: LoginPage
          }
        ]
      },

      /// STATUS ROUTES
      {
        path: "status",
        Component: BaseLayout,
        children: [
          {
            path: "404",
            Component: Status404Page
          },

          {
            path: "unauthorized",
            Component: StatusUnauthorizedPage
          },

          {
            path: "500",
            Component: ErrorBoundary
          }
        ]
      },

      {
        path: "dashboard",
        element: <Navigate to="" />
      },

      {
        path: "*",
        Component: Status404Page
      },
    ]
  },

  // TEST ROUTES
  {
    path: "test",
    Component: SlidebarLayout,
    children: [
      {
        path: "brandinput",
        Component: CreateProductPage
      }
    ]
  }
])


export default routes
