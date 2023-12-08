import { Box } from "@mui/material";

import HeaderSearch from "./HeaderSearch";
import HeaderNotifications from "./HeaderNotifications";


export default function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <HeaderSearch />
      <Box sx={{ mx: .5 }} component="span">
        <HeaderNotifications />
      </Box>
    </Box>
  )
}
