import { loginUserFn } from "@/services/authApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Stack } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { object, string, z } from "zod"
import { useStore } from "@/hooks"
import { useLocation, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { MuiTextFiled } from "./ui"


const loginUserSchema = object({
  email: string({ required_error: "Email is required" }).email({ message: "Invalid email." }),
  password: string({ required_error: "Password is required"})
    .min(8)
})

export type LoginUserInput = z.infer<typeof loginUserSchema>


export function LoginForm() {
  const { dispatch } = useStore()
  const [cookies] = useCookies(["logged_in"])
  const navigate = useNavigate()
  const location = useLocation()
  // TODO: Debug
  const from = ((location.state as any)?.from.pathname as string) || "/home"

  useEffect(() => {
    if (cookies.logged_in) navigate("/home")
  }, [cookies.logged_in])

  const { mutate } = useMutation({
    mutationFn: loginUserFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success login.",
        severity: "success"
      } })
      navigate(from)
    },
    onError: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Failed login.",
        severity: "error"
      } })
    }
  })

  const { handleSubmit, register, formState: {errors} } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema)
  })

  const onSubmit: SubmitHandler<LoginUserInput> = (value) => {
    mutate(value)
  }

  return (
    <Stack px={3} gap={1} flexDirection="column" component="form" onSubmit={handleSubmit(onSubmit)}>
      <MuiTextFiled {...register("email")} label="Email" error={!!errors.email} helperText={!!errors.email ? errors.email.message : ""} />
      <MuiTextFiled {...register("password")} label="Password" error={!!errors.password} helperText={!!errors.password ? errors.password.message : ""} />

      <Button variant="contained" fullWidth type="submit">Login</Button>
    </Stack>
  )
}
