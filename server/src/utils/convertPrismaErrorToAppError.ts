import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import AppError, { StatusCode } from "./appError"
import logging from "../middleware/logging/logging"


export function convertPrismaErrorToAppError(err: PrismaClientKnownRequestError): AppError {
  switch (err.code) {
    case "P2002": return AppError.new(StatusCode.BadRequest, `Already exists`)

    case "P2014": {
      const { relation_name, model_a_name, model_b_name } = err.meta as any
      return AppError.new(StatusCode.BadRequest, `Cannot delete the ${relation_name} because it is associated with one or more ${model_a_name}s. Please remove the association with ${model_a_name}s before deleting the ${model_b_name}.`)
    }

    case "P2025": return AppError.new(StatusCode.BadRequest, `Not found`)

    default: {
      logging.error(`Code: ${err.code}`)
      console.error(err.meta)
      return AppError.new(StatusCode.BadRequest, `Unknown resource error`)
    }
  }
}

