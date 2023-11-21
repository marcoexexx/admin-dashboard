import { styled, TextField, TextFieldProps } from "@mui/material";
import { forwardRef } from "react";

const MuiTextFieldWrapper = styled(TextField)(({theme}) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.colors.alpha.white[70],
    },
    '&:hover fieldset': {
      borderColor: theme.colors.alpha.white[70],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.colors.alpha.white[100],
    },
  },

  '& .MuiInputLabel-root': {
    color: theme.colors.alpha.white[70],
  },

  '& .MuiInputBase-input': {
    color: theme.colors.alpha.white[100],
  }
}))


type MuiTextFieldProps = TextFieldProps & {}

export const MuiTextFiled = forwardRef<HTMLInputElement, MuiTextFieldProps>((props, ref) => {
  const { ...reset } = props

  return <MuiTextFieldWrapper {...reset} ref={ref} />
})
