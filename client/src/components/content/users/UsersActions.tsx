import { useRef, useState } from "react";
import { queryClient } from "@/components";
import { Accordion, AccordionDetails, AccordionSummary, Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Popover, Tooltip, Typography, styled } from "@mui/material";
import { UsersFilterForm } from ".";

import ExportIcon from '@mui/icons-material/Upgrade';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';


const MenuActionBox = styled(Box)(({theme}) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(2)
}))


interface UsersActionsProps {
  onExport: () => void
}

export function UsersActions(props: UsersActionsProps) {
  const { onExport } = props

  const ref = useRef<HTMLButtonElement>(null)
  
  const [isOpen, setIsOpen] = useState(false)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleExportExcel = () => {
    setIsOpen(false)
    onExport()
  }

  const handleRefreshList = () => {
    queryClient.invalidateQueries({
      queryKey: ["users"]
    })
  }


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
          <UsersFilterForm />
        </AccordionDetails>
      </Accordion>

      <IconButton aria-label="more actions" ref={ref} onClick={handleOpen}>
        <MoreVertIcon />
      </IconButton>

      <Tooltip title="Refresh users" arrow>
        <IconButton aria-label="refresh button" onClick={handleRefreshList}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >
        <MenuActionBox display="flex">
          <List sx={{ p: 1 }} component="div">
            <ListItemButton onClick={handleExportExcel}>
              <ListItemIcon>
                <ExportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Export" />
            </ListItemButton>
          </List>
        </MenuActionBox>
      </Popover>
    </Box>
  )
}
