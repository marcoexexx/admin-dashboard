import { OAuthForm, RegisterForm } from "@/components/forms/auth";
import {
  Box,
  Container,
  Grid,
  Link,
  styled,
  Typography,
} from "@mui/material";
import { Link as BrowserLink } from "react-router-dom";

const GridWrapper = styled(Grid)(({ theme }) => ({
  background: theme.colors.gradients.black1,
}));

const MainContent = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  flex: 1,
  overflow: "auto",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}));

const TypographyPrimary = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[100],
}));

const TypographySecondary = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.white[70],
}));

export default function Register() {
  return (
    <>
      <MainContent>
        <Grid
          container
          sx={{ height: "100%" }}
          alignItems="stretch"
          spacing={0}
        >
          <Grid
            xs={12}
            md={6}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container maxWidth="sm">
              <Box textAlign="center">
                <img
                  alt="register"
                  height={360}
                  src="/static/girl-announcing-shopping-super-sale.svg"
                />
              </Box>
            </Container>
          </Grid>
          <GridWrapper
            xs={12}
            md={6}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container maxWidth="sm">
              <Box textAlign="center">
                <TypographyPrimary variant="h1" sx={{ my: 2 }}>
                  Welcome to Rangoon! 👋
                </TypographyPrimary>
                <TypographySecondary
                  variant="h4"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  Please sign-up to your account and start the adventure
                </TypographySecondary>

                <RegisterForm />

                <TypographySecondary
                  variant="h4"
                  fontWeight="normal"
                  sx={{ my: 2 }}
                >
                  Already have an account?{" "}
                  <Link component={BrowserLink} to="/auth/login">
                    Login
                  </Link>
                </TypographySecondary>

                <OAuthForm />
              </Box>
            </Container>
          </GridWrapper>
        </Grid>
      </MainContent>
    </>
  );
}
