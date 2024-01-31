import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { Pagination } from "@/services/types";
import { OrderFilter } from "@/context/order";
import { useQuery } from "@tanstack/react-query";
import { getOrdersFn } from "@/services/orderApi";


export function useGetOrders({
  filter,
  pagination,
  include,
}: {
  filter?: OrderFilter["fields"],
  include?: OrderFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["orders", { filter } ],
    queryFn: args => getOrdersFn(args, { 
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

