import { authApi } from "./authApi"


export async function getUserPermissionsFn(opt: QueryOptionArgs) {
  const { data } = await authApi.get<PermissionsResponse>("/permissions/users", {
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
