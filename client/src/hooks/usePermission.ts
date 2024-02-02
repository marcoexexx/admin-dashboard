import { QueryFunction, useSuspenseQuery } from "@tanstack/react-query"
import { PermissionsResponse } from "@/services/types"
import { useMe } from "."

import AppError, { AppErrorKind } from "@/libs/exceptions"


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
  queryFn?: QueryFunction<PermissionsResponse, PermissionKey[], never> | undefined
}

export function usePermission({key, actions, queryFn}: Args) {
  const userQuery = useMe({})
  const permissionsQuery = useSuspenseQuery({
    queryKey: [key],
    queryFn,
    select: (data: PermissionsResponse) => data
  })

  // Extraction
  const user = userQuery.try_data.ok_or_throw()
  const permissions = permissionsQuery.data

  if (permissionsQuery.isError && permissionsQuery.error) throw AppError.new(AppErrorKind.ApiError, permissionsQuery.error.message)

  const role = user?.role || "*"
  const resource = key.split("-")[0] as ExtractPerm<PermissionKey>


  if (permissions?.label !== resource && !userQuery.isSuccess) return false

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
