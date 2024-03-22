import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { PermissionWhereInput } from "@/context/permission";
import { PermisssionApiService } from "@/services/permissionsApi";
import { useQuery } from "@tanstack/react-query";

const apiService = PermisssionApiService.new();

export function useGetPermission({
  id,
  include,
}: {
  id: string | undefined;
  include?: PermissionWhereInput["include"];
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Permission, { id, include }] as CacheKey<
      "permissions"
    >["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.permission,
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
