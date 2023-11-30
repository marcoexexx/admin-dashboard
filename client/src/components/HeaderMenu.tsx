import { Box, List, ListItem, ListItemText, Menu, MenuItem, styled } from "@mui/material"
import { useRef, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

const ListWrapper = styled(Box)(({theme}) => ({
  ".MuiTouchRipple-root": {
    display: "none"
  },

  ".MuiListItem-root": {
    transition: theme.transitions.create(['color', 'fill']),
    
    "&.MuiListItem-indicators": {
      padding: theme.spacing(1, 2),
      cursor: "pointer",

      ".MuiListItemText-root": {
        ".MuiTypography-root": {
          "&:before": {
            height: "4px",
            width: "22px",
            opacity: 0,
            visibility: "hidden",
            display: "block",
            position: "absolute",
            bottom: "-10px",
            transition: "all .2s",
            borderRadius: theme.colors.layout.general.borderRadiusLg,
            content: "''",
            background: theme.colors.primary.main,
          }
        }
      },

      "&.active, &:active, &:hover": {
        background: "transparent",
        ".MuiListItemText-root": {
          ".MuiTypography-root": {
            "&:before": {
              content: "''",
              opacity: 1,
              visibility: "visible",
              bottom: "0px"
            }
          }
        }
      }
    }
  },
}))

export function HeaderMenu() {
  const ref = useRef<any>(null)
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()

  const onClickOpen = () => setIsOpen(true)

  const onClickClose = () => setIsOpen(false)

  return (
    <>
      <ListWrapper sx={{ display: { xs: "none", md: "block" } }}>
        <List disablePadding component={Box} display="flex">
          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            onClick={() => navigate("/products/list")}
          >
            <ListItemText primaryTypographyProps={{ noWrap: true }} primary="Products" />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            onClick={() => navigate("/brands/list")}
          >
            <ListItemText primaryTypographyProps={{ noWrap: true }} primary="Brands" />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            onClick={() => navigate("/categories/list")}
          >
            <ListItemText primaryTypographyProps={{ noWrap: true }} primary="Categories" />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            onClick={() => navigate("/sales-categories/list")}
          >
            <ListItemText primaryTypographyProps={{ noWrap: true }} primary="Sales Categories" />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            ref={ref}
            onClick={onClickOpen}
          >
            <ListItemText primaryTypographyProps={{ noWrap: true }} primary={
              <Box display="flex" alignItems="center">
                Others
                <Box display="flex" alignItems="center" pl={0.3}>
                  <ExpandMoreTwoToneIcon fontSize="small" />
                </Box>
              </Box>
            } />
          </ListItem>
        </List>
      </ListWrapper>

      <Menu anchorEl={ref.current} onClose={onClickClose} open={isOpen}>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/auth/login">Login</MenuItem>
        <MenuItem sx={{ px: 3 }} component={NavLink} to="/auth/register">Register</MenuItem>
      </Menu>
    </>
  )
}
