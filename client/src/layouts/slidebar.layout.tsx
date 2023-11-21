import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function Slidebar() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
