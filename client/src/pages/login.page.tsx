import { LoginForm, OAuthForm } from "@/components/forms/auth";
import { Box, Container, Grid, Hidden, Link, styled, Typography } from "@mui/material";
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

export default function Login() {
  return (
    <>
      <MainContent>
        <Grid
          container
          sx={{ height: "100%" }}
          alignItems="stretch"
          spacing={0}
        >
          <Hidden mdDown>
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
                    alt="500"
                    height={360}
                    src="/static/reception-desk.svg"
                  />
                </Box>
              </Container>
            </Grid>
          </Hidden>
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
                <TypographySecondary variant="h4" fontWeight="normal" sx={{ mb: 4 }}>
                  Please sign-in to your account and start the adventure
                </TypographySecondary>

                <LoginForm />

                <TypographySecondary variant="h4" fontWeight="normal" sx={{ my: 2 }}>
                  Need an account?{" "}
                  <Link component={BrowserLink} to="/auth/register">Create an account</Link>
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
