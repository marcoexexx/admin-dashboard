import { ToString } from "./result";

/**
 * Represents different kinds of application errors.
 */
export const AppErrorKind = {
  InvalidInputError: "InvalidInputError",
  ApiError: "ApiError",
  InvalidAuthSession: "InvalidAuthSession",
  NetworkError: "NetworkError",
  NoDataError: "NoDataError",
  PermissionError: "PermissionError",
  AccessDeniedError: "AccessDeniedError",
  UnderTheMaintenance: "UnderTheMaintenance",
  BlockedUserError: "BlockedUserError",
  ServiceUnavailable: "ServiceUnavailable",
} as const;

/**
 * Represents the specific kind of application error.
 */
export type AppErrorKind = typeof AppErrorKind[keyof typeof AppErrorKind];

/**
 * Represents an application error.
 */
export default class AppError extends Error implements ToString {
  /**
   * Constructs a new instance of the AppError class.
   *
   * @param kind The kind of error.
   * @param message Optional. A message describing the error.
   */
  constructor(public kind: AppErrorKind, message?: string) {
    super(`${message}: ${kind}`);
  }

  /**
   * Creates a new instance of AppError.
   *
   * @param kind The kind of error.
   * @param message Optional. A message describing the error. Defaults to "Unknown error".
   * @returns A new instance of AppError.
   */
  static new(
    kind: AppErrorKind,
    message: string = "Unknown error",
  ): AppError {
    return new AppError(kind, message);
  }

  /**
   * Returns a string representation of the error.
   *
   * @returns A string representing the error.
   */
  toString(): string {
    return `${this.message}: ${this.kind}`;
  }
}
