import { Box } from "@mui/material";

import HeaderFullScreen from "./HeaderFullScreen";
import HeaderNotifications from "./HeaderNotifications";
import HeaderSearch from "./HeaderSearch";
import HeaderTranslations from "./HeaderTranslations";

export default function HeaderButtons() {
  return (
    <Box sx={{ mr: 1 }}>
      <HeaderSearch />
      <Box sx={{ mx: .5 }} component="span">
        <HeaderNotifications />
        <HeaderFullScreen />
        <HeaderTranslations />
      </Box>
    </Box>
  );
}
