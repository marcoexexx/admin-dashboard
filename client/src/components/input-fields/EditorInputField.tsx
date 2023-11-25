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
  field: string
}

export function EditorInputField({field}: EditorInputFieldProps) {
  const { control } = useFormContext()

  return <>
    <Controller 
      name={field}
      control={control}
      render={({field}) => (
        <EditorWrapper
          {...field}
        />
      )}
    />
  </>
}
