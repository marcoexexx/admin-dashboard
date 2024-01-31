import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { Pagination } from "@/services/types";
import { CouponFilter } from "@/context/coupon";
import { useQuery } from "@tanstack/react-query";
import { getCouponsFn } from "@/services/couponsApi";


export function useGetCoupons({
  filter,
  pagination,
  include,
}: {
  filter?: CouponFilter["fields"],
  include?: CouponFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["coupons", { filter } ],
    queryFn: args => getCouponsFn(args, { 
      filter,
      pagination,
      include
    }),
    select: data => data
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new(AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

