import AppError, { AppErrorKind } from "@/libs/exceptions"

import { QueryFunction, useSuspenseQuery } from "@tanstack/react-query"
import { PermissionsResponse } from "@/services/types"
import { PermissionKey, Resource } from "@/context/cacheKey"
import { useMe } from "."


interface Args {
  key: PermissionKey,
  fetchUser?: boolean,
  actions: "create" | "read" | "update" | "delete"
  queryFn?: QueryFunction<PermissionsResponse> | undefined
}

export function usePermission({key, actions, fetchUser, queryFn}: Args) {
  const userQuery = useMe({ enabled: fetchUser })
  const permissionsQuery = useSuspenseQuery({
    queryKey: key,
    queryFn,
    select: (data: PermissionsResponse) => data
  })

  // Extraction
  const user = userQuery.try_data.ok_or_throw()
  const permissions = permissionsQuery.data

  if (permissionsQuery.isError && permissionsQuery.error) throw AppError.new(AppErrorKind.ApiError, permissionsQuery.error.message)

  const role = user?.role || "*"
  const resource = key[0].split("-")[0] as Resource


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
