import { Box, Button, Typography, styled } from "@mui/material";

import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useStore } from "@/hooks";
import { FormModal } from "./forms";
import { MuiButton } from "./ui";
import { Store } from "@/context/store";


const ButtonError = styled(Button)(({theme}) => ({
  background: theme.colors.error.main,
  color: theme.palette.error.contrastText,

  "&:hover": {
    background: theme.colors.error.dark
  }
}))


interface BulkActionsProps {
  field: Store["modalForm"]["field"]
  onDelete: () => void
}

export function BulkActions(props: BulkActionsProps) {
  const { field, onDelete } = props

  const { dispatch } = useStore()

  const handleOnDelete = () => {
    onDelete()
  }

  const handleCloseDeleteModal = () => {
    dispatch({
      type: "CLOSE_ALL_MODAL_FORM"
    })
  }

  const handleClickDeleteAction = () => {
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: field
    })
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <Typography variant="h5" color="text.secondary">
          Bulk actions:
        </Typography>
        <ButtonError
          sx={{ ml: 1 }}
          startIcon={<DeleteTwoToneIcon />}
          variant="contained"
          onClick={handleClickDeleteAction}
        >
          Delete
        </ButtonError>
      </Box>

      <FormModal
        field={field}
        title="Delete brand"
        onClose={handleCloseDeleteModal}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <Typography>Are you sure want to delete</Typography>
          </Box>
          <Box display="flex" flexDirection="row" gap={1}>
            <MuiButton variant="contained" color="error" onClick={handleOnDelete}>Delete</MuiButton>
            <MuiButton variant="outlined" onClick={() => dispatch({ type: "CLOSE_ALL_MODAL_FORM" })}>Cancel</MuiButton>
          </Box>
        </Box>
      </FormModal>
    </Box>
  )
}
