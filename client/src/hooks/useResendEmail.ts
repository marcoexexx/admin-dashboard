import AppError, { AppErrorKind } from "@/libs/exceptions";
import Result, { Err, Ok } from "@/libs/result";

import { queryClient } from "@/components";
import { playSoundEffect } from "@/libs/playSound";
import { resendVerifyEmailFn } from "@/services/authApi";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage, useStore } from ".";

export function useResendEmail() {
  const { dispatch } = useStore();
  const { set } = useLocalStorage();

  const mutation = useMutation({
    mutationFn: (...args: Parameters<typeof resendVerifyEmailFn>) => resendVerifyEmailFn(...args),
    onSuccess: (data) => {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success send email verification code.",
          severity: "success",
        },
      });
      set("VERIFICATION_CODE", {
        id: data.user.id,
        code: data.user.verificationCode,
      });
      queryClient.invalidateQueries({
        queryKey: ["verify-email-code"],
      });
      playSoundEffect("success");
    },
    onError: (err: any) => {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `failed: ${err?.response?.data?.message || err?.message || "Unknown error"}`,
          severity: "error",
        },
      });
      playSoundEffect("error");
    },
  });

  const try_data: Result<typeof mutation.data, AppError> = !!mutation.error && mutation.isError
    ? Err(
      AppError.new((mutation.error as any).kind || AppErrorKind.ApiError, mutation.error.message),
    )
    : Ok(mutation.data);

  return {
    ...mutation,
    try_data,
  };
}
