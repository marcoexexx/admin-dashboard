import { ErrorBoundary, PagePermission } from "@/components";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Loader from "./loader";
import { lazy } from "react";
import { BaseLayout, SlidebarLayout } from "@/layouts";
import { accessLogsPermissionsLoader, brandPermissionsLoader, categoryPermissionsLoader, couponPermissionsLoader, exchangePermissionsLoader, orderPermissionsLoader, potentialOrderPermissionsLoader, productPermissionsLoader, regionPermissionsLoader, salesCategoryPermissionsLoader, townshipPermissionsLoader, userAddressPermissionsLoader, userPermissionsLoader } from "./permissionLoader";
import { meProfileLoader } from "@/pages/me/ManagementUserProfile";


const HomePage = Loader(lazy(() => import("@/pages/home")))

const CheckoutPage = Loader(lazy(() => import("@/pages/checkout")))

// Status
const Status404Page = Loader(lazy(() => import("@/pages/status404.page")))
const StatusUnauthorizedPage = Loader(lazy(() => import("@/pages/unauthorized.page")))

// potential-orders
const ListPotentialOrderPage = Loader(lazy(() => import("@/pages/potentialOrders/ListPotentialOrder")))
const CreatePotentialOrderPage = Loader(lazy(() => import("@/pages/potentialOrders/CreatePotentialOrder")))
const UpdatePotentialOrderPage = Loader(lazy(() => import("@/pages/potentialOrders/UpdatePotentialOrder")))

// user-address
const ListUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/ListUserAddress")))
const CreateUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/CreateUserAddress")))
const UpdateUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/UpdateUserAddress")))


const ListAccessLogPage = Loader(lazy(() => import("@/pages/accessLogs/ListAccessLogs")))

// townships
const ListTownshipPage = Loader(lazy(() => import("@/pages/townships/ListTownship")))
const CreateTownshipPage = Loader(lazy(() => import("@/pages/townships/CreateTownship")))
const UpdateTownshipPage = Loader(lazy(() => import("@/pages/townships/UpdateTownship")))

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
            path: "checkout",
            Component: CheckoutPage
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

          /// POTENTIAL ORDERS ROUTES
          {
            path: "potential-orders",
            loader: potentialOrderPermissionsLoader,
            children: [
              {
                path: "",
                Component: ListPotentialOrderPage
              },
              {
                path: "list",
                element: <Navigate to="/potential-orders" />
              },
              {
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner", "User"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreatePotentialOrderPage
                  },
                  {
                    path: "update/:potentialOrderId",
                    Component: UpdatePotentialOrderPage
                  }
                ]
              },
            ]
          },

          /// USER ADDRESS ROUTES
          {
            path: "addresses",
            loader: userAddressPermissionsLoader,
            children: [
              {
                path: "",
                Component: ListUserAddressPage
              },
              {
                path: "list",
                element: <Navigate to="/addresses" />
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

          /// TOWNSHIPS ROUTES
          {
            path: "townships",
            loader: townshipPermissionsLoader,
            children: [
              {
                path: "",
                Component: ListTownshipPage
              },
              {
                path: "list",
                element: <Navigate to="/townships" />
              },
              {
                path: "",
                element: <PagePermission allowedRoles={["Admin", "Shopowner"]} />,
                children: [
                  {
                    path: "create",
                    Component: CreateTownshipPage
                  },
                  {
                    path: "update/:townshipId",
                    Component: UpdateTownshipPage
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
                Component: ListRegionPage
              },
              {
                path: "list",
                element: <Navigate to="/regions" />
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
                Component: ListOrderPage
              },
              {
                path: "list",
                element: <Navigate to="/orders" />
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
                Component: ListCouponPage
              },
              {
                path: "list",
                element: <Navigate to="/coupons" />
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
                Component: ListExchangePage
              },
              {
                path: "list",
                element: <Navigate to="/exchanges" />
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
                Component: ListUserPage
              },
              {
                path: "list",
                element: <Navigate to="/users" />
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
                Component: ListBrandPage
              },
              {
                path: "list",
                element: <Navigate to="/brands" />
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
                Component: ListSalesCategoryPage
              },
              {
                path: "list",
                element: <Navigate to="/sales-categories" />
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
                Component: ListCategoryPage
              },
              {
                path: "list",
                element: <Navigate to="/categories" />
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
                Component: ListProductPage
              },
              {
                path: "list",
                element: <Navigate to="/products" />
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
