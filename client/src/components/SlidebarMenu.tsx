import { useStore } from "@/hooks"
import { Box, Button, List, ListItem, ListSubheader, alpha, styled } from "@mui/material"
import { Link } from 'react-router-dom'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import LoyaltyIcon from '@mui/icons-material/Loyalty';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';

const MenuWrapper = styled(Box)(({theme}) => ({
  ".MuiList-root": {
    padding: theme.spacing(1),
    "& > .MuiList-root": {
      padding: `0 ${theme.spacing(0)} ${theme.spacing(1)}`
    }
  },

  ".MuiListSubheader-root": {
    textTransform: "uppercase",
    fontWeight: "bold",
    fontSize: theme.typography.pxToRem(12),
    color: theme.colors.alpha.trueWhite[50],
    padding: theme.spacing(0, 2.5),
    lineHeight: 1.4
  }
}))

const SubMenuWrapper = styled(Box)(({theme}) => ({
  ".MuiList-root": {
    ".MuiListItem-root": {
      padding: "1px 0",

      ".MuiBadge-root": {
        position: "absolute",
        right: theme.spacing(3.2),

        ".MuiBadge-standard": {
          background: theme.colors.primary.main,
          fontSize: theme.typography.pxToRem(10),
          fontWeight: "bold",
          textTransform: "uppercase",
          color: theme.palette.primary.contrastText
        }
      },

      ".MuiButton-root": {
        display: "flex",
        color: theme.colors.alpha.trueWhite[70],
        backgroundColor: "transparent",
        width: "100%",
        justifyContent: "flex-start",
        padding: theme.spacing(1.2, 3),

        ".MuiButton-startIcon, .MuiButton-endIcon": {
          transition: theme.transitions.create(["color"]),

          ".MuiSvgIcon-root": {
            fontSize: "inherit",
            transition: "none"
          }
        },

        ".MuiButton-startIcon": {
          color: theme.colors.alpha.trueWhite[30],
          fontSize: theme.typography.pxToRem(20),
          marginRight: theme.spacing(1)
        },

        ".MuiButton-endIcon": {
          color: theme.colors.alpha.trueWhite[50],
          marginLeft: "auto",
          opacity: .8,
          fontSize: theme.typography.pxToRem(20)
        },

        "&.active, &:hover": {
          backgroundColor: alpha(theme.colors.alpha.trueWhite[100], 0.06),
          color: theme.colors.alpha.trueWhite[100],

          ".MuiButton-startIcon, .MuiButton-endIcon": {
            color: theme.colors.alpha.trueWhite[100]
          }
        }
      },

      "&.Mui-children": {
        flexDirection: "column",
        ".MuiBadge-root": {
          position: "absolute",
          right: theme.spacing(7)
        }
      },

      ".MuiCollapse-root": {
        width: "100%",

        ".MuiList-root": {
          padding: theme.spacing(1, 0),
        },

        ".MuiListItem-root": {
          padding: "1px 0",

          ".MuiButton-root": {
            padding: theme.spacing(0.8, 3),

            ".MuiBadge-root": {
              right: theme.spacing(3.2)
            },

            "&:before": {
              content: "' '",
              background: theme.colors.alpha.trueWhite[100],
              opacity: 0,
              transition: theme.transitions.create(["transform", "opacity"]),
              width: "6px",
              height: "6px",
              transform: "scale(0)",
              transformOrigin: "center",
              borderRadius: "20px",
              marginRight: theme.spacing(1.8)
            },

            "&.active, &:hover": {
              "&:before": {
                transform: "scale(1)",
                opacity: 1
              }
            }
          }
        }
      }
    }
  }
}))

export function SlidebarMenu() {
  const { dispatch } = useStore()

  const handleCloseSlidebar = () => {
    dispatch({
      type: "TOGGLE_SLIDEBAR"
    })
  }

  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={Link}
                  onClick={handleCloseSlidebar}
                  to="#"
                  startIcon={<DesignServicesTwoToneIcon />}
                >
                  Overview
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Dashboards
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={Link}
                  onClick={handleCloseSlidebar}
                  to="/products"
                  startIcon={<ShoppingCartIcon />}
                >
                  Products
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={Link}
                  onClick={handleCloseSlidebar}
                  to="/brands"
                  startIcon={<LoyaltyIcon />}
                >
                  Brands
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>
      </MenuWrapper>
    </>
  )
}
