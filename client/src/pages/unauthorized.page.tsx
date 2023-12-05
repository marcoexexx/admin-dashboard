import { MuiButton } from "@/components/ui"
import { Box, Container, Typography, styled } from "@mui/material"
import { useNavigate } from "react-router-dom"

const MainContent = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
}))

export default function Unauthorized() {
  const navigate = useNavigate()

  const handleGoHome = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/home")
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
        onClick={handleGoHome}
      >
        Go home
      </MuiButton>
    </MainContent>
  )
}
