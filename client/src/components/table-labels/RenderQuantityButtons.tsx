import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { OrderItem } from "@/services/types";
import { numberFormat } from "@/libs/numberFormat";

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';


export function RenderQuantityButtons({
  item,
  disabled,
  onIncrement,
  onDecrement,
  onRemove
}: {
  disabled: boolean,
  item: OrderItem,
  onIncrement: (item: OrderItem) => void,
  onDecrement: (item: OrderItem) => void,
  onRemove: (item: OrderItem) => void
}
) {
  const handleOnClickIncrementAction = (_: React.MouseEvent<HTMLButtonElement>) => {
    onIncrement(item)
  }

  const handleOnClickDecrementAction = (_: React.MouseEvent<HTMLButtonElement>) => {
    onDecrement(item)
  }

  const handleOnClickRemoveAction = (_: React.MouseEvent<HTMLButtonElement>) => {
    onRemove(item)
  }


  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={.5}
    >
      <Tooltip title="add">
        <>
          <IconButton disabled={disabled} aria-label="add item" size="small" onClick={handleOnClickIncrementAction}>
            <AddIcon color="primary" fontSize="small" />
          </IconButton>
        </>
      </Tooltip>

      <Typography>{numberFormat(item.quantity)}</Typography>

      {item.quantity < 0
        ? <Tooltip title="decrement">
          <>
            <IconButton disabled={disabled} aria-label="add item" size="small" onClick={handleOnClickDecrementAction}>
              <RemoveIcon color="primary" fontSize="small" />
            </IconButton>
          </>
        </Tooltip>
        : null
      }

      <Tooltip title="remove">
        <>
          <IconButton disabled={disabled} aria-label="add item" size="small" onClick={handleOnClickRemoveAction}>
            <DeleteIcon color="primary" fontSize="small" />
          </IconButton>
        </>
      </Tooltip>
    </Box>
  )
}
