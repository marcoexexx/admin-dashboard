import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CategoryWhereInput } from "@/context/category";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { CategoryApiService } from "@/services/categoryApi";
import { useQuery } from "@tanstack/react-query";


const apiService = CategoryApiService.new()


export function useGetCategory({
  id,
  include,
}: {
  id: string | undefined,
  include?: CategoryWhereInput["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Category, { id, include }] as CacheKey<"categories">["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.category
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

