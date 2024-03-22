import { ExchangeWhereInput } from "@/context/exchange";
import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { ExchangeApiService } from "@/services/exchangesApi";
import { useQuery } from "@tanstack/react-query";

const apiService = ExchangeApiService.new();

export function useGetExchange({
  id,
  include,
}: {
  id: string | undefined;
  include?: ExchangeWhereInput["include"];
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Exchange, { id, include }] as CacheKey<
      "exchanges"
    >["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.exchange,
  });

  const try_data: Result<typeof query.data, AppError> =
    !!query.error && query.isError
      ? Err(
        AppError.new(
          (query.error as any).kind || AppErrorKind.ApiError,
          query.error.message,
        ),
      )
      : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
