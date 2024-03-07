import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { ShopownerApiService } from "@/services/shopownersApi";
import { ShopownerProviderWhereInput } from "@/context/shopowner";
import { useQuery } from "@tanstack/react-query";


const apiService = ShopownerApiService.new()


export function useGetShopowner({
  id,
  include,
}: {
  id: string | undefined,
  include?: ShopownerProviderWhereInput["include"]
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Shopowner, { id, include }] as CacheKey<"shopowners">["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.shopowner
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

