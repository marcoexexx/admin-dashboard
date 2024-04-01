import { useMe, useStore } from "@/hooks";
import { useUserLogout } from "@/hooks/user";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MuiButton } from "@/components/ui";
import { CacheResource } from "@/context/cacheKey";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";

import AppError, { AppErrorKind } from "@/libs/exceptions";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GradingIcon from "@mui/icons-material/Grading";
import HistoryIcon from "@mui/icons-material/History";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import MapIcon from "@mui/icons-material/Map";
import SecurityIcon from "@mui/icons-material/Security";

const UserBoxButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const MenuUserBox = styled(Box)(({ theme }) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(2),
}));

const UserBoxText = styled(Box)(({ theme }) => ({
  textAlign: "left",
  paddingLeft: theme.spacing(1),
}));

const UserBoxLabel = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.secondary.main,
  display: "block",
}));

const UserBoxDescription = styled(Typography)(({ theme }) => ({
  color: lighten(theme.palette.secondary.main, 0.5),
}));

export default function HeaderUserBox() {
  const { dispatch } = useStore();

  const navigate = useNavigate();

  const userQuery = useMe({});
  const userLogoutMutation = useUserLogout();

  const try_user = userQuery.try_data;

  const handleLogout = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "SET_USER", payload: undefined });
    userLogoutMutation.mutate();
  };

  const ref = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);

  const handleClose = () => setIsOpen(false);

  const handleNavigate = (to: string) => () => {
    setIsOpen(false);
    navigate(to);
  };

  const shopOwner = try_user.ok()?.shopownerProvider;
  const roleDisplay = shopOwner
    ? shopOwner.name
    : try_user.ok()?.role
    ? try_user.ok()?.role?.name
    : try_user.ok()?.isSuperuser
    ? "Superuser"
    : undefined;

  if (try_user.is_err()) {
    return (
      <>
        <UserBoxButton color="error">
          <UserBoxLabel>
            Failed: {try_user.value.message}: {try_user.value.kind}
          </UserBoxLabel>
        </UserBoxButton>
      </>
    );
  }

  if (userQuery.isLoading || !try_user.value) {
    return (
      <>
        <UserBoxButton color="secondary">
          <Skeleton variant="rounded" width={200} height={60} />
        </UserBoxButton>
      </>
    );
  }

  if (try_user.is_ok()) {
    return (
      <>
        <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
          <Avatar
            variant="rounded"
            alt={try_user.value.name}
            src={try_user.value.image}
          />
          <Hidden mdDown>
            <UserBoxText>
              <UserBoxLabel>{try_user.value.name}</UserBoxLabel>
              <UserBoxDescription variant="body2">
                {roleDisplay}
              </UserBoxDescription>
            </UserBoxText>
          </Hidden>

          <Hidden smDown>
            <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
          </Hidden>
        </UserBoxButton>

        <Popover
          anchorEl={ref.current}
          onClose={handleClose}
          open={isOpen}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuUserBox sx={{ minWidth: 210 }} display="flex">
            <Avatar
              variant="rounded"
              alt={try_user.value.name}
              src={try_user.value.image}
            />
            <UserBoxText>
              <UserBoxLabel variant="body1">
                {try_user.value.name}
              </UserBoxLabel>
              <UserBoxDescription variant="body2">
                {roleDisplay}
              </UserBoxDescription>
            </UserBoxText>
          </MenuUserBox>

          <Divider sx={{ mb: 0 }} />

          <List sx={{ p: 1 }} component="nav">
            <ListItemButton onClick={handleNavigate("/me")}>
              <ListItemIcon>
                <AccountBoxTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItemButton>

            <ListItemButton
              onClick={handleNavigate(`/${CacheResource.PickupAddress}`)}
            >
              <ListItemIcon>
                <MapIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Pickup address history" />
            </ListItemButton>

            <ListItemButton onClick={handleNavigate("/audit-logs")}>
              <ListItemIcon>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Audit logs" />
            </ListItemButton>

            <ListItemButton onClick={handleNavigate("/addresses")}>
              <ListItemIcon>
                <AddLocationAltIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="My addresses" />
            </ListItemButton>

            <ListItemButton onClick={handleNavigate("#wishlist")}>
              <ListItemIcon>
                <FavoriteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Wishlist" />
            </ListItemButton>

            <ListItemButton
              onClick={handleNavigate(`/${CacheResource.AccessLog}`)}
            >
              <ListItemIcon>
                <SecurityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Access logs" />
            </ListItemButton>

            <ListItemButton onClick={handleNavigate("#orders-logs")}>
              <ListItemIcon>
                <GradingIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>
          </List>

          <Divider />

          <Box p={1}>
            <MuiButton
              startIcon={<LockOpenTwoToneIcon sx={{ mr: 1 }} />}
              color="primary"
              fullWidth
              onClick={handleLogout}
            >
              Sign out
            </MuiButton>
          </Box>
        </Popover>
      </>
    );
  }

  throw AppError.new(AppErrorKind.NoDataError, "User not found");
}
