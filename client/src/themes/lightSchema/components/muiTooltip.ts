import { colors } from "@/themes/lightSchema"
import { ComponentCustomizedStyle } from "../types";
import { alpha } from "@mui/material";

export const MuiTooltip: ComponentCustomizedStyle["MuiTooltip"] = {
  styleOverrides: {
    tooltip: {
      backgroundColor: alpha(colors.alpha.black['100'], 0.95),
      padding: '8px 16px',
      fontSize: 13
    },
    arrow: {
      color: alpha(colors.alpha.black['100'], 0.95)
    }
  }
}

