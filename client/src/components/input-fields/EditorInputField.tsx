import { styled } from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


const EditorWrapper = styled(ReactQuill)(() => ({
  borderRadius: 10,

  ".ql-toolbar": {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  ".ql-container": {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },

  ".ql-editor": {
    minHeight: "18em"
  }
}))

interface EditorInputFieldProps {
  fieldName: string
}

export function EditorInputField({fieldName}: EditorInputFieldProps) {
  const { control } = useFormContext()

  return <>
    <Controller 
      name={fieldName}
      control={control}
      render={({field}) => (
        <EditorWrapper
          {...field}
          placeholder={fieldName}
        />
      )}
    />
  </>
}
