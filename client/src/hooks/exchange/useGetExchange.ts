import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";
import { ExchangeFilter } from "@/context/exchange";

import { useQuery } from "@tanstack/react-query";
import { getExchangeFn } from "@/services/exchangesApi";


export function useGetExchange({
  id,
  include,
}: {
  id: string | undefined,
  include?: ExchangeFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["exchanges", { id, include }],
    queryFn: args => getExchangeFn(args, { exchangeId: id, include }),
    select: data => data?.exchange
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new(AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

