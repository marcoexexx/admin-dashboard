import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { getSalesCategoriesFn } from "@/services/salesCategoryApi";
import { Pagination } from "@/services/types";
import { SalesCategoryFilter } from "@/context/salesCategory";


export function useGetSalesCategories({
  filter,
  pagination,
  include,
}: {
  filter?: SalesCategoryFilter["fields"],
  include?: SalesCategoryFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["sales-categories", { filter, pagination, include } ],
    queryFn: args => getSalesCategoriesFn(args, { 
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

