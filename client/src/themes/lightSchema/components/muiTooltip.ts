import { colors } from "@/themes/lightSchema";
import { alpha } from "@mui/material";
import { ComponentCustomizedStyle } from "../types";

export const MuiTooltip: ComponentCustomizedStyle["MuiTooltip"] = {
  styleOverrides: {
    tooltip: {
      backgroundColor: alpha(colors.alpha.black["100"], 0.95),
      padding: "8px 16px",
      fontSize: 13,
    },
    arrow: {
      color: alpha(colors.alpha.black["100"], 0.95),
    },
  },
};
