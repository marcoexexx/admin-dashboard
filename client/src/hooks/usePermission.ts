import { QueryFunction, useQuery } from "@tanstack/react-query"
import { PermissionsResponse } from "@/services/types"
import { getMeFn } from "@/services/authApi"


type ExtractPerm<T extends string> = T extends `${infer P}-permissions` ? P : never

type PermissionKey = 
  | "dashboard-permissions"
  | "user-permissions"
  | "exchange-permissions"
  | "category-permissions"
  | "sales-category-permissions"
  | "brand-permissions"
  | "product-permissions"
  | "order-permissions"
  | "potential-order-permissions"
  | "access-log-permissions"
  | "coupon-permissions"
  | "region-permissions"
  | "township-permissions"
  | "address-permissions"
  | "access-logs-permissions"
  | "audit-logs-permissions"
  | "pickup-address-permissions"

interface Args {
  key: PermissionKey,
  actions: "create" | "read" | "update" | "delete"
  enabled?: boolean
  queryFn?: QueryFunction<PermissionsResponse, PermissionKey[], never> | undefined
}

export function usePermission({key, actions, enabled, queryFn}: Args) {
  const { data: user, isSuccess: isSuccessUser, isError: isErrorUser, error: errorUser } = useQuery({
    enabled,
    queryKey: ["authUser"],
    queryFn: getMeFn,
    select: data => data.user,
  })

  const role = user?.role || "*"
  const resource = key.split("-")[0] as ExtractPerm<PermissionKey>

  const {
    data: permissions,
    isError: isErrorPermissions,
    isSuccess: isSuccessPermissions,
    error: errorPermissions
  } = useQuery({
    queryKey: [key],
    queryFn,
    select: (data: PermissionsResponse) => data
  })

  // const isLoading = isLoadingUser || isLoadingPemissions
  const isSuccess = isSuccessUser || isSuccessPermissions
  const isError = isErrorUser || isErrorPermissions
  const error = errorUser || errorPermissions

  if (permissions?.label !== resource && !isSuccess) return false
  if ((isError && error)) {
    console.error(error.message)
    return false
  }

  if (actions === "create" 
    && (permissions?.permissions?.createAllowedRoles?.includes(role) || permissions?.permissions?.createAllowedRoles?.includes("*"))
  ) return true
  if (actions === "read" 
    && (permissions?.permissions?.readAllowedRoles?.includes(role) || permissions?.permissions?.readAllowedRoles?.includes("*"))
  ) return true
  if (actions === "update" 
    && (permissions?.permissions?.updateAllowedRoles?.includes(role) || permissions?.permissions?.updateAllowedRoles?.includes("*"))
  ) return true
  if (actions === "delete" 
    && (permissions?.permissions?.deleteAllowedRoles?.includes(role) || permissions?.permissions?.deleteAllowedRoles?.includes("*"))
  ) return true

  return false
}
