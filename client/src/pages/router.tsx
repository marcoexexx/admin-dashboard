import { ErrorBoundary, PagePermission } from "@/components";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Loader from "./loader";
import { lazy } from "react";
import { BaseLayout, SlidebarLayout } from "@/layouts";
import { accessLogsPermissionsLoader, brandPermissionsLoader, categoryPermissionsLoader, cityPermissionsLoader, couponPermissionsLoader, exchangePermissionsLoader, orderPermissionsLoader, productPermissionsLoader, regionPermissionsLoader, salesCategoryPermissionsLoader, userAddressPermissionsLoader, userPermissionsLoader } from "./permissionLoader";
import { meProfileLoader } from "@/pages/me/ManagementUserProfile";


const HomePage = Loader(lazy(() => import("@/pages/home/Home")))

// Status
const Status404Page = Loader(lazy(() => import("@/pages/status404.page")))
const StatusUnauthorizedPage = Loader(lazy(() => import("@/pages/unauthorized.page")))

// user-address
const ListUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/ListUserAddress")))
const CreateUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/CreateUserAddress")))
const UpdateUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/UpdateUserAddress")))


const ListAccessLogPage = Loader(lazy(() => import("@/pages/accessLogs/ListAccessLogs")))

// cities
const ListCityPage = Loader(lazy(() => import("@/pages/cities/ListCity")))
const CreateCityPage = Loader(lazy(() => import("@/pages/cities/CreateCity")))
const UpdateCityPage = Loader(lazy(() => import("@/pages/cities/UpdateCity")))

// regions
const ListRegionPage = Loader(lazy(() => import("@/pages/regions/ListRegion")))
const CreateRegionPage = Loader(lazy(() => import("@/pages/regions/CreateRegion")))
const UpdateRegionPage = Loader(lazy(() => import("@/pages/regions/UpdateRegion")))

// coupons
const ListCouponPage = Loader(lazy(() => import("@/pages/coupons/ListCoupon")))
const CreateCouponPage = Loader(lazy(() => import("@/pages/coupons/CreateCoupon")))
const UpdateCouponPage = Loader(lazy(() => import("@/pages/coupons/UpdateCoupon")))

// orders
const ListOrderPage = Loader(lazy(() => import("@/pages/orders/ListOrder")))
const CreateOrderPage = Loader(lazy(() => import("@/pages/orders/CreateOrder")))
const UpdateOrderPage = Loader(lazy(() => import("@/pages/orders/UpdateOrder")))

// exchanges
const ListExchangePage = Loader(lazy(() => import("@/pages/exchanges/ListExchange")))
const CreateExchangePage = Loader(lazy(() => import("@/pages/exchanges/CreateExchange")))
const UpdateExchangePage = Loader(lazy(() => import("@/pages/exchanges/UpdateExchange")))

// Auth
const RegisterPage = Loader(lazy(() => import("@/pages/register.page")))
const LoginPage = Loader(lazy(() => import("@/pages/login.page")))

const VerifyEmailPage = Loader(lazy(() => import("@/pages/verifyEmail.page")))

// produts
const ListProductPage = Loader(lazy(() => import("@/pages/products/ListProduct")))
const CreateProductPage = Loader(lazy(() => import("@/pages/products/CreateProduct")))
const ViewProductPage = Loader(lazy(() => import("@/pages/products/ViewProduct")))
const UpdateProductPage = Loader(lazy(() => import("@/pages/products/UpdateProduct")))

// users
const ListUserPage = Loader(lazy(() => import("@/pages/users/ListUser")))
const UpdateUserPage = Loader(lazy(() => import("@/pages/users/UpdateUser")))
const UserProfilePage = Loader(lazy(() => import("@/pages/users/ViewUserProfile")))

// Me
const ManagementUserProfilePage = Loader(lazy(() => import("@/pages/me/ManagementUserProfile")))

// brands
const ListBrandPage = Loader(lazy(() => import("@/pages/brands/ListBrand")))
const CreateBrandPage = Loader(lazy(() => import("@/pages/brands/CreateBrand")))
const UpdateBrandPage = Loader(lazy(() => import("@/pages/brands/UpdateBrand")))

// categories
const ListCategoryPage = Loader(lazy(() => import("@/pages/categories/ListCategory")))
const CreateCategoryPage = Loader(lazy(() => import("@/pages/categories/CreateCategory")))
const UpdateCategoryPage = Loader(lazy(() => import("@/pages/categories/UpdateCategory")))

// sales categories
const ListSalesCategoryPage = Loader(lazy(() => import("@/pages/salesCategories/ListSalesCategory")))
const CreateSalesCategoryPage = Loader(lazy(() => import("@/pages/salesCategories/CreateSalesCategory")))
const UpdateSalesCategoryPage = Loader(lazy(() => import("@/pages/salesCategories/UpdateSalesCategory")))


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
            path: "overview",
            element: <Navigate to="/" />
          },
          {
            path: "home",
            element: <Navigate to="/" />
          },

          {
            path: "me",
            loader: meProfileLoader,
            Component: ManagementUserProfilePage
          },

          /// ACCESS LOGS
          {
            path: "access-logs",
            loader: accessLogsPermissionsLoader,
            Component: ListAccessLogPage
          },

          /// USER ADDRESS ROUTES
          {
            path: "addresses",
            loader: userAddressPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/addresses/list" />
              },
              {
                path: "list",
                Component: ListUserAddressPage
              },
              {
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner", "User"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateUserAddressPage
                  },
                  {
                    path: "update/:userAddressId",
                    Component: UpdateUserAddressPage
                  }
                ]
              },
            ]
          },

          /// CITIES ROUTES
          {
            path: "cities",
            loader: cityPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/cities/list" />
              },
              {
                path: "list",
                Component: ListCityPage
              },
              {
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateCityPage
                  },
                  {
                    path: "update/:cityId",
                    Component: UpdateCityPage
                  }
                ]
              },
            ]
          },

          /// REGIONS ROUTES
          {
            path: "regions",
            loader: regionPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/regions/list" />
              },
              {
                path: "list",
                Component: ListRegionPage
              },
              {
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateRegionPage
                  },
                  {
                    path: "update/:regionId",
                    Component: UpdateRegionPage
                  }
                ]
              },
            ]
          },

          /// ORDERS ROUTES
          {
            path: "orders",
            loader: orderPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/orders/list" />
              },
              {
                path: "list",
                Component: ListOrderPage
              },
              {
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateOrderPage
                  },
                  {
                    path: "update/:orderId",
                    Component: UpdateOrderPage
                  }
                ]
              },
            ]
          },

          /// COUPONS ROUTES
          {
            path: "coupons",
            loader: couponPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/coupons/list" />
              },
              {
                path: "list",
                Component: ListCouponPage
              },
              {
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateCouponPage
                  },
                  {
                    path: "update/:couponId",
                    Component: UpdateCouponPage
                  }
                ]
              },
            ]
          },

          /// EXCHANGES ROUTES
          {
            path: "exchanges",
            loader: exchangePermissionsLoader,
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
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateExchangePage
                  },
                  {
                    path: "update/:exchangeId",
                    Component: UpdateExchangePage
                  }
                ]
              },
            ]
          },


          /// USER ROUTES
          {
            path: "users",
            loader: userPermissionsLoader,
            children: [
              {
                path: "",
                element: <Navigate to="/brands/list" />
              },
              {
                path: "list",
                Component: ListUserPage
              },
              {
                path: "change-role/:userId",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "",
                    Component: UpdateUserPage
                  }
                ]
              },
            ]
          },


          /// BRAND ROUTES
          {
            path: "brands",
            loader: brandPermissionsLoader,
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
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateBrandPage
                  },
                  {
                    path: "update/:brandId",
                    Component: UpdateBrandPage
                  }
                ]
              },
            ]
          },

          /// SALES-CATEGORY ROUTES
          {
            path: "sales-categories",
            loader: salesCategoryPermissionsLoader,
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
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateSalesCategoryPage
                  },
                  {
                    path: "update/:salesCategoryId",
                    Component: UpdateSalesCategoryPage
                  }
                ]
              },
            ]
          },

          /// CATEGORY ROUTES
          {
            path: "categories",
            loader: categoryPermissionsLoader,
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
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateCategoryPage
                  },
                  {
                    path: "update/:categoryId",
                    Component: UpdateCategoryPage
                  },
                ]
              },
            ]
          },

          /// PRODUCT ROUTES
          {
            path: "products",
            loader: productPermissionsLoader,
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
                path: "detail/:productId",
                Component: ViewProductPage
              },
              {
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateProductPage
                  },
                  {
                    path: "update/:productId",
                    Component: UpdateProductPage
                  }
                ]
              },
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

      /// PROFILE ROUTES
      {
        path: "profile",
        Component: SlidebarLayout,
        children: [
          {
            path: "detail/:username",
            Component: UserProfilePage,
          },
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

  {
    path: "verify-email/:verifyEmailCode",
    Component: BaseLayout,
    ErrorBoundary,
    children: [
      {
        path: "",
        Component: VerifyEmailPage
      }
    ]
  }
])


export default routes
