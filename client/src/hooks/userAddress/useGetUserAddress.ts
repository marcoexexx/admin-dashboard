import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";
import { UserAddressFilter } from "@/context/userAddress";

import { useQuery } from "@tanstack/react-query";
import { getUserAddressFn } from "@/services/userAddressApi";


export function useGetUserAddress({
  id,
  include,
}: {
  id: string | undefined,
  include?: UserAddressFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["user-addresses", { id, include }],
    queryFn: args => getUserAddressFn(args, { userAddressId: id, include }),
    // queryFn: () => Promise.reject(AppError.new(AppErrorKind.PermissionError))
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new(AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

