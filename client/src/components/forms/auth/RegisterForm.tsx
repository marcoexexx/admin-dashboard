import { registerUserFn } from "@/services/authApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { Stack } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { object, string, z } from "zod"
import { useStore } from "@/hooks"
import { useNavigate } from "react-router-dom"
import { MuiTextFieldWrapper } from "."
import { PasswordInputField } from "@/components/input-fields"
import { LoadingButton } from "@mui/lab"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"

const registerUserSchema = object({
  name: string({ required_error: "Username is required" })
    .min(1)
    .max(128),
  email: string({ required_error: "Email is required"})
    .email(),
  password: string({ required_error: "Password id required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      { message: "Password must contain special characters, a number, a capital letter, and a small letter" }
    )
    .min(8)
    .max(32),
  passwordConfirm: string({ required_error: "Please confirm your password" })
}).refine(data => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Password do not match"
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>


export function RegisterForm() {
  const { dispatch } = useStore()
  const navigate = useNavigate()
  const from = "/auth/login"

  const { mutate, isPending } = useMutation({
    mutationFn: registerUserFn,
    onSuccess: (data) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success create an acount: check your email",
        severity: "success"
      } })
      console.log({ _devOnly: { redirectUrl: data.redirectUrl } })
      navigate(from)
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Failed create an acount.",
        severity: "error"
      } })
    }
  })

  const methods = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema)
  })

  const { handleSubmit, register, formState: { errors } } = methods

  const onSubmit: SubmitHandler<RegisterUserInput> = (value) => {
    mutate(value)
  }

  return (
    <Stack px={3} gap={1} flexDirection="column" component="form" onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <MuiTextFieldWrapper {...register("name")} label="Username" error={!!errors.name} helperText={!!errors.name ? errors.name.message : ""} />
        <MuiTextFieldWrapper {...register("email")} label="Email" error={!!errors.email} helperText={!!errors.email ? errors.email.message : ""} />
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
  )
}

