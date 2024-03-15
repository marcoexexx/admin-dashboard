import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { SalesCategoryWhereInput } from "@/context/salesCategory";
import { SalesCategoryApiService } from "@/services/salesCategoryApi";
import { useQuery } from "@tanstack/react-query";

const apiService = SalesCategoryApiService.new();

export function useGetSalesCategory({
  id,
  include,
}: {
  id: string | undefined;
  include?: SalesCategoryWhereInput["include"];
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.SalesCategory, { id, include }] as CacheKey<"sales-categories">["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.salesCategory,
  });

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
