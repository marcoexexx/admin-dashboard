import { ComponentCustomizedStyle } from "../types";

export const MuiToolbar: ComponentCustomizedStyle["MuiToolbar"] = {
  styleOverrides: {
    root: {
      minHeight: "0 !important",
      padding: "0 !important",
    },
  },
};
