import { Box, Container, Divider, Grid, Skeleton } from "@mui/material";

export function PlaceholderManagementUserProfile() {
  return (
    <Container sx={{ mt: 3 }} maxWidth="lg">
      <Grid container>
        <Grid item xs={12} md={8}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" flexDirection="column">
              <Skeleton width={300} height={70} />
              <Skeleton width="100%" height={20} />
              <Skeleton width="100%" height={20} />
              <Skeleton width={400} height={20} />
            </Box>

            <Box>
              <Skeleton variant="rounded" width="100%" height={300} />
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
              <Skeleton width={100} height={30} />
              <Box>
                <Skeleton width="100%" />
                <Skeleton width="100%" />
                <Skeleton width="100%" />
                <Skeleton width="100%" />
                <Skeleton width="80%" />
              </Box>

              <Skeleton width={200} height={30} />

              <Box display="flex" flexDirection="row" gap={2}>
                <Skeleton width={100} height={50} />
                <Skeleton width={100} height={50} />
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box>
              <Skeleton width={100} />
            </Box>

            <Divider />

            {[...Array(3).keys()].map(key => (
              <>
                <Box key={key}>
                  <Box
                    px={2}
                    py={4}
                    display="flex"
                    alignItems="flex-start"
                  >
                    <Skeleton
                      variant="circular"
                      animation="wave"
                      width={70}
                      height={70}
                    />

                    <Box pl={2} flex={1}>
                      <Skeleton width={100} height={40} />
                      <Box pt={2}>
                        <Box pr={8} display="flex" flexDirection="column">
                          <Skeleton width="100%" />
                          <Skeleton width="86%" />
                          <Skeleton />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider />
              </>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
