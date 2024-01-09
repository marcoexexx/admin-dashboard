import { queryClient } from "@/components";
import { getBrandPermissionsFn, getCategoryPermissionsFn, getCityPermissionsFn, getExchangePermissionsFn, getProductPermissionsFn, getRegionPermissionsFn, getSalesCategoryPermissionsFn, getUserAddressPermissionsFn, getUserPermissionsFn } from "@/services/permissionsApi";

export async function userPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["user-permissions"],
    queryFn: getUserPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function exchangePermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["exchange-permissions"],
    queryFn: getExchangePermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function categoryPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["category-permissions"],
    queryFn: getCategoryPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function salesCategoryPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["sales-category-permissions"],
    queryFn: getSalesCategoryPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function brandPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["brand-permissions"],
    queryFn: getBrandPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function productPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["product-permissions"],
    queryFn: getProductPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function userAddressPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["address-permissions"],
    queryFn: getUserAddressPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function cityPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["city-permissions"],
    queryFn: getCityPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function regionPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["region-permissions"],
    queryFn: getRegionPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function orderPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["order-permissions"],
    queryFn: getProductPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function accessLogsPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["access-log-permissions"],
    queryFn: getProductPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}

export async function  couponPermissionsLoader() {
  return queryClient.fetchQuery({
    queryKey: ["coupon-permissions"],
    queryFn: getProductPermissionsFn,

    staleTime: 1000 * 60 * 60 * 60 * 24
  })
}
