import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/services/types";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { SalesCategoryApiService } from "@/services/salesCategoryApi";
import { SalesCategoryWhereInput } from "@/context/salesCategory";


const apiService = SalesCategoryApiService.new()


export function useGetSalesCategories({
  filter,
  pagination,
  include,
}: {
  filter?: SalesCategoryWhereInput["where"],
  include?: SalesCategoryWhereInput["include"],
  pagination: Pagination,
}) {
  const query = useQuery({
    queryKey: [CacheResource.SalesCategory, { filter, pagination, include }] as CacheKey<"sales-categories">["list"],
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

