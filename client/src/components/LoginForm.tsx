import { loginUserFn } from "@/services/authApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Stack } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { object, string, z } from "zod"
import { FormItem } from "."
import { useStore } from "@/hooks"
import { useLocation, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useEffect } from "react"

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

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema)
  })

  const onSubmit: SubmitHandler<LoginUserInput> = (value) => {
    mutate(value)
  }

  return (
    <FormProvider {...methods}>
      <Stack px={3} gap={1} flexDirection="column" component="form" onSubmit={methods.handleSubmit(onSubmit)}>
        <FormItem type="email" field="email" display="Email" />
        <FormItem type="password" field="password" display="Password" />

        <Button variant="contained" fullWidth type="submit">Login</Button>
      </Stack>
    </FormProvider>
  )
}
