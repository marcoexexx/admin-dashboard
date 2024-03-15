import { colors } from "@/themes/lightSchema";
import { ComponentCustomizedStyle } from "../types";

export const MuiAvatarGroup: ComponentCustomizedStyle["MuiAvatarGroup"] = {
  styleOverrides: {
    root: {
      alignItems: "center",
    },
    avatar: {
      background: colors.alpha.black[10],
      fontSize: 13,
      color: colors.alpha.black[70],
      fontWeight: "bold",

      "&:first-of-type": {
        border: 0,
        background: "transparent",
      },
    },
  },
};
