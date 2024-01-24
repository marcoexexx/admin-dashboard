import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { numberFormat } from "@/libs/numberFormat";
import { OrderItem } from "@/services/types";


export function RenderQuantityButtons({
  item,
  disabled,
  onIncrement, 
  onDecrement
}: {
  disabled: boolean,
  item: OrderItem,
  onIncrement: (item: OrderItem) => void, 
  onDecrement: (item: OrderItem) => void
  }
) {
  const handleOnClickIncrementAction = (_: React.MouseEvent<HTMLButtonElement>) => {
    onIncrement(item)
  }

  const handleOnClickDecrementAction = (_: React.MouseEvent<HTMLButtonElement>) => {
    onDecrement(item)
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
        <RemoveIcon color="primary" fontSize="small" />
      </IconButton>
    </Box>
  )
}
