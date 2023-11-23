import { ErrorBoundary, PagePermission } from "@/components";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Loader from "./loader";
import { lazy } from "react";
import { BaseLayout, SlidebarLayout } from "@/layouts";
import { brandsLoader } from "@/pages/brands/ListBrand";
import { categoriesLoader } from "@/pages/categories/ListCategory";
import { salesCategoryLoader } from "@/pages/salesCategories/ListSalesCategory";

const HomePage = Loader(lazy(() => import("@/pages/home.page")))

// Status
const Status404Page = Loader(lazy(() => import("@/pages/status404.page")))
const StatusUnauthorizedPage = Loader(lazy(() => import("@/pages/unauthorized.page")))

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

          /// BRAND ROUTES
          {
            path: "brands",
            children: [
              {
                path: "",
                loader: brandsLoader,
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
                loader: salesCategoryLoader,
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
                loader: categoriesLoader,
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
