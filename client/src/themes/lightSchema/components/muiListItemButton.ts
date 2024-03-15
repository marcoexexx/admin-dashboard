import { ComponentCustomizedStyle } from "../types";

export const MuiListItemButton: ComponentCustomizedStyle["MuiListItemButton"] = {
  styleOverrides: {
    root: {
      "& .MuiTouchRipple-root": {
        opacity: 0.3,
      },
    },
  },
};
