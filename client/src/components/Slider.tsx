import { useStore } from "@/hooks"
import { Box, Divider, Drawer, Stack, alpha, darken, lighten, styled, useTheme } from "@mui/material"
import { Logo, SlidebarMenu } from "."

const MainContent = styled(Box)(({theme}) => ({
  width: theme.colors.layout.sidebar.width,
  minWidth: theme.colors.layout.sidebar.width,
  color: theme.colors.alpha.trueWhite[70],
  position: "relative",
  zIndex: 7,
  height: "100%",
  paddingBottom: "68px",
}))

export function Slider() {
  const { state, dispatch } = useStore()

  const { slidebar } = state
  const theme = useTheme()

  const onCloseSlidebarHandler = () => {
    dispatch({ type: "CLOSE_SLIDEBAR" })
  }

  return (
    <>
      <MainContent sx={{
        display: {
          xs: "none",
          lg: "inline-block"
        },
        position: "fixed",
        left: 0,
        top: 0,
        background: theme.palette.mode === "dark"
          ? alpha(lighten(theme.colors.layout.header.background, 0.1), 0.5)
          : darken(theme.colors.alpha.black[100], 0.5),
        boxShadow: theme.palette.mode === "dark"
          ? theme.colors.layout.sidebar.boxShadow
          : "none"
      }}>
        <Stack flexDirection="column">
          <Box mt={3}>
            <Box mx={2} sx={{ width: 52 }}>
              <Logo />
            </Box>
          </Box>

          <Divider sx={{
            mt: theme.spacing(3),
            mx: theme.spacing(2),
            background: theme.colors.alpha.trueWhite[10]
          }} />

          <SlidebarMenu />
        </Stack>
      </MainContent>

      <Drawer
        sx={{
          boxShadow: theme.colors.layout.sidebar.boxShadow
        }}
        anchor={theme.direction === "rtl" ? "right" : "left"}
        open={slidebar}
        variant="temporary"
        elevation={9}
        onClose={onCloseSlidebarHandler}
      >
        <MainContent sx={{
          background: theme.palette.mode === "dark"
            ? theme.colors.alpha.white[100]
            : darken(theme.colors.alpha.black[100], 0.5)
        }}
        >
          <Stack flexDirection="column">
            <Box mt={3}>
              <Box mx={2} sx={{ width: 52 }}>
                <Logo />
              </Box>
            </Box>

            <Divider sx={{
              mt: theme.spacing(3),
              mx: theme.spacing(2),
              background: theme.colors.alpha.trueWhite[10]
            }} />

            <SlidebarMenu />
          </Stack>
        </MainContent>
      </Drawer>
    </>
  )
}
