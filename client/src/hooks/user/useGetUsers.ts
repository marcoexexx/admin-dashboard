import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { UserWhereInput } from "@/context/user";
import { Pagination } from "@/services/types";
import { UserApiService } from "@/services/usersApi";
import { useQuery } from "@tanstack/react-query";

const apiService = UserApiService.new();

export function useGetUsers({
  filter,
  pagination,
  include,
}: {
  filter?: UserWhereInput["where"];
  include?: UserWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.User, { filter, pagination, include }] as CacheKey<"users">["list"],
    queryFn: args =>
      apiService.findMany(args, {
        filter,
        pagination,
        include,
      }),
    select: data => data,
  });

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
