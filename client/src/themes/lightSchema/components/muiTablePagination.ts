import { ComponentCustomizedStyle } from "../types";

export const MuiTablePagination:
  ComponentCustomizedStyle["MuiTablePagination"] = {
    styleOverrides: {
      toolbar: {
        "& .MuiIconButton-root": {
          padding: 8,
        },
      },
      select: {
        "&:focus": {
          backgroundColor: "transparent",
        },
      },
    },
  };
