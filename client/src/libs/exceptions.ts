export class NetworkError extends Error {
  constructor() {
    super(`NetworkError`)
  }
}

export class ApiError extends Error {
  constructor(message: string, status: number = 500) {
    super(`ApiError: ${status}::${message}`)
  }
}

export class InvalidInputError extends Error {
  constructor(message: string) {
    super(`InvalidInputError: ${message}`)
  }
}

export class PermissionError extends Error {
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
