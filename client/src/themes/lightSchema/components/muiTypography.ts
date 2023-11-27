import { ComponentCustomizedStyle } from "../types";

export const MuiTypography: ComponentCustomizedStyle["MuiTypography"] = {
  defaultProps: {
    variantMapping: {
      h1: 'h1',
      h2: 'h2',
      h3: 'div',
      h4: 'div',
      h5: 'div',
      h6: 'div',
      subtitle1: 'div',
      subtitle2: 'div',
      body1: 'div',
      body2: 'div'
    }
  },
  styleOverrides: {
    gutterBottom: {
      marginBottom: 4
    },
    paragraph: {
      fontSize: 17,
      lineHeight: 1.7
    }
  }
}


