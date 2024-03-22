import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { CacheResource } from "@/context/cacheKey";
import { getMeFn } from "@/services/authApi";
import { useQuery } from "@tanstack/react-query";

export function useGetCart() {
  const query = useQuery({
    queryKey: [CacheResource.Cart],
    queryFn: args =>
      getMeFn(args, {
        include: {
          cart: {
            include: {
              orderItems: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
      }),
    select: data => data?.user.cart,
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
