import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";
import { alpha } from "@mui/material";

export const MuiMenuItem: ComponentCustomizedStyle["MuiMenuItem"] = {
  styleOverrides: {
    root: {
      background: 'transparent',
      transition: 'all .2s',

      '&:hover, &:active, &.active, &.Mui-selected': {
        color: colors.alpha.black[100],
        background: alpha(colors.primary.lighter, 0.4)
      },
      '&.Mui-selected:hover': {
        background: alpha(colors.primary.lighter, 0.4)
      }
    }
  }
}

