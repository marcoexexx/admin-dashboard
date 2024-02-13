import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { getPotentialOrdersFn } from "@/services/potentialOrdersApi";
import { Pagination } from "@/services/types";
import { PotentialOrderFilter } from "@/context/order";


export function useGetPotentialOrders({
  filter,
  pagination,
  include,
}: {
  filter?: PotentialOrderFilter["fields"],
  include?: PotentialOrderFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["brands", { filter, pagination, include } ],
    queryFn: args => getPotentialOrdersFn(args, { 
      filter,
      pagination,
      include
    }),
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

