import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheKey, CacheResource } from "@/context/cacheKey";
import { UserAddressWhereInput } from "@/context/userAddress";
import { Pagination } from "@/services/types";
import { UserAddressApiService } from "@/services/userAddressApi";
import { useQuery } from "@tanstack/react-query";

const apiService = UserAddressApiService.new();

export function useGetUserAddresses({
  filter,
  pagination,
  include,
}: {
  filter?: UserAddressWhereInput["where"];
  include?: UserAddressWhereInput["include"];
  pagination: Pagination;
}) {
  const query = useQuery({
    queryKey: [CacheResource.UserAddress, {
      filter,
      pagination,
      include,
    }] as CacheKey<
      "addresses"
    >["list"],
    queryFn: args =>
      apiService.findMany(args, {
        filter,
        pagination,
        include,
      }),
    select: data => data,
  });

  const try_data: Result<typeof query.data, AppError> =
    !!query.error && query.isError
      ? Err(
        AppError.new(
          (query.error as any).kind || AppErrorKind.ApiError,
          query.error.message,
        ),
      )
      : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
