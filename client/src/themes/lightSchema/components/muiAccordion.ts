import { ComponentCustomizedStyle } from "../types";

export const MuiAccordion: ComponentCustomizedStyle["MuiAccordion"] = {
  styleOverrides: {
    root: {
      boxShadow: "none",

      "&.Mui-expanded": {
        margin: 0,
      },
      "&::before": {
        display: "none",
      },
    },
  },
};
