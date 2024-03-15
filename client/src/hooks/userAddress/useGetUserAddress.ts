import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { UserAddressWhereInput } from "@/context/userAddress";
import { UserAddressApiService } from "@/services/userAddressApi";
import { useQuery } from "@tanstack/react-query";

const apiService = UserAddressApiService.new();

export function useGetUserAddress({
  id,
  include,
}: {
  id: string | undefined;
  include?: UserAddressWhereInput["include"];
}) {
  const query = useQuery({
    enabled: !!id,
    queryKey: [CacheResource.UserAddress, { id, include }] as CacheKey<"addresses">["detail"],
    queryFn: args => apiService.find(args, { filter: { id }, include }),
    // queryFn: () => Promise.reject(AppError.new(AppErrorKind.PermissionError))
  });

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
