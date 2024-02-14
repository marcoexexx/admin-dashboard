import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { Pagination } from "@/services/types";
import { TownshipFilter } from "@/context/township";
import { CacheKey, Resource } from "@/context/cacheKey";
import { getTownshipsFn } from "@/services/townshipsApi";
import { useQuery } from "@tanstack/react-query";


export function useGetTownships({
  filter,
  pagination,
  include,
}: {
  filter?: TownshipFilter["fields"],
  include?: TownshipFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: [Resource.Township, { filter, pagination, include } ] as CacheKey<"townships">["list"],
    queryFn: args => getTownshipsFn(args, { 
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

