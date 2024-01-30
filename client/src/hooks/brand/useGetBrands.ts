import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { getBrandsFn } from "@/services/brandsApi";
import { Pagination } from "@/services/types";
import { BrandFilter } from "@/context/brand";


export function useGetBrands({
  filter,
  pagination,
  include,
}: {
  filter?: BrandFilter["fields"],
  include?: BrandFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["brands", { filter } ],
    queryFn: args => getBrandsFn(args, { 
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

