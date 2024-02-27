import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/services/types";
import { CacheKey, CacheResource } from "@/context/cacheKey";
import { PickupAddressApiService } from "@/services/pickupAddressApi";
import { PickupAddressWhereInput } from "@/context/pickupAddress";


const apiService = PickupAddressApiService.new()


export function useGetPickupAddresses({
  filter,
  pagination,
  include,
}: {
  filter?: PickupAddressWhereInput["where"],
  include?: PickupAddressWhereInput["include"],
  pagination: Pagination,
}) {
  const query = useQuery({
    queryKey: [CacheResource.PickupAddress, { filter, pagination, include }] as CacheKey<"pickup-addresses">["list"],
    queryFn: args => apiService.findMany(args, {
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

