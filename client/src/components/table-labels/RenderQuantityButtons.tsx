import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


export function RenderQuantityButtons({
  itemId,
  value, 
  onIncrement, 
  onDecrement
}: {
  itemId: string,
  value: number, 
  onIncrement: (id: string) => void, 
  onDecrement: (id: string) => void
  }
) {
  const handleOnClickIncrementAction = (_: React.MouseEvent<HTMLButtonElement>) => {
    onIncrement(itemId)
  }

  const handleOnClickDecrementAction = (_: React.MouseEvent<HTMLButtonElement>) => {
    onDecrement(itemId)
  }


  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      gap={.5}
    >
      <IconButton aria-label="add item" size="small" onClick={handleOnClickIncrementAction}>
        <AddIcon color="primary" fontSize="small" />
      </IconButton>

      <Typography>{value}</Typography>

      <IconButton aria-label="add item" size="small" onClick={handleOnClickDecrementAction}>
        <RemoveIcon color="primary" fontSize="small" />
      </IconButton>
    </Box>
  )
}
