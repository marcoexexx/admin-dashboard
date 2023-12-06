import { Typography, styled } from "@mui/material";

export const LinkLabel = styled(Typography)(({theme}) => ({
  color: theme.colors.primary.main,
  cursor: "pointer",

  "&:hover": {
    textDecoration: "underline",
  }
}))


