import { Theme } from "@mui/material"
import { lightTheme } from "./light.theme"

declare module "@mui/material/styles" {
  interface Theme {
    colors: {
      gradients: {},
      shadows: {
        primary: string,
        secondary: string,
        info: string,
        success: string,
        warning: string,
        error: string
      },
      alpha: {
        light: string,
        lighter: string,
        main: string,
        dark: string
      },
      primary: {
        light: string,
        lighter: string,
        main: string,
        dark: string
      },
      secondary: {
        light: string,
        lighter: string,
        main: string,
        dark: string
      },
      info: {
        light: string,
        lighter: string,
        main: string,
        dark: string
      },
      success: {
        light: string,
        lighter: string,
        main: string,
        dark: string
      },
      warning: {
        light: string,
        lighter: string,
        main: string,
        dark: string
      },
      error: {
        light: string,
        lighter: string,
        main: string,
        dark: string

      },

      layout: {
        common: {},
        sidebar: {},
        header: {}
      },
    },
  }

  interface ThemeOptions {
    colors: {
      gradients: {},
      shadows: {},
      alpha: {},
      primary: {},
      secondary: {},
      info: {},
      success: {},
      warning: {},
      error: {},

      layout: {
        common: {},
        sidebar: {},
        header: {}
      },
    },
  }
}

const themes = {
  light: lightTheme,
  dark: lightTheme   // TODO: change
}

export function themeCreator(theme: keyof typeof themes): Theme {
  return themes[theme]
}
