import {
  FormControl,
  FormHelperText,
  styled,
  useTheme,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditorWrapper = styled(ReactQuill)(() => ({}));

interface EditorInputFieldProps {
  fieldName: string;
}

export function EditorInputField({ fieldName }: EditorInputFieldProps) {
  const { control } = useFormContext();

  const theme = useTheme();

  return (
    <>
      <Controller
        name={fieldName}
        control={control}
        render={({ field, fieldState }) => (
          <FormControl
            required
            fullWidth
            error={!!fieldState.error}
            component="fieldset"
          >
            <EditorWrapper
              {...field}
              value={field.value}
              placeholder={fieldName}
              sx={{
                ".ql-editor": {
                  minHeight: "18em",
                },
                ".ql-toolbar.ql-snow": {
                  borderColor: !!fieldState.error
                    ? theme.colors.error.main
                    : theme.colors.alpha.black[30],
                  borderTopLeftRadius: theme.shape.borderRadius,
                  borderTopRightRadius: theme.shape.borderRadius,
                },
                ".ql-container.ql-snow": {
                  borderColor: !!fieldState.error
                    ? theme.colors.error.main
                    : theme.colors.alpha.black[30],
                  borderBottomLeftRadius: theme.shape.borderRadius,
                  borderBottomRightRadius: theme.shape.borderRadius,
                },
              }}
            />
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
          </FormControl>
        )}
      />
    </>
  );
}
