import Header from "@/components/header";
import Slider from "@/components/slider";
import { alpha, Box, lighten, styled, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  height: "100%",
  ".MuiPageTitle-wrapper": {
    background: theme.palette.mode === "dark"
      ? theme.colors.alpha.trueWhite[5]
      : theme.colors.alpha.white[50],
    marginBottom: theme.spacing(4),
    boxShadow: theme.palette.mode === "dark"
      ? `0 1px 0 ${
        alpha(
          lighten(theme.colors.primary.main, 0.7),
          0.15,
        )
      }, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, 0.1)`
      : `0px 2px 4px -3px ${
        alpha(
          theme.colors.alpha.black[100],
          0.1,
        )
      }, 0px 5px 12px -4px ${
        alpha(
          theme.colors.alpha.black[100],
          0.05,
        )
      }`,
  },
}));

const InnerBoxWrapper = styled(Box)(() => ({
  position: "relative",
  zIndex: 5,
  display: "block",
  flex: 1,
}));

export function SlidebarLayout() {
  const theme = useTheme();

  return (
    <MainContent>
      <Header />
      <Slider />
      <InnerBoxWrapper
        sx={{
          pt: theme.colors.layout.header.height,
          [theme.breakpoints.up("lg")]: {
            ml: theme.colors.layout.sidebar.width,
          },
        }}
      >
        <Box display="block">
          <Outlet />
        </Box>
      </InnerBoxWrapper>
    </MainContent>
  );
}
