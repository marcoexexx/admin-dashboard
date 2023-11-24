import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ProductdsFilterForm } from ".";

export function ProductsActions() {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="baseline" flexDirection="row">
      <Accordion sx={{ width: "100%" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-filter-content"
          id="panel-filter"
        >
          <Typography fontSize={20}>Filter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ProductdsFilterForm />
        </AccordionDetails>
      </Accordion>

      {/* StatusTextField */}

      <IconButton  aria-label="more actions">
        <MoreVertIcon />
      </IconButton>
    </Box>
  )
}

