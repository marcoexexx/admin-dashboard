import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { ProductFilter } from "@/context/product";
import { Pagination } from "@/services/types";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { getProductsFn } from "@/services/productsApi";
import { useQuery } from "@tanstack/react-query";


export function useGetProducts({
  filter,
  pagination,
  include,
}: {
  filter?: ProductFilter["fields"],
  include?: ProductFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: [CacheResource.Product, { filter, pagination, include } ] as CacheKey<"products">["list"],
    queryFn: args => getProductsFn(args, { 
      filter,
      pagination,
      include,
    }),
    // queryFn: () => Promise.reject(new Error("Some api error")),
    select: data => data
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}
