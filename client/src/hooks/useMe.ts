import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheResource } from "@/context/cacheKey";
import { UserWhereInput } from "@/context/user";
import { getMeFn } from "@/services/authApi";
import { UserResponse } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useMe({ enabled = true, include }: { enabled?: boolean; include?: UserWhereInput["include"]; }) {
  const query = useQuery({
    enabled,
    queryKey: [CacheResource.AuthUser, { include }],
    queryFn: args =>
      getMeFn(args, {
        include,
      }),
    select: (data: UserResponse) => data.user,

    staleTime: 500,
  });

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
