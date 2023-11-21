import { registerUserFn } from "@/services/authApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Stack } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { SubmitHandler, useForm } from "react-hook-form"
import { object, string, z } from "zod"
import { useStore } from "@/hooks"
import { useLocation, useNavigate } from "react-router-dom"
import { MuiTextFiled } from "./ui"

const registerUserSchema = object({
  name: string({ required_error: "Username is required" })
    .min(1)
    .max(128),
  email: string({ required_error: "Email is required"})
    .email(),
  password: string({ required_error: "Password id required" })
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
  const location = useLocation()
  // TODO: Debug
  const from = ((location.state as any)?.from.pathname as string) || "/auth/login"

  const { mutate } = useMutation({
    mutationFn: registerUserFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success create an acount.",
        severity: "success"
      } })
      navigate(from)
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Failed create an acount.",
        severity: "error"
      } })
    }
  })

  const { handleSubmit, register, formState: { errors } } = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema)
  })

  const onSubmit: SubmitHandler<RegisterUserInput> = (value) => {
    mutate(value)
  }

  return (
    <Stack px={3} gap={1} flexDirection="column" component="form" onSubmit={handleSubmit(onSubmit)}>
      <MuiTextFiled {...register("name")} label="Username" error={!!errors.name} helperText={!!errors.name ? errors.name.message : ""} />
      <MuiTextFiled {...register("email")} label="Email" error={!!errors.email} helperText={!!errors.email ? errors.email.message : ""} />
      <MuiTextFiled {...register("password")} label="Password" error={!!errors.password} helperText={!!errors.password ? errors.password.message : ""} />
      <MuiTextFiled {...register("passwordConfirm")} label="Password confirm" error={!!errors.passwordConfirm} helperText={!!errors.passwordConfirm ? errors.passwordConfirm.message : ""} />

      <Button variant="contained" fullWidth type="submit">Sign Up</Button>
    </Stack>
  )
}

