import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { UserApiService } from "@/services/usersApi";
import { UserWhereInput } from "@/context/user";
import { useQuery } from "@tanstack/react-query";


const apiService = UserApiService.new()


export function useGetUser({
  id,
  include,
}: {
  id: string | undefined,
  include?: UserWhereInput["include"],
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.User, { id, include }] as CacheKey<"users">["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.user
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}


export function useGetUserByUsername({
  username,
  include,
}: {
  username: string | undefined,
  include?: UserWhereInput["include"],
}) {
  const query = useQuery({
    enabled: !!username,
    queryKey: [CacheResource.User, { username, include }],
    queryFn: args => apiService.findProfile(args, { username }),
    select: data => data?.user
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}


