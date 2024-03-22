import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { PickupAddressWhereInput } from "@/context/pickupAddress";
import { PickupAddressApiService } from "@/services/pickupAddressApi";
import { useQuery } from "@tanstack/react-query";

const apiService = PickupAddressApiService.new();

export function useGetPickupAddress({
  id,
  include,
}: {
  id: string | undefined;
  include?: PickupAddressWhereInput["include"];
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.PickupAddress, { id, include }] as CacheKey<
      "pickup-addresses"
    >["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
  });

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
