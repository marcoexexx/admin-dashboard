import { MuiButton } from "@/components/ui";
import { Box, IconButton, styled, TextField, Typography } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useState } from "react";

const FormWrapper = styled(Box)(({ theme }) => ({
  border: "0.124rem solid " + theme.colors.alpha.black[30],
  borderRadius: theme.shape.borderRadius,
  padding: 10,
  margin: "10px 0 10px 0",
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  color: theme.colors.alpha.black[100],
}));

const PREFIX = "specification";

export function SpecificationInputField() {
  const { control } = useFormContext();
  const {
    fields: specificationFields,
    append: specificationAppend,
    remove: specificationRemove,
    swap,
  } = useFieldArray({
    control,
    name: PREFIX,
  });

  const [draggable, setDraggable] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | undefined>(undefined);

  const handleDragStart = (idx: number) => (_evt: React.DragEvent<HTMLDivElement>) => {
    setDraggedIdx(idx);
  };

  const handleDragOver = (idx: number) => (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    if (draggedIdx) swap(draggedIdx, idx);
  };

  const handleOnDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  return (
    <>
      {specificationFields.map((specificationField, idx) => (
        <FormWrapper
          draggable={draggable}
          onDragStart={handleDragStart(idx)}
          onDragOver={handleDragOver(idx)}
          onDrop={handleOnDrop}
          key={specificationField.id}
        >
          <Box display="flex" justifyContent="space-between" margin={1}>
            <FormTitle>Specifications</FormTitle>
            <IconButton
              onFocus={() => setDraggable(true)}
              onBlur={() => setDraggable(false)}
            >
              <DragIndicatorIcon />
            </IconButton>
          </Box>
          <Controller
            control={control}
            name={`${PREFIX}.${idx}.name`}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="specification name"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name={`${PREFIX}.${idx}.value`}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="specification value"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
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
  );
}
