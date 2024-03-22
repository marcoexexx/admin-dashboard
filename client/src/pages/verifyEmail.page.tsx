import { MuiButton } from "@/components/ui";
import { useLocalStorage, useVerifyEmail } from "@/hooks";
import { useResendEmail } from "@/hooks/useResendEmail";
import { Box, Container, styled, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MainContent = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

export default function VerifyEmail() {
  const { verifyEmailCode } = useParams();
  const { get, remove } = useLocalStorage();

  const { error, isSuccess } = useVerifyEmail({ verifyEmailCode });
  const { mutate: resend, isPending } = useResendEmail();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
      remove("VERIFICATION_CODE");
    }
  }, [isSuccess]);

  const handleResend = () => {
    const { id, code } = get("VERIFICATION_CODE") as any;
    if (id && code) resend({ id, code });
  };

  console.error(error);

  return (
    <MainContent>
      <Container maxWidth="md">
        <Box textAlign="center">
          <img alt="404" height={180} src="/static/email.svg" />
          <Typography variant="h2" sx={{ my: 2 }}>
            Confirm your email!
          </Typography>
          <Typography variant="h4" color="text.secondary" fontWeight="normal" sx={{ mb: 4 }}>
            Your account has been successfully registered. To complete the process please check your
            email for a validation request.
          </Typography>
        </Box>
      </Container>

      <MuiButton onClick={handleResend} loading={isPending}>
        Resend
      </MuiButton>
    </MainContent>
  );
}
