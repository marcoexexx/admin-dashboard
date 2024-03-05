import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { RoleApiService } from "@/services/rolesApi";
import { RoleWhereInput } from "@/context/role";


const apiService = RoleApiService.new()


export function useGetRole({
  id,
  include,
}: {
  id: string | undefined,
  include?: RoleWhereInput["include"]
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Role, { id, include }] as CacheKey<"roles">["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.role
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

