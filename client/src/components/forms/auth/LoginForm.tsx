import { loginUserFn } from "@/services/authApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { object, string, z } from "zod"
import { useStore } from "@/hooks"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useEffect } from "react"
import { playSoundEffect } from "@/libs/playSound"
import { Stack, TextField, styled } from "@mui/material"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { PasswordInputField } from "@/components/input-fields"
import { LoadingButton } from "@mui/lab"

import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export const MuiTextFieldWrapper = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.colors.alpha.white[70],
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colors.primary.main
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.colors.primary.main
    },
  },

  '& .MuiInputLabel-root': {
    color: theme.colors.alpha.white[70],
  },

  '& .MuiInputBase-input': {
    color: theme.colors.alpha.white[100],
  }
}))


const loginUserSchema = object({
  email: string({ required_error: "Email is required" }).email({ message: "Invalid email." }),
  password: string({ required_error: "Password is required" })
    .min(8)
})

export type LoginUserInput = z.infer<typeof loginUserSchema>


export function LoginForm() {
  const { dispatch } = useStore()
  const [cookies] = useCookies(["logged_in"])

  const navigate = useNavigate()
  const from = "/home"

  useEffect(() => {
    if (cookies.logged_in) navigate("/home")
  }, [cookies.logged_in])

  const { mutate, isPending } = useMutation({
    mutationFn: loginUserFn,
    // mutationFn: async (_: LoginUserInput) => new Promise(resolve => setTimeout(resolve, 2000)),
    onSuccess: () => {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: "Success login.",
          severity: "success"
        }
      })
      navigate(from)
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({
        type: "OPEN_TOAST", payload: {
          message: `Failed login: ${err.response.data.message}`,
          severity: "error"
        }
      })
      playSoundEffect("error")
    }
  })

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema)
  })

  const { handleSubmit, register, setFocus, formState: { errors } } = methods


  useEffect(() => {
    setFocus("email")
  }, [setFocus])


  const onSubmit: SubmitHandler<LoginUserInput> = (value) => {
    mutate(value)
  }

  return (
    <Stack px={3} gap={1} flexDirection="column" component="form" onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...methods}>
        <MuiTextFieldWrapper 
          {...register("email")} 
          label="Email" 
          error={!!errors.email} 
          helperText={!!errors.email ? errors.email.message : ""} 
        />
        <PasswordInputField
          fieldName="password" 
        />

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
