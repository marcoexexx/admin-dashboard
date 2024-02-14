import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { Pagination } from "@/services/types";
import { UserFilter } from "@/context/user";
import { CacheKey, Resource } from "@/context/cacheKey";
import { useQuery } from "@tanstack/react-query";
import { getUsersFn } from "@/services/usersApi";


export function useGetUsers({
  filter,
  pagination,
  include,
}: {
  filter?: UserFilter["fields"],
  include?: UserFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: [Resource.User, { filter, pagination, include } ] as CacheKey<"users">["list"],
    queryFn: args => getUsersFn(args, { 
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

