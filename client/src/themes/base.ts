import { Theme } from "@mui/material"
import { ThemeColors, lightTheme } from "./light.theme"

declare module "@mui/material/styles" {
  interface Theme {
    colors: ThemeColors,
  }

  interface ThemeOptions {
    colors: ThemeColors,
  }
}

const themes = {
  light: lightTheme,
  dark: lightTheme   // TODO: change
}

export function themeCreator(theme: keyof typeof themes): Theme {
  return themes[theme]
}
