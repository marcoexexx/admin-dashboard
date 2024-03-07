import { useStore } from "."
import { guestUserAccessResources, shopownerAccessResources } from "@/libs/buildInPermission"

import Result, { Err, Ok } from "@/libs/result"
import AppError, { AppErrorKind } from "@/libs/exceptions"
import { OperationAction, Resource } from "@/services/types"


/**
 * usePermission(...) -> Result<(), AppError>
 * @returns undefined
 */
export function usePermission({
  action,
  resource
}: {
  action: OperationAction,
  resource: Resource
}): Result<undefined, AppError> {
  const { state: { user } } = useStore()

  if (user?.isSuperuser) return Ok(undefined)

  if (user?.shopownerProviderId) {
    const isAllowed = [...guestUserAccessResources, ...shopownerAccessResources]?.some(perm => perm.action === action && perm.resource === resource)
    if (isAllowed) return Ok(undefined)
  }

  const isAllowed = user?.role?.permissions?.some(perm => perm.action === action && perm.resource === resource)
  if (isAllowed) return Ok(undefined)

  return Err(AppError.new(AppErrorKind.AccessDeniedError, `Could not access this recouse`))
}
