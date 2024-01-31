import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CategoryFilter } from "@/context/category";
import { Pagination } from "@/services/types";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesFn } from "@/services/categoryApi";


export function useGetCategories({
  filter,
  pagination,
  include,
}: {
  filter?: CategoryFilter["fields"],
  include?: CategoryFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["categories", { filter, pagination, include } ],
    queryFn: args => getCategoriesFn(args, { 
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

