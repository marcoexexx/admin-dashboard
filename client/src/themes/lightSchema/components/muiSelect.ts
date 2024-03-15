import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiSelect: ComponentCustomizedStyle["MuiSelect"] = {
  styleOverrides: {
    iconOutlined: {
      color: colors.alpha.black[50],
    },
    icon: {
      top: "calc(50% - 14px)",
    },
  },
};
