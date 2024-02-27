import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/services/types";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { PotentialOrderApiService } from "@/services/potentialOrdersApi";
import { PotentialOrderWhereInput } from "@/context/order";


const apiService = PotentialOrderApiService.new()


export function useGetPotentialOrders({
  filter,
  pagination,
  include,
}: {
  filter?: PotentialOrderWhereInput["where"],
  include?: PotentialOrderWhereInput["include"],
  pagination: Pagination,
}) {
  const query = useQuery({
    queryKey: [CacheResource.PotentialOrder, { filter, pagination, include }] as CacheKey<"potential-orders">["list"],
    queryFn: args => apiService.findMany(args, {
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


