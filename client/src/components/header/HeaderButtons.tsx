import { Box } from "@mui/material";

import HeaderNotifications from "./HeaderNotifications";
import HeaderSearch from "./HeaderSearch";

export default function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <HeaderSearch />
      <Box sx={{ mx: .5 }} component="span">
        <HeaderNotifications />
      </Box>
    </Box>
  );
}
