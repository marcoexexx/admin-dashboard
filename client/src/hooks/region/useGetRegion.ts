import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { RegionWhereInput } from "@/context/region";
import { RegionApiService } from "@/services/regionsApi";
import { useQuery } from "@tanstack/react-query";

const apiService = RegionApiService.new();

export function useGetRegion({
  id,
  include,
}: {
  id: string | undefined;
  include?: RegionWhereInput["include"];
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Region, { id, include }] as CacheKey<
      "regions"
    >["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.region,
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
