import { ComponentCustomizedStyle } from "../types";

export const MuiCardHeader: ComponentCustomizedStyle["MuiCardHeader"] = {
  styleOverrides: {
    action: {
      marginTop: -5,
      marginBottom: -5,
    },
    title: {
      fontSize: 15,
    },
  },
};
