import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { PermissionWhereInput } from "@/context/permission";
import { PermisssionApiService } from "@/services/permissionsApi";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

const apiService = PermisssionApiService.new();

export function useGetPermissions({
  filter,
  pagination,
  include,
}: {
  filter?: PermissionWhereInput["where"];
  include?: PermissionWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.Permission, {
      filter,
      pagination,
      include,
    }] as CacheKey<
      "permissions"
    >["list"],
    queryFn: args =>
      apiService.findMany(args, {
        filter,
        pagination,
        include,
      }),
    select: data => data,
  });

  const try_data: Result<typeof query.data, AppError> =
    !!query.error && query.isError
      ? Err(
        AppError.new(
          (query.error as any).kind || AppErrorKind.ApiError,
          query.error.message,
        ),
      )
      : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
