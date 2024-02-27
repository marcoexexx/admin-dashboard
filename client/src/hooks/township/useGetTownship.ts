import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { TownshipApiService } from "@/services/townshipsApi";
import { TownshipWhereInput } from "@/context/township";


const apiService = TownshipApiService.new()


export function useGetTownship({
  id,
  include,
}: {
  id: string | undefined,
  include?: TownshipWhereInput["include"],
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Township, { id, include }] as CacheKey<"townships">["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.township
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

