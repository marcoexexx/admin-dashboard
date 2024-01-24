import { useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getMeFn, logoutUserFn } from "@/services/authApi"
import { queryClient } from ".."
import { useNavigate } from "react-router-dom"
import { useLocalStorage, useStore } from "@/hooks"

import { Avatar, Badge, Box, Button, Divider, Hidden, List, ListItemButton, ListItemIcon, ListItemText, Popover, Skeleton, Typography, lighten, styled } from "@mui/material"
import { MuiButton } from "@/components/ui"
import { OrderItem } from "@/services/types"

import SecurityIcon from '@mui/icons-material/Security';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import GradingIcon from '@mui/icons-material/Grading';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone'
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone'
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import MapIcon from '@mui/icons-material/Map';


const UserBoxButton = styled(Button)(({theme}) => ({
  padding: theme.spacing(1),
  paddingRight: theme.spacing(1)
}))

const MenuUserBox = styled(Box)(({theme}) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(2)
}))

const UserBoxText = styled(Box)(({theme}) => ({
  textAlign: "left",
  paddingLeft: theme.spacing(1)
}))

const UserBoxLabel = styled(Typography)(({theme}) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.secondary.main,
  display: "block"
}))

const UserBoxDescription = styled(Typography)(({theme}) => ({
  color: lighten(theme.palette.secondary.main, 0.5)
}))


export default function HeaderUserBox() {
  const { dispatch } = useStore()
  const { get } = useLocalStorage()

  const navigate = useNavigate()

  const cartsCount = (get<OrderItem[]>("CARTS") || []).length

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["authUser"],
    queryFn: getMeFn,
    select: data => data.user
  })

  const { mutate: logout } = useMutation({
    mutationFn: logoutUserFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"]
      })
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success logout.",
        severity: "success"
      } })
    }
  })

  const handleLogout = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "SET_USER", payload: undefined })
    logout()
  }

  const ref = useRef<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => setIsOpen(false)

  const handleNavigate = (to: string) => () => {
    setIsOpen(false)
    navigate(to)
  }

  const handleOpenCart = () => {
    setIsOpen(false)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "cart"
    })
  }


  if (isError) return <>
    <UserBoxButton color="error">
      <UserBoxLabel>Failed: {error.message}</UserBoxLabel>
    </UserBoxButton>
  </>

  if (isLoading || !user) return <>
    <UserBoxButton color="secondary">
      <Skeleton variant="rounded" width={200} height={60} />
    </UserBoxButton>
  </>


  return (
    <>
      <Badge badgeContent={cartsCount} color="primary" anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}>
        <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
          <Avatar variant="rounded" alt={user.name} src={user.image} />
          <Hidden mdDown>
            <UserBoxText>
              <UserBoxLabel>{user.name}</UserBoxLabel>
              <UserBoxDescription variant="body2">
                {user.role}
              </UserBoxDescription>
            </UserBoxText>
          </Hidden>

          <Hidden smDown>
            <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
          </Hidden>
        </UserBoxButton>
      </Badge>

      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={user.name} src={user.image} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">{user.role}</UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>

        <Divider sx={{ mb: 0 }} />

        <List sx={{ p: 1 }} component="nav">
          <ListItemButton onClick={handleOpenCart}>
            <ListItemIcon>
              <Badge badgeContent={cartsCount} color="primary">
                <ShoppingCartIcon fontSize="small" />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItemButton>

          <ListItemButton onClick={handleNavigate("/me")}>
            <ListItemIcon>
              <AccountBoxTwoToneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="My Profile" />
          </ListItemButton>

          <ListItemButton onClick={handleNavigate("/pickup-address-history")}>
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

          <ListItemButton onClick={handleNavigate("/access-logs")}>
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
          <MuiButton startIcon={<LockOpenTwoToneIcon sx={{ mr: 1 }} />} color="primary" fullWidth onClick={handleLogout}>
            Sign out
          </MuiButton>
        </Box>
      </Popover>
    </>
  )
}
