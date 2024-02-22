import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";
import { ProductFilter } from "@/context/product";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { getProductFn } from "@/services/productsApi";
import { useQuery } from "@tanstack/react-query";


export function useGetProduct({
  id,
  include,
}: {
  id: string | undefined,
  include?: ProductFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id ,
    queryKey: [CacheResource.Product, { id, include }] as CacheKey<"products">["detail"],
    queryFn: args => getProductFn(args, { productId: id, include }),
    select: data => data?.product
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}
