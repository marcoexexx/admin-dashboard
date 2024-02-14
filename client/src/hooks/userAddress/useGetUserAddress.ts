import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";
import { UserAddressFilter } from "@/context/userAddress";

import { CacheKey, Resource } from "@/context/cacheKey";
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
    queryKey: [Resource.UserAddress, { id, include }] as CacheKey<"user-addresses">["detail"],
    queryFn: args => getUserAddressFn(args, { userAddressId: id, include }),
    // queryFn: () => Promise.reject(AppError.new(AppErrorKind.PermissionError))
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

