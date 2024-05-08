import { useStore } from ".";

import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";
import { OperationAction, Resource } from "@/services/types";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

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
  const [cookies] = useCookies(["logged_in"]);
  const { state: { user } } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.logged_in) navigate("/auth/login");
  }, [cookies.logged_in]);

  if (user?.isSuperuser) return Ok(undefined);

  const isAllowed = user?.role?.permissions?.some(perm =>
    perm.action === action && perm.resource === resource
  );
  if (isAllowed) return Ok(undefined);

  return Err(
    AppError.new(
      AppErrorKind.AccessDeniedError,
      `Could not access this recouse`,
    ),
  );
}
