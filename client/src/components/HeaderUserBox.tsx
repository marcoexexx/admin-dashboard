import { useStore } from "@/hooks"
import { Avatar, Box, Button, Divider, Hidden, List, ListItemButton, ListItemText, Popover, Typography, lighten, styled } from "@mui/material"
import { useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import { NavLink as Link } from 'react-router-dom'
import { MuiButton } from "./ui"
import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone'
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone'
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone'
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone'
import { useMutation } from "@tanstack/react-query"
import { logoutUserFn } from "@/services/authApi"
import { queryClient } from "."

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


export function HeaderUserBox() {
  const { state: {user}, dispatch } = useStore()

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

  if (!user) return <Navigate to="/auth/login" />

  return (
    <>
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
          <ListItemButton to="#/management/profile/details" component={Link}>
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary="My Profile" />
          </ListItemButton>

          <ListItemButton to="#" component={Link}>
            <InboxTwoToneIcon fontSize="small" />
            <ListItemText primary="Manager" />
          </ListItemButton>
        </List>

        <Divider />

        <Box>
          <MuiButton color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </MuiButton>
        </Box>
      </Popover>
    </>
  )
}
