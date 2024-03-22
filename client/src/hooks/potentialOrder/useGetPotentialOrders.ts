import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { PotentialOrderWhereInput } from "@/context/order";
import { PotentialOrderApiService } from "@/services/potentialOrdersApi";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

const apiService = PotentialOrderApiService.new();

export function useGetPotentialOrders({
  filter,
  pagination,
  include,
}: {
  filter?: PotentialOrderWhereInput["where"];
  include?: PotentialOrderWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.PotentialOrder, {
      filter,
      pagination,
      include,
    }] as CacheKey<
      "potential-orders"
    >["list"],
    queryFn: args =>
      apiService.findMany(args, {
        filter,
        pagination,
        include,
      }),
    select: data => data,
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
