import { queryClient } from "@/components";
import { getBrandPermissionsFn, getCategoryPermissionsFn, getExchangePermissionsFn, getProductPermissionsFn, getSalesCategoryPermissionsFn, getUserPermissionsFn } from "@/services/permissionsApi";

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
    queryKey: ["sales-ategor-permissions"],
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
