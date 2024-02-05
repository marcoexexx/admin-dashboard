import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { Pagination } from "@/services/types";
import { ExchangeFilter } from "@/context/exchange";
import { useQuery } from "@tanstack/react-query";
import { getExchangesFn } from "@/services/exchangesApi";


export function useGetExchanges({
  filter,
  pagination,
  include,
}: {
  filter?: ExchangeFilter["fields"],
  include?: ExchangeFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["exchanges", { filter, pagination, include } ],
    queryFn: args => getExchangesFn(args, { 
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

