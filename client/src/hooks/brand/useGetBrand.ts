import { BrandFilter } from "@/context/brand";
import { CacheKey, Resource } from "@/context/cacheKey";
import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { getBrandFn } from "@/services/brandsApi";
import { useQuery } from "@tanstack/react-query";


export function useGetBrand({
  id,
  include,
}: {
  id: string | undefined,
  include?: BrandFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [Resource.Brand, { id, include }] as CacheKey<"brands">["detail"],
    queryFn: args => getBrandFn(args, { brandId: id, include }),
    select: data => data?.brand
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

