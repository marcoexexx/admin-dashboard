import { Box, styled } from "@mui/material"

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

        "&.active, &:hover": {}
      },

      // TODO: styles
    }
  }
}))

export function SlidebarMenu() {
  return (
    <div>SlidebarMenu</div>
  )
}
