import { ModalFormField } from "@/context/store";
import { useStore } from "@/hooks";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useCallback } from "react";

interface FormModalProps {
  field: ModalFormField;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: DialogProps["maxWidth"];
}

export function FormModal(props: FormModalProps) {
  const { title, field, description, maxWidth = "sm", children } = props;
  const { state, dispatch } = useStore();

  const handleOnClose = useCallback(() => {
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" });
  }, []);

  return (
    <Dialog
      maxWidth={maxWidth}
      open={state.modalForm.state && state.modalForm.field === field}
      onClose={handleOnClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleOnClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {description
          ? <DialogContentText>{description}</DialogContentText>
          : null}
        {children}
      </DialogContent>
    </Dialog>
  );
}
