import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/services/types";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { UserApiService } from "@/services/usersApi";
import { UserWhereInput } from "@/context/user";


const apiService = UserApiService.new()


export function useGetUsers({
  filter,
  pagination,
  include,
}: {
  filter?: UserWhereInput["where"],
  include?: UserWhereInput["include"],
  pagination: Pagination,
}) {
  const query = useQuery({
    queryKey: [CacheResource.User, { filter, pagination, include }] as CacheKey<"users">["list"],
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

