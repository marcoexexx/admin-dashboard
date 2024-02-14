import { ToString } from "./result"

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
  ServiceUnavailable: "ServiceUnavailable"
} as const
export type AppErrorKind = typeof AppErrorKind[keyof typeof AppErrorKind]


export default class AppError extends Error implements ToString {
  constructor(public kind: AppErrorKind, message?: string) {
    super(`${message}: ${kind}`)
  }

  static new(kind: AppErrorKind, message: string = "Unknown error") {
    return new AppError(kind, message)
  }

  toString(): string {
    return `${this.message}: ${this.kind}`
  }
}
