import { StatusCode } from "../utils/appError";
import getConfig from "./getConfig";

type ListMetaResponse = {
  status?: StatusCode;
  filter?: object;
  include?: object;
  orderBy?: object;
  page: number;
  pageSize: number;
};

type DetailMetaResponse = {
  status?: StatusCode;
  id: string | undefined;
  include?: object;
};

type GenericMetaResponse = {
  status: StatusCode;
  message: string;
};

type MetaResponse =
  | ListMetaResponse
  | GenericMetaResponse
  | DetailMetaResponse;

/**
 * Error Test
 */
export async function mayError(): Promise<string> {
  return Promise.reject(
    new Error("Failed: this is error message from mayError"),
  );
}

export function HttpResponse<E extends unknown>(
  status: StatusCode,
  message: string,
  error?: E,
) {
  const meta: MetaResponse = {
    status,
    message,
  };
  return { error, meta };
}

export function HttpListResponse<T>(
  results: Array<T>,
  count = results.length,
  metadata?: { meta: ListMetaResponse; },
) {
  const meta: ListMetaResponse = {
    status: StatusCode.OK,
    page: getConfig("page"),
    pageSize: getConfig("pageSize"),
    ...(metadata?.meta || {}),
  };
  return {
    results,
    count,
    meta,
    error: undefined,
  };
}

export function HttpDataResponse<
  T extends { [p: string]: { id: string; } | string; },
>(
  result: T,
  metadata?: { meta: DetailMetaResponse; },
) {
  const meta: DetailMetaResponse = {
    id: undefined,
    status: StatusCode.OK,
    ...(metadata?.meta || {}),
  };
  return { error: undefined, ...result, meta };
}
