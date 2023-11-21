import { object, string, z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const loginUserSchema = object({
  email: string().email(),
  password: string()  // TODO: validation
})

export type LoginUserInput = z.infer<typeof loginUserSchema>

export default function Login() {
  const { handleSubmit, register } = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema)
  })

  return (
    <div>login.page</div>
  )
}
