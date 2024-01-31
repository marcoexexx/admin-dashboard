import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { Pagination } from "@/services/types";
import { AccessLogFilter } from "@/context/accessLog";
import { useQuery } from "@tanstack/react-query";
import { getAccessLogsFn } from "@/services/accessLogsApi";


export function useGetAccessLogs({
  filter,
  pagination,
  include,
}: {
  filter?: AccessLogFilter["fields"],
  include?: any,  // TODO: type fix
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["access-logs", { filter, pagination, include }],
    queryFn: args => getAccessLogsFn(args, { 
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

