import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { ProductWhereInput } from "@/context/product";
import { ProductApiService } from "@/services/productsApi";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

const apiService = ProductApiService.new();

export function useGetProducts({
  filter,
  pagination,
  include,
}: {
  filter?: ProductWhereInput["where"];
  include?: ProductWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.Product, { filter, pagination, include }] as CacheKey<"products">["list"],
    queryFn: args =>
      apiService.findMany(args, {
        filter,
        pagination,
        include,
      }),
    // queryFn: () => Promise.reject(new Error("Some api error")),
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
