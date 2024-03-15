import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { ExchangeWhereInput } from "@/context/exchange";
import { ExchangeApiService } from "@/services/exchangesApi";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

const apiService = ExchangeApiService.new();

export function useGetExchanges({
  filter,
  pagination,
  include,
}: {
  filter?: ExchangeWhereInput["where"];
  include?: ExchangeWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.Exchange, { filter, pagination, include }] as CacheKey<"exchanges">["list"],
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
