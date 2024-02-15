import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { PriceUnit } from "@/components/content/products/forms";
import { CacheResource } from "@/context/cacheKey";
import { useQuery } from "@tanstack/react-query";
import { getExchangesFn } from "@/services/exchangesApi";


export function useGetExchangeByLatestUnit(unit: PriceUnit) {
  const query = useQuery({
    queryKey: [CacheResource.Exchange, "latest", unit],
    queryFn: args => getExchangesFn(args, {
      filter: {
        to: "MMK",
        from: unit,
      },
      pagination: {
        page: 1,
        pageSize: 1
      }
    }),
    // queryFn: () => Promise.reject(new Error("Some error")),
    select: data => data.results
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

