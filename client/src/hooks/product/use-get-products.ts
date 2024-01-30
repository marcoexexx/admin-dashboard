import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { ProductFilter } from "@/context/product";
import { getProductsFn } from "@/services/productsApi";
import { useQuery } from "@tanstack/react-query";


export function useGetProducts({
  filter
}: {
  filter?: ProductFilter
  }) {
  const query = useQuery({
    queryKey: ["products", { filter } ],
    queryFn: args => getProductsFn(args, { 
      filter: filter?.fields,
      pagination: {
        page: filter?.page || 1,
        pageSize: filter?.limit || 10
      },
      include: {
        specification: true,
        brand: true,
        categories: {
          include: {
            category: true,
          }
        },
        salesCategory: {
          include: {
            salesCategory: true
          }
        },
        creator: true
      }
    }),
    // queryFn: () => Promise.reject(new Error("Some api error")),
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
