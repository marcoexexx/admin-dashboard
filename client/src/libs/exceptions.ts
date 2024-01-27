interface Cls<T> {
  cls: T
}

class NetworkError extends Error implements Cls<typeof NetworkError> {
  cls: typeof NetworkError = NetworkError

  constructor() {
    super(`NetworkError`)
  }
}

class ApiError extends Error implements Cls<typeof ApiError> {
  cls: typeof ApiError = ApiError

  constructor(message: string, status: number = 500) {
    super(`ApiError: ${status}::${message}`)
  }
}

class InvalidInputError extends Error implements Cls<typeof InvalidInputError> {
  cls: typeof InvalidInputError = InvalidInputError

  constructor(message: string) {
    super(`InvalidInputError: ${message}`)
  }
}

class PermissionError extends Error implements Cls<typeof PermissionError> {
  cls: typeof PermissionError = PermissionError

  constructor() {
    super(`PermissionError: You do not have permission to access this resource.`)
  }
}


export const AppError = {
  InvalidInputError: (message: string) => new InvalidInputError(message),
  ApiError: (message: string, status: number) => new ApiError(message, status),
  NetworkError: new NetworkError(),
  PermissionError: new PermissionError(),
}
export type AppError = typeof AppError[keyof typeof AppError]
