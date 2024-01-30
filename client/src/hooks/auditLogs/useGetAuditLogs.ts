import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { Pagination } from "@/services/types";
import { AuditLogFilter } from "@/context/auditLogs";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogsFn } from "@/services/auditLogsApi";


export function useGetAuditLogs({
  filter,
  pagination,
  include,
}: {
  filter?: AuditLogFilter["fields"],
  include?: any,  // TODO: type fix
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["audit-logs", { filter }],
    queryFn: args => getAuditLogsFn(args, { 
      filter,
      pagination,
      include
    }),
    select: data => data
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new(AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

