import { TransitionProps } from "@mui/material/transitions"
import { Ref, forwardRef, useState } from "react"
import { Box, Link, Dialog, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, Slide, TextField, Tooltip, Typography, styled, List, lighten, Theme, Hidden, ListItemAvatar, Avatar, ListItemButton } from "@mui/material"

import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone'
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone'
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone'
import { MuiButton } from "../ui"


const Transition = forwardRef(function(props: TransitionProps & { children: React.ReactElement<any, any>}, ref: Ref<unknown>) {
  return <Slide direction="down" ref={ref} {...props} />
})

const DialogWrapper = styled(Dialog)(() => ({
  ".MuiDialog-container": {
    height: "auto"
  },

  ".MuiDialog-paperScrollPaper": {
    maxHeight: "calc(100vh - 64px)"
  }
}))

const SearchInputWrapper = styled(TextField)(({theme}) => ({
  background: theme.colors.alpha.white[100],

  ".MuiInputBase-input": {
    fontSize: theme.typography.pxToRem(17)
  }
}))

const DialogTitleWrapper = styled(DialogTitle)(({theme}) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(3)
}))


export default function HeaderSearch() {
  const [openSearchResults, setOpenSearchResults] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleSearchChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target

    setSearchValue(value)

    if (value) {
      if (!openSearchResults) setOpenSearchResults(true)
    } else setOpenSearchResults(false)
  }

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Tooltip arrow title="Search">
        <IconButton color="primary" onClick={handleClickOpen}>
          <SearchTwoToneIcon />
        </IconButton>
      </Tooltip>

      <DialogWrapper
        open={open}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="md"
        fullWidth
        scroll="paper"
        onClose={handleClose}
      >
        <DialogTitleWrapper>
          <SearchInputWrapper
            value={searchValue}
            autoFocus={true}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon />
                </InputAdornment>
              )
            }}
            placeholder="Search terms here..."
            fullWidth
            label="Search"
          />
        </DialogTitleWrapper>

        <Divider />

        {openSearchResults && (
          <DialogContent>
            <Box
              sx={{ pt: 0, pb: 1 }}
              display="flex"
              justifyContent="space-between"
            >
              <Typography variant="body2" component="span">
                Search results for{" "}
                <Typography
                  sx={{ fontWeight: "bold" }}
                  variant="body1"
                  component="span"
                >
                  {searchValue}
                </Typography>
              </Typography>

              <Link href="#" variant="body2" underline="hover">
                Advanced search
              </Link>
            </Box>

            <Divider />

            <List disablePadding>
              <ListItemButton>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) =>
                          theme.palette.secondary.main
                      }}
                    >
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link
                      href="#"
                      underline="hover"
                      sx={{ fontWeight: 'bold' }}
                      variant="body2"
                    >
                      Dashboard for Healthcare Platform
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) =>
                        lighten(theme.palette.secondary.main, 0.5)
                    }}
                  >
                    This page contains all the necessary information for
                    managing all hospital staff.
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItemButton>
              <Divider sx={{ my: 1 }} component="li" />
              <ListItemButton>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) =>
                          theme.palette.secondary.main
                      }}
                    >
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link
                      href="#"
                      underline="hover"
                      sx={{ fontWeight: 'bold' }}
                      variant="body2"
                    >
                      Example Projects Application
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) =>
                        lighten(theme.palette.secondary.main, 0.5)
                    }}
                  >
                    This is yet another search result pointing to a app page.
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItemButton>
              <Divider sx={{ my: 1 }} component="li" />
              <ListItemButton>
                <Hidden smDown>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        background: (theme: Theme) =>
                          theme.palette.secondary.main
                      }}
                    >
                      <FindInPageTwoToneIcon />
                    </Avatar>
                  </ListItemAvatar>
                </Hidden>
                <Box flex="1">
                  <Box display="flex" justifyContent="space-between">
                    <Link
                      href="#"
                      underline="hover"
                      sx={{ fontWeight: 'bold' }}
                      variant="body2"
                    >
                      Search Results Page
                    </Link>
                  </Box>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: (theme: Theme) =>
                        lighten(theme.palette.secondary.main, 0.5)
                    }}
                  >
                    Choose if you would like to show or not this typography
                    section here...
                  </Typography>
                </Box>
                <ChevronRightTwoToneIcon />
              </ListItemButton>
            </List>

            <Divider sx={{ mt: 1, mb: 2 }} />

            <Box sx={{ textAlign: "center" }}>
              <MuiButton color="primary">
                View all search results
              </MuiButton>
            </Box>
          </DialogContent>
        )}
      </DialogWrapper>
    </>
  )
}
