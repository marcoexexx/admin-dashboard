import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/services/types";
import { CacheKey, Resource } from "@/context/cacheKey";
import { PickupAddressFilter } from "@/context/pickupAddress";
import { getPickupAddressesFn } from "@/services/pickupAddressApi";


export function useGetPickupAddresses({
  filter,
  pagination,
  include,
}: {
  filter?: PickupAddressFilter["fields"],
  include?: PickupAddressFilter["include"],
  pagination: Pagination,
  }) {
  const query = useQuery({
    queryKey: [Resource.PickupAddress, { filter, pagination, include } ] as CacheKey<"pickup-addresses">["list"],
    queryFn: args => getPickupAddressesFn(args, { 
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

