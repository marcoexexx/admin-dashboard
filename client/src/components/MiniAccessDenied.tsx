import { Box, Container, Grid, Typography, styled } from "@mui/material";


const HeaderWrapper = styled(Typography)(({theme}) => ({
  color: theme.colors.alpha.black[70],
  fontSize: "2rem",
}))

const ContentWrapper = styled(Typography)(({theme}) => ({
  color: theme.colors.alpha.black[70],
  fontSize: "1.3rem"
}))


export function MiniAccessDenied() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={16} md={6}>
          <img
            alt="access-denied-pic"
            src="/static/access-denied.svg"
            height={350}
            width="auto"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={2}>
            <HeaderWrapper>Access denied!</HeaderWrapper>
            <ContentWrapper>We're sorry, but you do not have required permissions to access page or resource. Please contact the site administrator.</ContentWrapper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
