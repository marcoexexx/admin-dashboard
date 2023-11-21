import { FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { useFormContext } from "react-hook-form";

interface FormItemProps {
  field: string
  display: string
  type: string
}

export function FormItem(props: FormItemProps) {
  const { field, display, type } = props
  const { formState: {errors}, register } = useFormContext()

  return (
    <FormControl error={!!errors[field]}>
      <InputLabel sx={{ color: "white" }}>{display}</InputLabel>
      <OutlinedInput type={type} {...register(field)} sx={{ color: "white" }} />
      {errors[field]
        // @ts-ignore
        ? <FormHelperText>{errors[field]?.message}</FormHelperText>
        : null
      }
    </FormControl>
  )
}
