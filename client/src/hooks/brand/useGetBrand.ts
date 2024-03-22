import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { BrandWhereInput } from "@/context/brand";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { BrandApiService } from "@/services/brandsApi";
import { useQuery } from "@tanstack/react-query";

const apiService = BrandApiService.new();

export function useGetBrand({
  id,
  include,
}: {
  id: string | undefined;
  include?: BrandWhereInput["include"];
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Brand, { id, include }] as CacheKey<
      "brands"
    >["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.brand,
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
