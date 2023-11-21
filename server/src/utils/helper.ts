/**
 * Error Test
 */
export async function mayError(): Promise<string> {
  return Promise.reject(new Error("Failed: this is error message from mayError"))
}


export function HttpResponse<E extends unknown>(status: number, message: string, error?: E) {
  return { status, message, error }
}

export function HttpListResponse<T>(results: Array<T>) {
  return { status: 200, results, count: results.length, error: undefined }
}

export function HttpDataResponse<T>(result: T) {
  return { status: 200, error: undefined, ...result }
}
