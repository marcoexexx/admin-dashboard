import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { OrderWhereInput } from "@/context/order";
import { OrderApiService } from "@/services/orderApi";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

const apiService = OrderApiService.new();

export function useGetOrders({
  filter,
  pagination,
  include,
}: {
  filter?: OrderWhereInput["where"];
  include?: OrderWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.Order, { filter, pagination, include }] as CacheKey<"orders">["list"],
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
