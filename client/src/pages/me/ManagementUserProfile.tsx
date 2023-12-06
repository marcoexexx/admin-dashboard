import { PlaceholderManagementUserProfile, queryClient } from "@/components"
import { ProfileCover, RecentActivity } from "@/components/content/me"
import { getMeProfileFn } from "@/services/authApi"
import { Container, Grid } from "@mui/material"
import { useQuery } from "@tanstack/react-query"


export async function meProfileLoader() {
  return await queryClient.fetchQuery({
    queryKey: ["authUserProfile"],
    queryFn: getMeProfileFn,
  })
}

export default function ManagementUserProfile() {
  const { 
    data: user, 
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError
  } = useQuery({
    queryKey: ["authUserProfile"],
    queryFn: getMeProfileFn,
    select: data => data.user,
  })

  if (isUserError && userError) return <h1>{userError.message}</h1>

  if (!user || isUserLoading) return <PlaceholderManagementUserProfile />


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

        <Grid item xs={12} md={4}>
          <RecentActivity user={user} />
        </Grid>

      </Grid>
    </Container>
  )
}
