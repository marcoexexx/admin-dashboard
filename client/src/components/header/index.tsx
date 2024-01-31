import { useLocalStorage, useStore } from "@/hooks"
import { FormModal } from "../forms";
import { Carts } from "../cart";
import { OrderItem } from "@/services/types";
import { Box, Divider, IconButton, Stack, Tooltip, alpha, lighten, styled } from "@mui/material"

import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import HeaderMenu from "./HeaderMenu";
import HeaderUserBox from "./HeaderUserBox";
import HeaderButtons from "./HeaderButtons";
import ErrorBoundary from "../ErrorBoundary";


const MainContent = styled(Box)(({theme}) => ({
  height: theme.colors.layout.header.height,
  color: theme.colors.layout.header.textColor,
  padding: theme.spacing(0, 2),
  right: 0,
  zIndex: 6,
  backgroundColor: alpha(theme.colors.layout.header.background, 0.95),
  backdropFilter: "blur(3px)",
  position: "fixed",
  justifyContent: "space-between",
  width: "100%",
  [`@media (min-width: ${theme.breakpoints.values.lg}px)`]: {
      left: theme.colors.layout.sidebar.width,
      width: "auto"
    },
  boxShadow: theme.palette.mode === "dark"
    ? `0 1px 0 ${alpha(
        lighten(theme.colors.primary.main, 0.7),
        0.15
      )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
    : `0px 2px 8px -3px ${alpha(
        theme.colors.alpha.black[100],
        0.2
      )}, 0px 5px 22px -4px ${alpha(
        theme.colors.alpha.black[100],
        0.1
      )}`
}))

export default function Header() {
  const { state, dispatch } = useStore()
  const { slidebar, modalForm } = state

  const { get } = useLocalStorage();

  const carts = get<OrderItem[]>("CARTS") || []


  const onClickToggleSlidebarHandler = (_: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "TOGGLE_SLIDEBAR" })
  }

  const handleOnCloseModalForm = () => {
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }


  return (
    <MainContent display="flex" alignItems="center">
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} alignItems="center" spacing={2}>
        <HeaderMenu />
      </Stack>

      <Box display="flex" alignItems="center">
        <HeaderButtons />
        <ErrorBoundary>
          <HeaderUserBox />
        </ErrorBoundary>
        <Box component="span" sx={{ ml: 2, display: { lg: "none", xs: "inline-block" } }}>
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={onClickToggleSlidebarHandler}>
              {!slidebar
                ? <MenuTwoToneIcon fontSize="small" />
                : <CloseTwoToneIcon fontSize="small" />
              }
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {modalForm.field === "cart"
      ? <FormModal maxWidth="lg" field='cart' title='Carts' onClose={handleOnCloseModalForm}>
          <Carts orderItems={carts} />
      </FormModal>
      : null}
    </MainContent>
  )
}
