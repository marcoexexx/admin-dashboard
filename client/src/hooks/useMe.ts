import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { UserResponse } from "@/services/types";
import { UserFilter } from "@/context/user";
import { useQuery } from "@tanstack/react-query";
import { getMeFn } from "@/services/authApi";
import { useCookies } from "react-cookie";


export function useMe({include}: {include?: UserFilter["include"]}) {
  const [cookies] = useCookies(["logged_in"])

  const query = useQuery({
    enabled: !!cookies.logged_in,
    queryKey: ["authUser", { include }],
    queryFn: args => getMeFn(args, {
      include
    }),
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
