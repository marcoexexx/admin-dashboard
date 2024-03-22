import { colors } from "@/themes/lightSchema";
import { alpha } from "@mui/material";
import { ComponentCustomizedStyle } from "../types";

export const MuiMenu: ComponentCustomizedStyle["MuiMenu"] = {
  styleOverrides: {
    paper: {
      padding: 12,
    },
    list: {
      padding: 12,

      "& .MuiMenuItem-root.MuiButtonBase-root": {
        fontSize: 14,
        marginTop: 1,
        marginBottom: 1,
        transition: "all .2s",
        color: colors.alpha.black[70],

        "& .MuiTouchRipple-root": {
          opacity: 0.2,
        },

        "&:hover, &:active, &.active, &.Mui-selected": {
          color: colors.alpha.black[100],
          background: alpha(colors.primary.lighter, 0.4),
        },
      },
    },
  },
};
