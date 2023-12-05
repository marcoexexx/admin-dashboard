import { useState } from "react";
import { useStore } from "@/hooks"
import { Box, Button, Collapse, List, ListItem, ListSubheader, alpha, styled } from "@mui/material"
import { NavLink as Link } from 'react-router-dom'

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import SellIcon from '@mui/icons-material/Sell';


const DotWrapper = styled(Box)(({theme}) => ({
  padding: 2,
  borderRadius: "100%",
  margin: "0 12px 0 0",
  background: theme.colors.alpha.trueWhite[50]
}))

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

type ExpandMenu = {
  id:
    | "*"
    | "products"
    | "categories"
    | "brands"
    | "sales-categories"
    | "exchange"
    | "users"
  state: boolean
}

export function SlidebarMenu() {
  const { dispatch } = useStore()

  const [isExpandMenu, setIsExpandMenu] = useState<ExpandMenu>({
    id: "*",
    state: false
  })

  const handleCloseSlidebar = () => {
    dispatch({
      type: "CLOSE_SLIDEBAR"
    })
  }

  const handleToggleExpandMenu = (id: ExpandMenu["id"]) => (_: React.MouseEvent<HTMLButtonElement>) => {
    if (isExpandMenu.id !== id && isExpandMenu.state) {
      setIsExpandMenu({ id, state: true })
      return
    }
    setIsExpandMenu(prev => ({
      id,
      state: !prev.state
    }))
  }

  const getStateCurrentExpandMenu = (id: ExpandMenu["id"]) => {
    return isExpandMenu.id === id
      ? isExpandMenu.state
      : false
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
                  to="/overview"
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
                  to="/inventory"
                  startIcon={<InventoryIcon />}
                >
                  Inventory
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={Link}
                  to="/sales"
                  startIcon={<LocalOfferIcon />}
                >
                  Sales
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              E-Commerce
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              {/* Exchange Menues */}
              <ListItem component="div">
                <Button
                  disableRipple
                  onClick={handleToggleExpandMenu("exchange")}
                  startIcon={<AttachMoneyIcon />}
                  endIcon={getStateCurrentExpandMenu("exchange")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Exchange
                </Button>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("exchange")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      onClick={handleCloseSlidebar}
                      component={Link}
                      to="/exchanges/list"
                    >
                      <DotWrapper />
                      List
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={handleCloseSlidebar}
                      to="/exchanges/create"
                    >
                      <DotWrapper />
                      Create
                    </Button>
                  </ListItem>
                </List>
              </Collapse>

              {/* Products Menues */}
              <ListItem component="div">
                <Button
                  disableRipple
                  onClick={handleToggleExpandMenu("products")}
                  startIcon={<ShoppingCartIcon />}
                  endIcon={getStateCurrentExpandMenu("products")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Products
                </Button>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("products")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      onClick={handleCloseSlidebar}
                      component={Link}
                      to="/products/list"
                    >
                      <DotWrapper />
                      List
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={handleCloseSlidebar}
                      to="/products/create"
                    >
                      <DotWrapper />
                      Create
                    </Button>
                  </ListItem>
                </List>
              </Collapse>

              {/* Brand Menues */}
              <ListItem component="div">
                <Button
                  disableRipple
                  onClick={handleToggleExpandMenu("brands")}
                  startIcon={<SellIcon />}
                  endIcon={getStateCurrentExpandMenu("brands")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Brands
                </Button>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("brands")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      onClick={handleCloseSlidebar}
                      component={Link}
                      to="/brands/list"
                    >
                      <DotWrapper />
                      List
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={handleCloseSlidebar}
                      to="/brands/create"
                    >
                      <DotWrapper />
                      Create
                    </Button>
                  </ListItem>
                </List>
              </Collapse>

              {/* Categories Menues */}
              <ListItem component="div">
                <Button
                  disableRipple
                  onClick={handleToggleExpandMenu("categories")}
                  startIcon={<CategoryIcon />}
                  endIcon={getStateCurrentExpandMenu("categories")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Categories
                </Button>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("categories")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      onClick={handleCloseSlidebar}
                      component={Link}
                      to="/categories/list"
                    >
                      <DotWrapper />
                      List
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={handleCloseSlidebar}
                      to="/categories/create"
                    >
                      <DotWrapper />
                      Create
                    </Button>
                  </ListItem>
                </List>
              </Collapse>

              {/* Sales categories Menues */}
              <ListItem component="div">
                <Button
                  disableRipple
                  onClick={handleToggleExpandMenu("sales-categories")}
                  startIcon={<LoyaltyIcon />}
                  endIcon={getStateCurrentExpandMenu("sales-categories")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Sales categories
                </Button>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("sales-categories")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      onClick={handleCloseSlidebar}
                      component={Link}
                      to="/sales-categories/list"
                    >
                      <DotWrapper />
                      List
                    </Button>
                  </ListItem>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      component={Link}
                      onClick={handleCloseSlidebar}
                      to="/sales-categories/create"
                    >
                      <DotWrapper />
                      Create
                    </Button>
                  </ListItem>
                </List>
              </Collapse>

              {/* User Menues */}
              <ListItem component="div">
                <Button
                  disableRipple
                  onClick={handleToggleExpandMenu("users")}
                  startIcon={<PeopleIcon />}
                  endIcon={getStateCurrentExpandMenu("users")
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                >
                  Users
                </Button>
              </ListItem>

              <Collapse in={getStateCurrentExpandMenu("users")}>
                <List component="div" disablePadding>
                  <ListItem component="div">
                    <Button
                      disableRipple
                      onClick={handleCloseSlidebar}
                      component={Link}
                      to="/users/list"
                    >
                      <DotWrapper />
                      List
                    </Button>
                  </ListItem>
                </List>
              </Collapse>
            </List>
          </SubMenuWrapper>
        </List>

      </MenuWrapper>
    </>
  )
}
