import { useStore } from "@/hooks";
import { Backdrop, CircularProgress } from "@mui/material";

export function BackdropProvider() {
  const { state: {backdrop} } = useStore()

  return <Backdrop open={backdrop}>
    <CircularProgress />
  </Backdrop>
}

