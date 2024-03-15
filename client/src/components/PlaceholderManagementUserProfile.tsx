import { Container, Grid, Skeleton, styled } from "@mui/material";

const HeaderTitle = styled(Skeleton)(({ theme }) => ({
  marginBottom: 3,
  height: theme.spacing(2),
}));

// TODO
export function PlaceholderManagementUserProfile() {
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
          <HeaderTitle />
        </Grid>
      </Grid>
    </Container>
  );
}
