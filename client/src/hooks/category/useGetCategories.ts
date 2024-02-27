import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CategoryWhereInput } from "@/context/category";
import { Pagination } from "@/services/types";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { CategoryApiService } from "@/services/categoryApi";
import { useQuery } from "@tanstack/react-query";


const apiService = CategoryApiService.new()


export function useGetCategories({
  filter,
  pagination,
  include,
}: {
  filter?: CategoryWhereInput["where"],
  include?: CategoryWhereInput["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: [CacheResource.Category, { filter, pagination, include } ] as CacheKey<"categories">["list"],
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

