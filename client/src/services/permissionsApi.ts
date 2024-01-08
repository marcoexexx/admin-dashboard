import { PermissionsResponse, QueryOptionArgs } from "./types"
import { authApi } from "./authApi"


export async function getUserPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/users", {
    ...opt,
  })
  return data
}


export async function getRegionPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/regions", {
    ...opt,
  })
  return data
}


export async function getProductPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/products", {
    ...opt,
  })
  return data
}


export async function getCategoryPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/category", {
    ...opt,
  })
  return data
}


export async function getSalesCategoryPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/sales-category", {
    ...opt,
  })
  return data
}


export async function getCityPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/cities", {
    ...opt,
  })
  return data
}


export async function getBrandPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/brands", {
    ...opt,
  })
  return data
}


export async function getExchangePermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/exchanges", {
    ...opt,
  })
  return data
}


export async function getOrderPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/orders", {
    ...opt,
  })
  return data
}


export async function getAccessLogsPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/access-logs", {
    ...opt,
  })
  return data
}


export async function getCouponsPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/coupons", {
    ...opt,
  })
  return data
}
