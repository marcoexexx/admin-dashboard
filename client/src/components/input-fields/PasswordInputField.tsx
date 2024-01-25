import { FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, OutlinedInput, styled, useTheme } from "@mui/material"
import { useState } from "react"
import { Controller, useFormContext } from "react-hook-form"

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const TextFieldWrapper = styled(OutlinedInput)(({theme}) => ({
  '& fieldset': {
    borderColor: theme.colors.alpha.white[70],
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.colors.primary.main
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.colors.primary.main
  },

  '& .MuiInputLabel-root': {
    color: theme.colors.alpha.white[70],
  },

  '& .MuiInputBase-input': {
    color: theme.colors.alpha.white[100],
  }
}))


export function PasswordInputField({fieldName}: {fieldName: "password" | "passwordConfirm"}) {
  const [showPassword, setShowPassword] = useState(false)
  const { control, formState: {errors} } = useFormContext()

  const theme = useTheme()

  const handleToogleShowPassword = (_: React.MouseEvent<HTMLButtonElement>) => {
    setShowPassword(prev => !prev)
  }

  const handleMouseDownPaswword = () => {}

  return (
    <Controller 
      control={control}
      name={fieldName}
      render={({field}) => (
        <FormControl
          {...field}
        >
          <InputLabel htmlFor={fieldName} sx={{
            color: theme.colors.alpha.white[70]
          }}>{fieldName}</InputLabel>
          <TextFieldWrapper
            type={showPassword ? "text" : "password"}
            error={!!errors[fieldName]} 
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToogleShowPassword}
                  onMouseDown={handleMouseDownPaswword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff /> }
                </IconButton>
              </InputAdornment>
            }
            label={fieldName}
          />
          {!!errors[fieldName]
           ? <FormHelperText
              sx={{
                color: theme.colors.alpha.white[70]
              }}
            >
              {errors?.[fieldName]?.message as string || ""}
            </FormHelperText>
           : null}
        </FormControl>
      )}
    />
  )
}
