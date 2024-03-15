import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiPaper: ComponentCustomizedStyle["MuiPaper"] = {
  styleOverrides: {
    root: {
      padding: 0,
    },
    elevation0: {
      boxShadow: "none",
    },
    elevation: {
      boxShadow: colors.shadows.card,
    },
    elevation2: {
      boxShadow: colors.shadows.cardSm,
    },
    elevation24: {
      boxShadow: colors.shadows.cardLg,
    },
    outlined: {
      boxShadow: colors.shadows.card,
    },
  },
};
