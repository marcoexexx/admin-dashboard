import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { SalesCategoryFilter } from "@/context/salesCategory";
import { useQuery } from "@tanstack/react-query";
import { getSalesCategoryFn } from "@/services/salesCategoryApi";


export function useGetSalesCategory({
  id,
  include,
}: {
  id: string | undefined,
  include?: SalesCategoryFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["sales-categories", { id, include }],
    queryFn: args => getSalesCategoryFn(args, { salesCategoryId: id, include }),
    select: data => data?.salesCategory
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

