import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import logging from "../middleware/logging/logging";
import AppError, { StatusCode } from "./appError";

export function convertPrismaErrorToAppError<E extends Error>(err: E): AppError {
  logging.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    logging.error("Code:", err.code);

    switch (err.code) {
      case "P2002":
        return AppError.new(StatusCode.BadRequest, `Already exists`);

      case "P2014": {
        const { relation_name, model_a_name, model_b_name } = err.meta as any;
        return AppError.new(
          StatusCode.BadRequest,
          `Cannot delete the ${relation_name} because it is associated with one or more ${model_a_name}s. Please remove the association with ${model_a_name}s before deleting the ${model_b_name}.`,
        );
      }

      case "P2018": {
        return AppError.new(StatusCode.BadRequest, `The required connected records were not found`);
      }

      case "P2025":
        return AppError.new(StatusCode.BadRequest, `Not found`);

      default: {
        return AppError.new(StatusCode.BadRequest, `Unknown resource error`);
      }
    }
  }

  if (err instanceof PrismaClientValidationError) {
    logging.error(err.name);
    return AppError.new(
      StatusCode.BadRequest,
      `Invalid input. Please check your request parameters and try again`,
    );
  }

  logging.error(err.name, `Unknown error`);

  return AppError.new(
    (err as any).status || StatusCode.InternalServerError,
    (err as any).message,
  );
}
