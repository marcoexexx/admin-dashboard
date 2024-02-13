import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { getUserAddressesFn } from "@/services/userAddressApi";
import { Pagination } from "@/services/types";
import { UserAddressFilter } from "@/context/userAddress";


export function useGetUserAddresses({
  filter,
  pagination,
  include,
}: {
  filter?: UserAddressFilter["fields"],
  include?: UserAddressFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: ["brands", { filter, pagination, include } ],
    queryFn: args => getUserAddressesFn(args, { 
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

