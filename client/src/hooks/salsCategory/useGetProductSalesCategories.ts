import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheResource } from "@/context/cacheKey";
import { useQuery } from "@tanstack/react-query";
import { getProductSaleCategoriesFn } from "@/services/productsApi";


export function useGetProductSalesCategories({
  productId,
}: {
  productId: string | undefined,
  }) {
  const query = useQuery({
    enabled: !!productId,
    queryKey: [CacheResource.ProductSalesCategory],
    queryFn: args => getProductSaleCategoriesFn(args, { productId }),
    select: data => data?.results
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}
