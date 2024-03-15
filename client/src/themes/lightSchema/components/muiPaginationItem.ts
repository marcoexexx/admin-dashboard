import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiPaginationItem: ComponentCustomizedStyle["MuiPaginationItem"] = {
  styleOverrides: {
    page: {
      fontSize: 13,
      fontWeight: "bold",
      transition: "all .2s",
    },
    textPrimary: {
      "&.Mui-selected": {
        boxShadow: colors.shadows.primary,
      },
      "&.MuiButtonBase-root:hover": {
        background: colors.alpha.black[5],
      },
      "&.Mui-selected.MuiButtonBase-root:hover": {
        background: colors.primary.main,
      },
    },
  },
};
