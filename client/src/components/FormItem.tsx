import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { useFormContext } from "react-hook-form";

interface FormItemProps {
  field: string
  display: string
}

export function FormItem(props: FormItemProps) {
  const { field, display } = props
  const { formState: {errors}, register } = useFormContext()

  return (
    <FormControl error={!!errors.password}>
      <InputLabel sx={{ color: "white" }}>{display}</InputLabel>
      <OutlinedInput {...register(field)} />
      {errors[field]
        // @ts-ignore
        ? <FormHelperText>{errors[field]?.message}</FormHelperText>
        : null
      }
    </FormControl>
  )
}
