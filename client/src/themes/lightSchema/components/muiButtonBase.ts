import { ComponentCustomizedStyle } from "../types";

export const MuiButtonBase: ComponentCustomizedStyle["MuiButtonBase"] = {
  defaultProps: {
    disableRipple: false,
  },
  styleOverrides: {
    root: {
      borderRadius: 6,
    },
  },
};
