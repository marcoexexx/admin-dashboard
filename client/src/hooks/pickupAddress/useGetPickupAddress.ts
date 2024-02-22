import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { PickupAddressFilter } from "@/context/pickupAddress";
import { useQuery } from "@tanstack/react-query";
import { getPickupAddressFn } from "@/services/pickupAddressApi";


export function useGetPickupAddress({
  id,
  include,
}: {
  id: string | undefined,
  include?: PickupAddressFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.PickupAddress, { id, include }] as CacheKey<"pickup-addresses">["detail"],
    queryFn: args => getPickupAddressFn(args, { pickupAddressId: id, include }),
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

