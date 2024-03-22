import { Box, Container, Grid, styled, Typography } from "@mui/material";

const HeaderWrapper = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.black[70],
  fontSize: "2rem",
}));

const ContentWrapper = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.black[70],
  fontSize: "1.3rem",
}));

export function MiniAccessDenied() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={1} alignItems="center">
        <Grid item md={6} xs={12}>
          <Box minWidth={300} maxWidth={430}>
            <img
              alt="access-denied-pic"
              src="/static/access-denied.svg"
            />
          </Box>
        </Grid>

        <Grid item md={6} xs={12}>
          <Box display="flex" flexDirection="column" gap={2}>
            <HeaderWrapper>Access denied!</HeaderWrapper>
            <ContentWrapper>
              We're sorry, but you do not have required permissions to
              access page or resource. Please contact the site
              administrator.
            </ContentWrapper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
