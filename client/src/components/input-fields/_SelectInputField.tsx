import { MenuItem, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

interface SelectInputFieldProps {
  fieldName: string;
  options: string[];
}

export function SelectInputField(
  { fieldName, options }: SelectInputFieldProps,
) {
  const { control } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name={fieldName}
        render={({ field, fieldState }) => (
          <>
            <TextField
              {...field}
              label="Price unit from"
              defaultValue={field.value || "KK"}
              error={!!fieldState.error}
              helperText={!!fieldState.error
                ? fieldState.error.message
                : ""}
              select
              fullWidth
            >
              {options.map(t => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      />
    </>
  );
}
