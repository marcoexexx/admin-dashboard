import { colors } from "@/themes/lightSchema";
import { TypographyOptions } from "@mui/material/styles/createTypography";

export const typography: TypographyOptions = {
  fontFamily:
    "\"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\"",
  h1: {
    fontWeight: 500,
    fontSize: 35,
  },
  h2: {
    fontWeight: 500,
    fontSize: 30,
  },
  h3: {
    fontWeight: 500,
    fontSize: 25,
    lineHeight: 1.4,
    color: colors.alpha.black[100],
  },
  h4: {
    fontWeight: 500,
    fontSize: 16,
  },
  h5: {
    fontWeight: 500,
    fontSize: 14,
  },
  h6: {
    fontSize: 15,
  },
  body1: {
    fontSize: 14,
  },
  body2: {
    fontSize: 14,
  },
  button: {
    fontWeight: 600,
  },
  caption: {
    fontSize: 13,
    textTransform: "uppercase",
    color: colors.alpha.black[50],
  },
  subtitle1: {
    fontSize: 14,
    color: colors.alpha.black[70],
  },
  subtitle2: {
    fontWeight: 400,
    fontSize: 15,
    color: colors.alpha.black[70],
  },
  overline: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: "uppercase",
  },
};
