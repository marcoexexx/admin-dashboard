import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { pingFn } from "@/services/pingFn";
import { useQuery } from "@tanstack/react-query";

export function usePing() {
  const query = useQuery({
    queryKey: ["ping"],
    queryFn: pingFn,
  });

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
