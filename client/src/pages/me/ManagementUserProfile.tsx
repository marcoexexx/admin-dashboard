import {
  PlaceholderManagementUserProfile,
  queryClient,
} from "@/components";
import { ProfileCover, RecentActivity } from "@/components/content/me";
import { CacheResource } from "@/context/cacheKey";
import { useMe } from "@/hooks";
import { getMeFn } from "@/services/authApi";
import { Container, Grid } from "@mui/material";

export async function meProfileLoader() {
  return await queryClient.fetchQuery({
    queryKey: [CacheResource.AuthUser, "profile"],
    queryFn: (args) =>
      getMeFn(args, {
        include: {
          _count: true,
          orders: true,
          favorites: true,
          addresses: true,
          pickupAddresses: {
            include: {
              orders: true,
            },
          },
          reviews: true,
        },
      }),
  });
}

export default function ManagementUserProfilePage() {
  const userQuery = useMe({
    include: {
      _count: true,
      orders: true,
      favorites: true,
      addresses: true,
      pickupAddresses: {
        include: {
          orders: true,
        },
      },
      reviews: true,
    },
  });

  const user = userQuery.try_data.ok_or_throw();

  if (!user || userQuery.isLoading) {
    return <PlaceholderManagementUserProfile />;
  }

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
          <ProfileCover user={user} />
        </Grid>

        <Grid item xs={12} md={4}>
          <RecentActivity user={user} />
        </Grid>
      </Grid>
    </Container>
  );
}
