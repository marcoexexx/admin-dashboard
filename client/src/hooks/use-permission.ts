import { QueryFunction, useQuery } from "@tanstack/react-query"
import { useStore } from "."
import { PermissionsResponse } from "@/services/types"


type ExtractPerm<T extends string> = T extends `${infer P}-permissions` ? P : never

type PermissionKey = 
  | "user-permissions"
  | "exchange-permissions"
  | "category-permissions"
  | "sales-category-permissions"
  | "brand-permissions"
  | "product-permissions"
  | "order-permissions"
  | "access-log-permissions"
  | "coupon-permissions"
  | "region-permissions"

interface Args {
  key: PermissionKey,
  actions: "create" | "read" | "update" | "delete"
  queryFn?: QueryFunction<PermissionsResponse, PermissionKey[], never> | undefined
}

export function usePermission({key, actions, queryFn}: Args) {
  const { state: {user} } = useStore()

  const role = user?.role || "*"
  const resource = key.split("-")[0] as ExtractPerm<PermissionKey>

  const {
    data: permissions,
    isError,
    isSuccess,
    error
  } = useQuery({
    queryKey: [key],
    queryFn,
    select: (data: PermissionsResponse) => data
  })

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
