import { ToString } from "./result";

export const StatusCode = {
  Continue: 100, // Continue
  SwitchingProtocols: 101, // Switching Protocols
  Processing: 102, // Processing

  OK: 200, // OK
  Created: 201, // Created
  Accepted: 202, // Accepted
  NoContent: 204, // No Content
  ResetContent: 205, // Reset Content

  MovedPermanently: 301, // Moved Permanently
  Found: 302, // Found
  SeeOther: 303, // See Other
  NotModified: 304, // Not Modified
  TemporaryRedirect: 307, // Temporary Redirect

  BadRequest: 400, // Bad Request
  Unauthorized: 401, // Unauthorized
  Forbidden: 403, // Forbidden
  NotFound: 404, // Not Found
  MethodNotAllowed: 405, // Method Not Allowed
  RequestTimeout: 408, // Request Timeout
  Conflict: 409, // Conflict
  Gone: 410, // Gone
  UnsupportedMediaType: 415, // Unsupported Media Type
  UnprocessableEntity: 422, // Unprocessable Entity
  TooManyRequests: 429, // Too Many Requests

  InternalServerError: 500, // Internal Server Error
  NotImplemented: 501, // Not Implemented
  BadGateway: 502, // Bad Gateway
  ServiceUnavailable: 503, // Service Unavailable
  GatewayTimeout: 504, // Gateway Timeout
  InsufficientStorage: 507, // Insufficient Storage
} as const;
export type StatusCode = typeof StatusCode[keyof typeof StatusCode];

export default class AppError extends Error implements ToString {
  isOperational: boolean;

  constructor(public status: StatusCode, message: string) {
    super(message);
    this.name = "AppError";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static new(status: StatusCode = StatusCode.InternalServerError, message: string = "Unknown error") {
    return new AppError(status, message);
  }

  toString(): string {
    return `${this.message}: ${this.status}`;
  }
}
