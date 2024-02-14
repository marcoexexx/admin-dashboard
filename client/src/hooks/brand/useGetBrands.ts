import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { getBrandsFn } from "@/services/brandsApi";
import { Pagination } from "@/services/types";
import { BrandFilter } from "@/context/brand";
import { CacheKey, Resource } from "@/context/cacheKey";


export function useGetBrands({
  filter,
  pagination,
  include,
}: {
  filter?: BrandFilter["fields"],
  include?: BrandFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: [Resource.Brand, { filter, pagination, include } ] as CacheKey<"brands">["list"],
    queryFn: args => getBrandsFn(args, { 
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

