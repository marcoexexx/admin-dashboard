import { DateTimePicker } from "@mui/x-date-pickers"
import { Controller, useFormContext } from "react-hook-form"


interface DatePickerFieldProps {
  fieldName: string,
  required?: boolean
}

export function DatePickerField({fieldName, required}: DatePickerFieldProps) {
  const { control, formState: {errors} } = useFormContext()

  return (
    <Controller
      defaultValue={null}
      control={control}
      name={fieldName}
      render={({field}) => (
        <DateTimePicker
          label={fieldName}
          value={field.value}
          inputRef={field.ref}
          onChange={(date) => {
            field.onChange(date)
          }}
          slotProps={{
            textField: {
              required: !!required,
              error: !!errors[fieldName],
              helperText: errors[fieldName]?.message?.toString() || ""
            }
          }}
        />
      )}
    />
  )
}
