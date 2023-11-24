import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BrandsFilterForm } from ".";

export function BrandsActions() {
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
          <BrandsFilterForm />
        </AccordionDetails>
      </Accordion>

      <IconButton  aria-label="more actions">
        <MoreVertIcon />
      </IconButton>
    </Box>
  )
}
