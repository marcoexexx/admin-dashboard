import { useTheme, styled, FormHelperText, FormControl } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


const EditorWrapper = styled(ReactQuill)(() => ({
  borderRadius: 10,

  ".ql-toolbar": {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: "red"
  },

  ".ql-container": {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },

  ".ql-editor": {
    minHeight: "18em"
  },
}))

interface EditorInputFieldProps {
  fieldName: string
}

export function EditorInputField({fieldName}: EditorInputFieldProps) {
  const { control } = useFormContext()

  const theme = useTheme()


  return <>
    <Controller 
      name={fieldName}
      control={control}
      render={({field, fieldState}) => (
        <FormControl required fullWidth error={!!fieldState.error} component="fieldset">
          <EditorWrapper
            {...field}
            value={field.value}
            placeholder={fieldName}
            sx={{
              ".ql-toolbar.ql-snow": {
                borderColor: !!fieldState.error ? theme.colors.error.main : "inherit"
              },
              ".ql-container.ql-snow": {
                borderColor: !!fieldState.error ? theme.colors.error.main : "inherit"
              },
            }}
          />
          <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  </>
}
