/**
 * Error Test
 */
export async function mayError(): Promise<string> {
  return Promise.reject(new Error("Failed: this is error message from mayError"))
}


export function HttpResponse<E extends unknown>(status: number, message: string, error?: E) {
  return { status, message, error }
}

export function HttpListResponse<T>(results: Array<T>, count = results.length) {
  return { status: 200, results, count, error: undefined }
}

export function HttpDataResponse<T>(result: T) {
  return { status: 200, error: undefined, ...result }
}
