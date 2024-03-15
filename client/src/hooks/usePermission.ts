import { useStore } from ".";

import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";
import { OperationAction, Resource } from "@/services/types";

/**
 * usePermission(...) -> Result<(), AppError>
 * @returns undefined
 */
export function usePermission({
  action,
  resource,
}: {
  action: OperationAction;
  resource: Resource;
}): Result<undefined, AppError> {
  const { state: { user } } = useStore();

  if (user?.isSuperuser) return Ok(undefined);

  const isAllowed = user?.role?.permissions?.some(perm => perm.action === action && perm.resource === resource);
  if (isAllowed) return Ok(undefined);

  return Err(AppError.new(AppErrorKind.AccessDeniedError, `Could not access this recouse`));
}
