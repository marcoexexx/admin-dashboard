import { useStore } from "."

import Result, { Err, Ok } from "@/libs/result"
import AppError, { AppErrorKind } from "@/libs/exceptions"
import { OperationAction, Resource } from "@/services/types"


/**
 * usePermission(...) -> Result<(), AppError>
 */
export function usePermission({
  action,
  resource
}: {
  action: OperationAction,
  resource: Resource
}): Result<boolean, AppError> {
  const { state: { user } } = useStore()

  if (user?.isSuperuser) return Ok(true)

  const isAllowed = user?.role?.permissions?.some(perm => perm.action === action && perm.resource === resource)
  if (isAllowed) return Ok(true)

  return Err(AppError.new(AppErrorKind.AccessDeniedError, `Could not access this recouse`))
}
