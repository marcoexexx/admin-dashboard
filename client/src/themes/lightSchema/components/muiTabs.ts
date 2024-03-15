import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiTabs: ComponentCustomizedStyle["MuiTabs"] = {
  styleOverrides: {
    root: {
      height: 38,
      minHeight: 38,
      overflow: "visible",
    },
    indicator: {
      height: 38,
      minHeight: 38,
      borderRadius: 6,
      border: "1px solid " + colors.primary.dark,
      boxShadow: "0px 2px 10px " + colors.primary.light,
    },
    scrollableX: {
      overflow: "visible !important",
    },
  },
};
