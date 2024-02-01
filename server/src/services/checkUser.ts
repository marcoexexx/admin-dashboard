import { User } from "@prisma/client";
import Result, { Err, Ok } from "../utils/result";
import AppError, { StatusCode } from "../utils/appError";


export function checkUser(user?: User): Result<User, AppError> {
  if (!user) return Err(AppError.new(StatusCode.BadRequest, `Session has expired or user doesn't exist`))
  return Ok(user)
}
