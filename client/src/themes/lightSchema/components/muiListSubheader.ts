import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiListSubheader:
  ComponentCustomizedStyle["MuiListSubheader"] = {
    styleOverrides: {
      colorPrimary: {
        fontWeight: "bold",
        lineHeight: "40px",
        fontSize: 13,
        background: colors.alpha.black[5],
        color: colors.alpha.black[70],
      },
    },
  };
