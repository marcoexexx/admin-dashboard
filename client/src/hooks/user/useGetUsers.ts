import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { ProductFilter } from "@/context/product";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";
import { getUsersFn } from "@/services/usersApi";


export function useGetUsers({
  filter,
  pagination,
  include,
}: {
  filter?: ProductFilter["fields"],
  include?: ProductFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["users", { filter, pagination, include } ],
    queryFn: args => getUsersFn(args, { 
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

