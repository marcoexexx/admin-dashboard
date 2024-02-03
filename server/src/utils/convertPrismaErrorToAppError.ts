import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import AppError, { StatusCode } from "./appError"


export function convertPrismaErrorToAppError(err: PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case "P2002": return AppError.new(StatusCode.BadRequest, `Already exists`)

    default: return AppError.new(StatusCode.BadRequest, `Unknown resource error`)
  }
}

