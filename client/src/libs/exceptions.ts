import { ToString } from "./result"

export const AppErrorKind = {
  InvalidInputError: "InvalidInputError",
  ApiError: "AppError",
  NetworkError: "NetworkError",
  PermissionError: "PermissionError"
} as const
export type AppErrorKind = typeof AppErrorKind[keyof typeof AppErrorKind]


export default class AppError extends Error implements ToString {
  constructor(public kind: AppErrorKind, message?: string) {
    super(`${message}: ${kind}`)
  }

  static new(kind: AppErrorKind, message?: string) {
    return new AppError(kind, message)
  }

  toString(): string {
    return `${this.message}: ${this.kind}`
  }
}
