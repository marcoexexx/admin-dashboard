import { Components, Theme } from "@mui/material";

export type ComponentCustomizedStyle = Components<Omit<Theme, "components">>;
