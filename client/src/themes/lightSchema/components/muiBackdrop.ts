import { alpha, darken } from "@mui/material";
import { themeColors } from "../colors";
import { ComponentCustomizedStyle } from "../types";

export const MuiBackdrop: ComponentCustomizedStyle["MuiBackdrop"] = {
  styleOverrides: {
    root: {
      backgroundColor: alpha(darken(themeColors.primaryAlt, 0.4), 0.2),
      backdropFilter: "blur(2px)",

      "&.MuiBackdrop-invisible": {
        backgroundColor: "transparent",
        backdropFilter: "blur(2px)",
      },
    },
  },
};
