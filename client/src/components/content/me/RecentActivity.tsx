import { User } from "@/services/types";
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Divider,
  styled,
  Typography,
  useTheme,
} from "@mui/material";

import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import ShoppingBagTwoToneIcon from "@mui/icons-material/ShoppingBagTwoTone";
import StarTwoToneIcon from "@mui/icons-material/StarTwoTone";

const AvatarPrimary = styled(Avatar)(({ theme }) => ({
  background: theme.colors.primary.lighter,
  color: theme.colors.primary.main,
  width: theme.spacing(7),
  height: theme.spacing(7),
}));

interface RecentActivityProps {
  user: User;
}

export function RecentActivity({ user }: RecentActivityProps) {
  const theme = useTheme();

  const orderTotal = user._count.orders;
  const orderCancelled = user.orders?.filter(order =>
    order.status === "Cancelled"
  ).length;

  const favoriteProducts = user._count.favorites;
  const createdProducts = user._count.createdProducts;

  const reviewTotal = user._count.reviews;

  return (
    <Card>
      <CardHeader title="Recent Activity" />

      <Divider />

      <Box px={2} py={4} display="flex" alignItems="flex-start">
        <AvatarPrimary>
          <ShoppingBagTwoToneIcon />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography variant="h3" fontWeight={500}>Orders</Typography>

          <Box pt={2} display="flex">
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Total
              </Typography>
              <Typography variant="h2" fontWeight={600}>
                {orderTotal}
              </Typography>
            </Box>
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Cancelled
              </Typography>
              {/* TODO: fetch total */}
              <Typography variant="h2" fontWeight={600}>
                {orderCancelled}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box px={2} py={4} display="flex" alignItems="flex-start">
        <AvatarPrimary>
          <FavoriteTwoToneIcon />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography variant="h3" fontWeight={500}>Favorites</Typography>

          <Box pt={2} display="flex">
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Products
              </Typography>
              <Typography variant="h2" fontWeight={600}>
                {favoriteProducts}
              </Typography>
            </Box>
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Created
              </Typography>
              <Typography variant="h2" fontWeight={600}>
                {createdProducts}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box px={2} py={4} display="flex" alignItems="flex-start">
        <AvatarPrimary>
          <StarTwoToneIcon />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography variant="h3" fontWeight={500}>Reviews</Typography>

          <Box pt={2} display="flex">
            <Box pr={8}>
              <Typography
                gutterBottom
                variant="caption"
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Total
              </Typography>
              <Typography variant="h2" fontWeight={600}>
                {reviewTotal}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
