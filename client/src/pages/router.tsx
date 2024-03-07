import { Navigate, createBrowserRouter } from "react-router-dom";
import { BaseLayout, SlidebarLayout } from "@/layouts";
import { CacheResource } from "@/context/cacheKey";
import { lazy } from "react";
import { meProfileLoader } from "@/pages/me/ManagementUserProfile";

import Loader from "./loader";
import ErrorBoundaryRouter from "@/components/ErrorBoundaryRouter";


const HomePage = Loader(lazy(() => import("@/pages/home")))

const CheckoutPage = Loader(lazy(() => import("@/pages/checkout")))

// Pickup address
const ListPickupAddressHistoryPage = Loader(lazy(() => import("@/pages/pickupHistory/ListPickupHistory")))
const CreatePickupAddressHistoryPage = Loader(lazy(() => import("@/pages/pickupHistory/CreatePickupAddress")))

// Status
const Status404Page = Loader(lazy(() => import("@/pages/status404.page")))
const StatusUnauthorizedPage = Loader(lazy(() => import("@/pages/unauthorized.page")))

// shopowner
const ListShopownerPage = Loader(lazy(() => import("@/pages/shopowners/ListShopowner")))
const CreateShopownerPage = Loader(lazy(() => import("@/pages/shopowners/CreateShopowner")))
const UpdateShopownerPage = Loader(lazy(() => import("@/pages/shopowners/UpdateShopowner")))

// roles
const ListRolePage = Loader(lazy(() => import("@/pages/roles/ListRole")))
const CreateRolePage = Loader(lazy(() => import("@/pages/roles/CreateRole")))
const UpdateRolePage = Loader(lazy(() => import("@/pages/roles/UpdateRole")))

// permissions
const ListPermissionPage = Loader(lazy(() => import("@/pages/permissions/ListPermission")))
const CreatePermissionPage = Loader(lazy(() => import("@/pages/permissions/CreatePermission")))
const UpdatePermissionPage = Loader(lazy(() => import("@/pages/permissions/UpdatePermission")))

// potential-orders
const ListPotentialOrderPage = Loader(lazy(() => import("@/pages/potentialOrders/ListPotentialOrder")))
const CreatePotentialOrderPage = Loader(lazy(() => import("@/pages/potentialOrders/CreatePotentialOrder")))
const UpdatePotentialOrderPage = Loader(lazy(() => import("@/pages/potentialOrders/UpdatePotentialOrder")))

// user-address
const ListUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/ListUserAddress")))
const CreateUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/CreateUserAddress")))
const UpdateUserAddressPage = Loader(lazy(() => import("@/pages/userAddress/UpdateUserAddress")))


const ListAccessLogPage = Loader(lazy(() => import("@/pages/accessLogs/ListAccessLogs")))
const ListAuditLogPage = Loader(lazy(() => import("@/pages/auditLogs/ListAuditLogs")))

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
    ErrorBoundary: ErrorBoundaryRouter,
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

          /// PICKUP ADDRESS
          {
            path: CacheResource.PickupAddress,
            children: [
              {
                path: "",
                Component: ListPickupAddressHistoryPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.PickupAddress}`} />
              },
              {
                path: "",
                children: [
                  {
                    path: "create",
                    Component: CreatePickupAddressHistoryPage
                  },
                  // {
                  //   path: "update/:pickupAddressId",
                  //   Component: UpdatePotentialOrderPage
                  // }
                ]
              },
            ]
          },

          /// ACCESS LOGS
          {
            path: CacheResource.AccessLog,
            Component: ListAccessLogPage
          },

          /// AUDIT LOGS
          {
            path: CacheResource.AuditLog,
            Component: ListAuditLogPage
          },

          /// ROLES ROUTES
          {
            path: CacheResource.Role,
            children: [
              {
                path: "",
                Component: ListRolePage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Role}`} />
              },
              {
                path: "",
                children: [
                  {
                    path: "create",
                    Component: CreateRolePage
                  },
                  {
                    path: "update/:roleId",
                    Component: UpdateRolePage
                  }
                ]
              },
            ]
          },

          /// SHOPOWNERS ROUTES
          {
            path: CacheResource.Shopowner,
            children: [
              {
                path: "",
                Component: ListShopownerPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Shopowner}`} />
              },
              {
                path: "",
                children: [
                  {
                    path: "create",
                    Component: CreateShopownerPage
                  },
                  {
                    path: "update/:shopownerId",
                    Component: UpdateShopownerPage
                  }
                ]
              },
            ]
          },

          /// PERMISSIONS ROUTES
          {
            path: CacheResource.Permission,
            children: [
              {
                path: "",
                Component: ListPermissionPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Permission}`} />
              },
              {
                path: "",
                children: [
                  {
                    path: "create",
                    Component: CreatePermissionPage
                  },
                  {
                    path: "update/:permisisonId",
                    Component: UpdatePermissionPage
                  }
                ]
              },
            ]
          },

          /// POTENTIAL ORDERS ROUTES
          {
            path: CacheResource.PotentialOrder,
            children: [
              {
                path: "",
                Component: ListPotentialOrderPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.PotentialOrder}`} />
              },
              {
                path: "",
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
            path: CacheResource.UserAddress,
            children: [
              {
                path: "",
                Component: ListUserAddressPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.UserAddress}`} />
              },
              {
                path: "",
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
            path: CacheResource.Township,
            children: [
              {
                path: "",
                Component: ListTownshipPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Township}`} />
              },
              {
                path: "",
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
            path: CacheResource.Region,
            children: [
              {
                path: "",
                Component: ListRegionPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Region}`} />
              },
              {
                path: "",
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
            path: CacheResource.Order,
            children: [
              {
                path: "",
                Component: ListOrderPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Order}`} />
              },
              {
                path: "",
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
            path: CacheResource.Coupon,
            children: [
              {
                path: "",
                Component: ListCouponPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Coupon}`} />
              },
              {
                path: "",
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
            path: CacheResource.Exchange,
            children: [
              {
                path: "",
                Component: ListExchangePage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Exchange}`} />
              },
              {
                path: "",
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
            path: CacheResource.User,
            children: [
              {
                path: "",
                Component: ListUserPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.User}`} />
              },
              {
                path: "update/:userId",
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
            path: CacheResource.Brand,
            children: [
              {
                path: "",
                Component: ListBrandPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Brand}`} />
              },
              {
                path: "",
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
            path: CacheResource.SalesCategory,
            children: [
              {
                path: "",
                Component: ListSalesCategoryPage
              },
              {
                path: "list",
                element: <Navigate to={`${CacheResource.SalesCategory}`} />
              },
              {
                path: "",
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
            path: CacheResource.Category,
            children: [
              {
                path: "",
                Component: ListCategoryPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Category}`} />
              },
              {
                path: "",
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
            path: CacheResource.Product,
            children: [
              {
                path: "",
                Component: ListProductPage
              },
              {
                path: "list",
                element: <Navigate to={`/${CacheResource.Product}`} />
              },
              {
                path: "detail/:productId",
                Component: ViewProductPage
              },
              {
                path: "",
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
            Component: ErrorBoundaryRouter
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
    ErrorBoundary: ErrorBoundaryRouter,
    children: [
      {
        path: "",
        Component: VerifyEmailPage
      }
    ]
  }
])


export default routes
