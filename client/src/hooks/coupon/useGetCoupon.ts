import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CouponWhereInput } from "@/context/coupon";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { CouponApiService } from "@/services/couponsApi";
import { useQuery } from "@tanstack/react-query";


const apiService = CouponApiService.new()


export function useGetCoupon({
  id,
  include,
}: {
  id: string | undefined,
  include?: CouponWhereInput["include"],
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.Coupon, { id, include }] as CacheKey<'coupons'>["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    select: data => data?.coupon
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

