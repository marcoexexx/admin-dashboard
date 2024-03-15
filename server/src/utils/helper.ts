import { StatusCode } from "../utils/appError";

/**
 * Error Test
 */
export async function mayError(): Promise<string> {
  return Promise.reject(new Error("Failed: this is error message from mayError"));
}

export function HttpResponse<E extends unknown>(status: StatusCode, message: string, error?: E) {
  return { status, message, error };
}

export function HttpListResponse<T>(results: Array<T>, count = results.length) {
  return { status: StatusCode.OK, results, count, error: undefined };
}

export function HttpDataResponse<T>(result: T) {
  return { status: StatusCode.OK, error: undefined, ...result };
}
