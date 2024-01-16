import { DateTimePicker } from "@mui/x-date-pickers"
import { Controller, useFormContext } from "react-hook-form"


interface DatePickerFieldProps {
  fieldName: string,
  required?: boolean
}

export function DatePickerField({fieldName, required}: DatePickerFieldProps) {
  const { control } = useFormContext()

  return (
    <Controller
      defaultValue={null}
      control={control}
      name={fieldName}
      render={({field, fieldState}) => (
        <DateTimePicker
          sx={{ width: "100%" }}
          defaultValue={field.value}
          label={fieldName}
          value={field.value}
          inputRef={field.ref}
          onChange={(date) => {
            field.onChange(date)
          }}
          slotProps={{
            textField: {
              required: !!required,
              error: !!fieldState.error,
              helperText: fieldState.error ? fieldState.error.message : ""
            }
          }}
        />
      )}
    />
  )
}
