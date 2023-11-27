import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiToggleButton: ComponentCustomizedStyle["MuiToggleButton"] = {
  defaultProps: {
    disableRipple: true
  },
  styleOverrides: {
    root: {
      color: colors.primary.main,
      background: colors.alpha.white[100],
      transition: 'all .2s',

      '&:hover, &.Mui-selected, &.Mui-selected:hover': {
        color: colors.alpha.white[100],
        background: colors.primary.main
      }
    }
  }
}

