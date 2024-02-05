import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CategoryFilter } from "@/context/category";
import { useQuery } from "@tanstack/react-query";
import { getCategoryFn } from "@/services/categoryApi";


export function useGetCategory({
  id,
  include,
}: {
  id: string | undefined,
  include?: CategoryFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["categories", { id, include }],
    queryFn: args => getCategoryFn(args, { categoryId: id, include }),
    select: data => data?.category
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

