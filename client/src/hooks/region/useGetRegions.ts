import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { getRegionsFn } from "@/services/regionsApi";
import { Pagination } from "@/services/types";
import { RegionFilter } from "@/context/region";
import { CacheKey, Resource } from "@/context/cacheKey";


export function useGetRegions({
  filter,
  pagination,
  include,
}: {
  filter?: RegionFilter["fields"],
  include?: RegionFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: [Resource.Region, { filter, pagination, include } ] as CacheKey<"regions">["list"],
    queryFn: args => getRegionsFn(args, { 
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

