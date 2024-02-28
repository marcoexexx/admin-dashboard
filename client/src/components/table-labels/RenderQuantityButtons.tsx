import { Box, IconButton, Typography } from "@mui/material";
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
    if (0 === item.quantity) onRemove(item)
    if (1 <= item.quantity) onDecrement(item)
  }


  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={.5}
    >
      <IconButton disabled={disabled} aria-label="add item" size="small" onClick={handleOnClickIncrementAction}>
        <AddIcon color="primary" fontSize="small" />
      </IconButton>

      <Typography>{numberFormat(item.quantity)}</Typography>

      <IconButton disabled={disabled} aria-label="add item" size="small" onClick={handleOnClickDecrementAction}>
        {item.quantity === 0
          ? <DeleteIcon color="primary" fontSize="small" /> : <RemoveIcon color="primary" fontSize="small" />}
      </IconButton>
    </Box>
  )
}
