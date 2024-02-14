import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { Pagination } from "@/services/types";
import { AuditLogFilter } from "@/context/auditLogs";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogsFn } from "@/services/auditLogsApi";
import { CacheKey, Resource } from "@/context/cacheKey";


export function useGetAuditLogs({
  filter,
  pagination,
  include,
}: {
  filter?: AuditLogFilter["fields"],
  include?: AuditLogFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: [Resource.AuditLog, { filter, pagination, include }] as CacheKey<"audit-logs">["list"],
    queryFn: args => getAuditLogsFn(args, { 
      filter,
      pagination,
      include
    }),
    select: data => data
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

