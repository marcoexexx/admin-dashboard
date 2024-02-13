import { SuspenseLoader } from "@/components";
import { Card } from "@mui/material";
import { useGetUserByUsername } from "@/hooks/user";


interface UserProfileProps {
  username: string | undefined
}

export function UserProfile(props: UserProfileProps) {
  const { username } = props

  const { try_data, isLoading } = useGetUserByUsername({ username })

  const user = try_data.ok_or_throw()


  if (!user || isLoading) return <SuspenseLoader />

  return (
    <Card>
      <h1>Name: {user.name}</h1>
      <h3>Role: {user.role}</h3>
      <h3>username: {user.username}</h3>
    </Card>
  )
}

