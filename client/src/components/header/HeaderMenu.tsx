import { Box, List, ListItem, ListItemText, styled } from "@mui/material"
import { useNavigate } from "react-router-dom"

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

export default function HeaderMenu() {
  const navigate = useNavigate()

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
        </List>
      </ListWrapper>
    </>
  )
}
