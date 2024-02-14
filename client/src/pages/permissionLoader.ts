import { PermissionKey } from "@/context/cacheKey";
import { queryClient } from "@/components";
import { getAccessLogsPermissionsFn, getAuditLogsPermissionsFn, getBrandPermissionsFn, getCategoryPermissionsFn, getCouponsPermissionsFn, getDashboardPermissionsFn, getExchangePermissionsFn, getOrderPermissionsFn, getPickupAddressPermissionsFn, getPotentialOrderPermissionsFn, getProductPermissionsFn, getRegionPermissionsFn, getSalesCategoryPermissionsFn, getTownshipPermissionsFn, getUserAddressPermissionsFn, getUserPermissionsFn } from "@/services/permissionsApi";


export async function dashboardPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Dashboard,
    queryFn: getDashboardPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function userPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.User,
    queryFn: getUserPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function exchangePermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Exchange,
    queryFn: getExchangePermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function categoryPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Category,
    queryFn: getCategoryPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function salesCategoryPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.SalesCategory,
    queryFn: getSalesCategoryPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function brandPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Brand,
    queryFn: getBrandPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function productPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Product,
    queryFn: getProductPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function potentialOrderPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.PotentialOrder,
    queryFn: getPotentialOrderPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function userAddressPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.UserAddress,
    queryFn: getUserAddressPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function townshipPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Township,
    queryFn: getTownshipPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function regionPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Region,
    queryFn: getRegionPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function orderPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Order,
    queryFn: getOrderPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function auditLogsPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.AuditLog,
    queryFn: getAuditLogsPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function pickupAddressPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.PickupAddress,
    queryFn: getPickupAddressPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function accessLogsPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.AccessLog,
    queryFn: getAccessLogsPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function  couponPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: PermissionKey.Coupon,
    queryFn: getCouponsPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}
