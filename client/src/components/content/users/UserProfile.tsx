import { SuspenseLoader } from "@/components";
import { getUserProfileFn } from "@/services/usersApi";
import { Card } from "@mui/material";
import { useQuery } from "@tanstack/react-query";


interface UserProfileProps {
  username: string | undefined
}

export function UserProfile(props: UserProfileProps) {
  const { username } = props

  const {
    data: user,
    isError: isUserError,
    isLoading: isUserLoading,
    error: userError
  } = useQuery({
    enabled: !!username,
    queryKey: ["users", { id: username }],
    queryFn: args => getUserProfileFn(args, { username }),
    select: data => data?.user
  })


  if (isUserError && userError) return <h1>ERROR: {JSON.stringify(userError)}</h1>
  if (!user || isUserLoading) return <SuspenseLoader />

  return (
    <Card>
      <h1>Name: {user.name}</h1>
      <h3>Role: {user.role}</h3>
      <h3>username: {user.username}</h3>
    </Card>
  )
}

