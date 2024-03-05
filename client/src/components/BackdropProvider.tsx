import { useStore } from "@/hooks";
import { Backdrop, CircularProgress } from "@mui/material";

export function BackdropProvider() {
  const { state: { backdrop } } = useStore()

  // TODO: not work
  return <Backdrop open={backdrop} sx={{ zIndex: 100 }}>
    <CircularProgress />
  </Backdrop>
}

