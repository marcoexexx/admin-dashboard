import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { UserResponse } from "@/services/types";
import { useQuery } from "@tanstack/react-query";
import { getMeFn } from "@/services/authApi";


export function useMe() {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getMeFn,
    select: (data: UserResponse) => data.user,
  })

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new(AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)

  return {
    ...query,
    try_data
  }
}
