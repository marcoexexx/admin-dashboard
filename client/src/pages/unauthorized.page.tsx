import { queryClient } from "@/components"
import { MuiButton } from "@/components/ui"
import { useStore } from "@/hooks"
import { logoutUserFn } from "@/services/authApi"
import { Box, Container, Typography, styled } from "@mui/material"
import { useMutation } from "@tanstack/react-query"


const MainContent = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
}))

export default function Unauthorized() {
  const { dispatch } = useStore()

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"]
      })
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success logout.",
        severity: "success"
      } })
      window.location.href = "/auth/login"
    }
  })

  const handleLogout = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "SET_USER", payload: undefined })
    logout()
  }

  return (
    <MainContent>
      <Container maxWidth="md">
        <Box textAlign="center">
          <img alt="404" height={180} src="/static/concept-of-data-privacy-and-policy.svg" />
          <Typography variant="h2" sx={{ my: 2 }}>
            Access Denied
          </Typography>
          <Typography variant="h4" color="text.secondary" fontWeight="normal" sx={{ mb: 4 }}>
            you currently does not have permission to access this resource.
          </Typography>
        </Box>
      </Container>

      <MuiButton
        variant="contained"
        onClick={handleLogout}
        loading={isPending}
      >
        Sign Out
      </MuiButton>
    </MainContent>
  )
}
