import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { AccessLogWhereInput } from "@/context/accessLog";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { AccessLogApiService } from "@/services/accessLogsApi";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

const apiService = AccessLogApiService.new();

export function useGetAccessLogs({
  filter,
  pagination,
  include,
}: {
  filter?: AccessLogWhereInput["where"];
  include?: AccessLogWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.AccessLog, { filter, pagination, include }] as CacheKey<"access-logs">["list"],
    queryFn: args =>
      apiService.findMany(args, {
        filter,
        pagination,
        include,
      }),
    select: data => data,
  });

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
