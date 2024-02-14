import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CouponFilter } from "@/context/coupon";
import { CacheKey, Resource } from "@/context/cacheKey";
import { useQuery } from "@tanstack/react-query";
import { getCouponFn } from "@/services/couponsApi";


export function useGetCoupon({
  id,
  include,
}: {
  id: string | undefined,
  include?: CouponFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [Resource.Coupon, { id, include }] as CacheKey<'coupons'>["detail"],
    queryFn: args => getCouponFn(args, { couponId: id, include }),
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

