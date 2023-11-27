import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiChip: ComponentCustomizedStyle["MuiChip"] = {
  styleOverrides: {
    colorSecondary: {
      background: colors.alpha.black[5],
      color: colors.alpha.black[100],

      '&:hover': {
        background: colors.alpha.black[10]
      }
    },
    deleteIcon: {
      color: colors.error.light,

      '&:hover': {
        color: colors.error.main
      }
    }
  }
}

