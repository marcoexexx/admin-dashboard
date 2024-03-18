import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { useStore } from "@/hooks";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { FormModal } from "../forms";
import { MuiButton } from "../ui";

const FormWrapper = styled(Box)(({ theme }) => ({
  border: "0.124rem solid " + theme.colors.alpha.black[30],
  borderRadius: theme.shape.borderRadius,
  padding: 10,
  margin: "10px 0 10px 0",
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
  const { state: { modalForm }, dispatch } = useStore();

  const [draggable, setDraggable] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | undefined>(undefined);
  const [deleteIdx, setDeleteIdx] = useState<number | undefined>(undefined);

  const handleDragStart = (idx: number) => (_evt: React.DragEvent<HTMLDivElement>) => {
    setDraggedIdx(idx);
  };

  const handleClickRemoveSpecificationAction = (idx: number) => (_evt: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteIdx(idx);
    dispatch({ type: "OPEN_MODAL_FORM", payload: "delete-specification" });
  };

  const handleRemoveSpecification = (_evt: React.MouseEvent<HTMLButtonElement>) => {
    if (deleteIdx !== undefined) specificationRemove(deleteIdx);
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
  };

  const handleDragOver = (idx: number) => (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
    if (draggedIdx) swap(draggedIdx, idx);
  };

  const handleOnDrop = (evt: React.DragEvent<HTMLDivElement>) => {
    evt.preventDefault();
  };

  const handleCloseModal = (_evt: React.MouseEvent<HTMLButtonElement>) => {
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
  };

  return (
    <>
      <Accordion defaultExpanded>
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-filter-content"
            id="panel-filter"
            sx={{ flexGrow: 1 }}
          >
            <Typography fontSize={20}>Specifications</Typography>
          </AccordionSummary>

          <Tooltip title="Add more specifications" arrow>
            <IconButton
              aria-label="add more specifications"
              onClick={() => specificationAppend({ name: "", value: "" })}
            >
              <AddTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <AccordionDetails>
          {specificationFields.map((specificationField, idx) => (
            <FormWrapper
              draggable={draggable}
              onDragStart={handleDragStart(idx)}
              onDragOver={handleDragOver(idx)}
              onDrop={handleOnDrop}
              key={specificationField.id}
            >
              <Box display="flex" justifyContent="end">
                <Tooltip title="Grag to sort">
                  <IconButton
                    onFocus={() => setDraggable(true)}
                    onBlur={() => setDraggable(false)}
                  >
                    <DragIndicatorIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove">
                  <IconButton
                    onClick={handleClickRemoveSpecificationAction(idx)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
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
            </FormWrapper>
          ))}
        </AccordionDetails>
      </Accordion>

      {modalForm.field === "delete-specification" && deleteIdx !== undefined
        ? (
          <FormModal
            field={"delete-specification"}
            title="Delete specification"
          >
            <Box display="flex" flexDirection="column" gap={1}>
              <Box>
                <Typography>Are you sure want to delete</Typography>
              </Box>
              <Box display="flex" flexDirection="row" gap={1}>
                <MuiButton variant="contained" color="error" onClick={handleRemoveSpecification}>
                  Delete
                </MuiButton>
                <MuiButton variant="outlined" onClick={handleCloseModal}>Cancel</MuiButton>
              </Box>
            </Box>
          </FormModal>
        )
        : null}
    </>
  );
}
