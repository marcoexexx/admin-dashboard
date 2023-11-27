import { colors } from "@/themes/lightSchema";

export const MuiTimelineDot = {
  styleOverrides: {
    root: {
      margin: 0,
      zIndex: 5,
      position: 'absolute',
      top: '50%',
      marginTop: -6,
      left: -6
    },
    outlined: {
      backgroundColor: colors.alpha.white[100],
      boxShadow: '0 0 0 6px ' + colors.alpha.white[100]
    },
    outlinedPrimary: {
      backgroundColor: colors.alpha.white[100],
      boxShadow: '0 0 0 6px ' + colors.alpha.white[100]
    }
  }
}

