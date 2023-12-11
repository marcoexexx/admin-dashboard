import { verifyEmailFn } from "@/services/authApi"
import { Box, Container, Typography, styled } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { LoadingButton } from "@mui/lab"

import WarningIcon from '@mui/icons-material/Warning';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';


const MainContent = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
}))

export default function VerifyEmail() {
  const { verifyEmailCode } = useParams()

  const navigate = useNavigate()

  const { isError, refetch, error, isLoading, isSuccess } = useQuery({
    enabled: !!verifyEmailCode,
    queryKey: ["verify-email-code"],
    queryFn: args => verifyEmailFn(args, verifyEmailCode)
  })

  useEffect(() => {
    if (isSuccess) navigate("/")
  }, [isSuccess])

  const handleGoLogin = (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/auth/login")
  }

  const handleRetry = (_: React.MouseEvent<HTMLButtonElement>) => {
    refetch()
  }


  return (
    <MainContent>
      <Container maxWidth="md">
        <Box textAlign="center">
          <img alt="404" height={180} src="/static/email.svg" />
          <Typography variant="h2" sx={{ my: 2 }}>
            Confirm your email!
          </Typography>
          <Typography variant="h4" color="text.secondary" fontWeight="normal" sx={{ mb: 4 }}>
            Your account has been successfully registered. To complete the process please check your email for a validation request. 
          </Typography>
        </Box>
      </Container>

      <LoadingButton
        loading={isLoading}
        variant="contained"
        onClick={isError && error 
          ? handleRetry
          : handleGoLogin}
        loadingPosition="start"
        startIcon={isError && error
          ? <WarningIcon />
          : <MarkEmailReadIcon />}
      >
        {isLoading
        ? "Verifiing..."
        : isError && error
        ? "Retry"
        : "Login"}
      </LoadingButton>

      { isError && error 
      ? <Typography color="error" fontSize="normal" sx={{ mb: 4 }}>{error.message}: {(error as any)?.response?.data?.message || "unknown error"}</Typography>
      : null}
    </MainContent>
  )
}
