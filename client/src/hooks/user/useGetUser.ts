import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { useQuery } from "@tanstack/react-query";
import { UserFilter } from "@/context/user";
import { getUserFn, getUserProfileFn } from "@/services/usersApi";


export function useGetUser({
  id,
  include,
}: {
  id: string | undefined,
  include?: UserFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["users", { id, include }],
    queryFn: args => getUserFn(args, { userId: id, include }),
    select: data => data?.user
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}


export function useGetUserByUsername({
  username,
  include,
}: {
  username: string | undefined,
  include?: UserFilter["include"],
  }) {
  const query = useQuery({
    enabled: !!username,
    queryKey: ["users", { username, include }],
    queryFn: args => getUserProfileFn(args, { username }),
    select: data => data?.user
  })


  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message)) 
    : Ok(query.data)


  return {
    ...query,
    try_data
  }
}

