import { Box, TextField, Typography, styled } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { MuiButton } from "@/components/ui";


const FormWrapper = styled(Box)(({theme}) => ({
  border: "0.124rem solid " + theme.colors.alpha.black[30],
  borderRadius: theme.shape.borderRadius,
  padding: 10,
  margin: "10px 0 10px 0"
}))

const FormTitle = styled(Typography)(({theme}) => ({
  color: theme.colors.alpha.black[100],
}))


const PREFIX = "specification"

export function SpecificationInputField() {
  const { control } = useFormContext()
  const { 
    fields: specificationFields,
    append: specificationAppend,
    remove: specificationRemove
  } = useFieldArray({
    control,
    name: PREFIX,
  })

  return (
    <>
      {specificationFields.map((specificationField, idx) => (
        <FormWrapper key={specificationField.id}>
          <FormTitle>Specifications</FormTitle>
          <Controller
            control={control}
            name={`${PREFIX}.${idx}.name`}
            render={({ field }) => <TextField
              {...field}
              label="specification name"
              error={false}
              helperText=""
            />}
          />
          <Controller
            control={control}
            name={`${PREFIX}.${idx}.value`}
            render={({ field }) => <TextField
              {...field}
              label="specification value"
              error={false}
              helperText=""
            />}
          />

          <MuiButton
            type="button"
            onClick={() => specificationRemove(idx)}
          >
            Remove
          </MuiButton>
        </FormWrapper>
      ))}

      <MuiButton
        type="button"
        variant="contained"
        fullWidth
        onClick={() => specificationAppend({ name: "", value: "" })}
      >
        Add Specification
      </MuiButton>
    </>
  )
}
