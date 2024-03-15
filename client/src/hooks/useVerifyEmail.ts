import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { verifyEmailFn } from "@/services/authApi";
import { useQuery } from "@tanstack/react-query";

export function useVerifyEmail({ verifyEmailCode }: { verifyEmailCode: string | undefined; }) {
  const query = useQuery({
    enabled: !!verifyEmailCode && verifyEmailCode !== "__code__",
    queryKey: ["verify-email-code"],
    queryFn: args => verifyEmailFn(args, verifyEmailCode),
  });

  const try_data: Result<typeof query.data, AppError> = !!query.error && query.isError
    ? Err(AppError.new((query.error as any).kind || AppErrorKind.ApiError, query.error.message))
    : Ok(query.data);

  return {
    ...query,
    try_data,
  };
}
