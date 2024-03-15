import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { CouponWhereInput } from "@/context/coupon";
import { CouponApiService } from "@/services/couponsApi";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

const apiService = CouponApiService.new();

export function useGetCoupons({
  filter,
  pagination,
  include,
}: {
  filter?: CouponWhereInput["where"];
  include?: CouponWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.Coupon, { filter, pagination, include }] as CacheKey<"coupons">["list"],
    queryFn: args =>
      apiService.findMany(args, {
        filter,
        pagination,
        include,
      }),
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
