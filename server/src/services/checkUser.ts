import { UserWithRole } from "../type";

import AppError, { StatusCode } from "../utils/appError";
import Result, { Err, Ok } from "../utils/result";

export function checkUser(user?: UserWithRole): Result<UserWithRole, AppError> {
  if (!user) return Err(AppError.new(StatusCode.BadRequest, `Session has expired or user doesn't exist`));
  return Ok(user);
}
