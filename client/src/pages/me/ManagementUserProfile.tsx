import { SuspenseLoader, queryClient } from "@/components"
import { ProfileCover } from "@/components/content/me"
import { useStore } from "@/hooks"
import { getMeFn } from "@/services/authApi"
import { Container, Grid } from "@mui/material"
import { useQuery } from "@tanstack/react-query"


export async function meProfileLoader() {
  return await queryClient.fetchQuery({
    queryKey: ["authUser"],
    queryFn: getMeFn,
    select: data => data.user,
  })
}

export default function ManagementUserProfile() {
  const { 
    data: user, 
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: getMeFn,
    select: data => data.user,
  })

  if (isUserError && userError) return <h1>{userError.message}</h1>

  // TODO: with skeleton
  if (!user || isUserLoading) return <SuspenseLoader />


  return (
    <Container sx={{ mt: 3 }} maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12} md={8}>
          <ProfileCover user={user} />
        </Grid>
      </Grid>
    </Container>
  )
}
