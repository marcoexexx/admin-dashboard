import { PasswordInputField } from "@/components/input-fields";
import { useLocalStorage, useStore } from "@/hooks";
import { playSoundEffect } from "@/libs/playSound";
import { registerUserFn } from "@/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { object, string, z } from "zod";
import { MuiTextFieldWrapper } from ".";

const registerUserSchema = object({
  name: string({ required_error: "Username is required" })
    .min(1)
    .max(128),
  email: string({ required_error: "Email is required" })
    .email(),
  password: string({ required_error: "Password id required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      {
        message:
          "Password must contain special characters, a number, a capital letter, and a small letter",
      },
    )
    .min(8)
    .max(32),
  passwordConfirm: string({ required_error: "Please confirm your password" }),
}).refine(data => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Password do not match",
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

export function RegisterForm() {
  const { dispatch } = useStore();

  const { set } = useLocalStorage();

  const navigate = useNavigate();
  const from = `/verify-email/__code__`;

  const { mutate, isPending } = useMutation({
    mutationFn: registerUserFn,
    onSuccess: (data) => {
      set("VERIFICATION_CODE", {
        id: data.user.id,
        code: data.user.verificationCode,
      });
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Success create an acount: check your email",
          severity: "success",
        },
      });
      if (import.meta.env.MODE === "development") {
        console.log({ _devOnly: { redirectUrl: data.redirectUrl } });
      }
      navigate(from);
      playSoundEffect("success");
    },
    onError: (err: any) => {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `failed: ${err.response.data.message}`,
          severity: "error",
        },
      });
      playSoundEffect("error");
    },
  });

  const methods = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
  });

  const { handleSubmit, register, setFocus, formState: { errors } } = methods;

  useEffect(() => {
    setFocus("name");
  }, [setFocus]);

  const onSubmit: SubmitHandler<RegisterUserInput> = (value) => {
    mutate(value);
  };

  return (
    <Stack px={3} gap={1} flexDirection="column" component="form" onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <MuiTextFieldWrapper
          {...register("name")}
          label="Username"
          error={!!errors.name}
          helperText={!!errors.name ? errors.name.message : ""}
        />
        <MuiTextFieldWrapper
          {...register("email")}
          label="Email"
          error={!!errors.email}
          helperText={!!errors.email ? errors.email.message : ""}
        />
        <PasswordInputField fieldName="password" />
        <PasswordInputField fieldName="passwordConfirm" />

        <LoadingButton
          variant="contained"
          fullWidth
          type="submit"
          loading={isPending}
          loadingPosition="start"
          startIcon={<AccountCircleIcon />}
        >
          Login
        </LoadingButton>
      </FormProvider>
    </Stack>
  );
}
