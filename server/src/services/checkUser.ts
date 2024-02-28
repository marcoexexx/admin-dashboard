import { UserWithRole } from "../type";

import Result, { Err, Ok } from "../utils/result";
import AppError, { StatusCode } from "../utils/appError";


export function checkUser(user?: UserWithRole): Result<UserWithRole, AppError> {
  if (!user) return Err(AppError.new(StatusCode.BadRequest, `Session has expired or user doesn't exist`))
  return Ok(user)
}
