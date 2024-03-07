import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/services/types";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { ShopownerApiService } from "@/services/shopownersApi";
import { ShopownerProviderWhereInput } from "@/context/shopowner";


const apiService = ShopownerApiService.new()


export function useGetShopowners({
  filter,
  pagination,
  include,
}: {
  filter?: ShopownerProviderWhereInput["where"],
  include?: ShopownerProviderWhereInput["include"],
  pagination: Pagination,
}) {
  const query = useQuery({
    queryKey: [CacheResource.Shopowner, { filter, pagination, include }] as CacheKey<"shopowners">["list"],
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

