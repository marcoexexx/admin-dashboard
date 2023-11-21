import { loginUserFn } from "@/services/authApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, FormControl, FormHelperText, Input, InputLabel, OutlinedInput, Stack, TextField } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { object, string, z } from "zod"
import { FormItem } from "."

const loginUserSchema = object({
  email: string({ required_error: "Email is required" }).email({ message: "Invalid email." }),
  password: string({ required_error: "Password is required"})
    .min(8)
})

export type LoginUserInput = z.infer<typeof loginUserSchema>


export function LoginForm() {
  const { mutate } = useMutation({
    mutationFn: loginUserFn,
    onSuccess: () => {},
    onError: () => {}
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
        <FormItem field="email" display="Email" />
        <FormItem field="password" display="Password" />

        <Button variant="contained" fullWidth type="submit">Login</Button>
      </Stack>
    </FormProvider>
  )
}
