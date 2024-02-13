import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { BulkActions, LoadingTablePlaceholder } from "@/components";
import { FormModal } from "@/components/forms";
import { MuiButton } from "@/components/ui";
import { RenderRegionLabel } from "@/components/table-labels";
import { TownshipFees } from "@/services/types";
import { CreateTownshipInput } from "./forms";
import { TownshipsActions } from ".";
import { useState } from "react"
import { convertToExcel, exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { getTownshipPermissionsFn } from "@/services/permissionsApi";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


const columnData: TableColumnHeader<TownshipFees>[] = [
  {
    id: "name",
    align: "left",
    name: "Name"
  },
  {
    id: "fees",
    align: "left",
    name: "Fees"
  },
  {
    id: "region",
    align: "left",
    name: "Region"
  }
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface TownshipsListTableProps {
  townships: TownshipFees[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyTownships: (buf: ArrayBuffer) => void
}

export function TownshipsListTable(props: TownshipsListTableProps) {
  const { townships, count, isLoading, onCreateManyTownships, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {townshipFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? townships.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickDeleteAction = (townshipId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(townshipId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-township"
    })
  }

  const handleClickUpdateAction = (townshipId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/townships/update/${townshipId}`)
  }

  const handleOnExport = () => {
    exportToExcel(townships, "Townships")
  }

  const handleOnImport = (data: CreateTownshipInput[]) => {
    convertToExcel(data, "Townships")
      .then(excelBuffer => onCreateManyTownships(excelBuffer))
      .catch(err => dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Failed Excel upload: ${err.message}`,
          severity: "error"
        }
      }))
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_TOWNSHIP_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_TOWNSHIP_FILTER",
      payload: {
        limit: parseInt(evt.target.value, 10)
      }
    })
  }

  const handleCloseDeleteModal = () => {
    dispatch({
      type: "CLOSE_ALL_MODAL_FORM"
    })
  }

  const isAllowedDeleteTownship = usePermission({
    key: "township-permissions",
    actions: "delete",
    queryFn: getTownshipPermissionsFn
  })

  const isAllowedUpdateTownship = usePermission({
    key: "township-permissions",
    actions: "update",
    queryFn: getTownshipPermissionsFn
  })

  const isAllowedCreateTownship = usePermission({
    key: "township-permissions",
    actions: "create",
    queryFn: getTownshipPermissionsFn
  })

  const selectedAllRows = selectedRows.length === townships.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < townships.length


  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-township-multi"
          isAllowedDelete={isAllowedDeleteTownship}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <TownshipsActions 
          onExport={handleOnExport} 
          onImport={handleOnImport}  
          isAllowedImport={isAllowedCreateTownship}
        />
      </CardContent>

      <TableContainer>
        {isLoading
        ? <LoadingTablePlaceholder />
        : <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllRows}
                  indeterminate={selectedSomeRows}
                  onChange={handleSelectAll}
                />
              </TableCell>

              {columnHeader.map(header => {
                const render = <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
                return header.id !== "actions"
                  ? render
                  : isAllowedUpdateTownship && isAllowedDeleteTownship
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {townships.map(row => {
              const isSelected = selectedRows.includes(row.id)
              return <TableRow
                hover
                key={row.id}
                selected={isSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelected}
                    onChange={handleSelectOne(row.id)}
                    value={isSelected}
                  />
                </TableCell>

                {columnData.map(col => <TableCell align={col.align} key={col.id}>
                  <Typography
                    variant="body1"
                    fontWeight="normal"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {col.id === "name" && row.name}
                    {col.id === "fees" && row.fees}
                    {col.id === "region" && row.region && <RenderRegionLabel region={row.region} /> }
                  </Typography>
                </TableCell>)}

                {isAllowedUpdateTownship && isAllowedDeleteTownship
                ? <TableCell align="right">
                    {isAllowedUpdateTownship
                    ? <Tooltip title="Edit Township" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                          onClick={handleClickUpdateAction(row.id)}
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}

                    {isAllowedDeleteTownship
                    ? <Tooltip title="Delete township" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.error.lighter
                            },
                            color: theme.palette.error.main
                          }}
                          onClick={handleClickDeleteAction(row.id)}
                          color="inherit"
                          size="small"
                        >
                          <DeleteTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}
                  </TableCell>
                : null}
              </TableRow>
            })}
          </TableBody>
        </Table>}
      </TableContainer>

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={townshipFilter?.page
            ? townshipFilter.page - 1
            : 0}
          rowsPerPage={townshipFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-township"
      ? <FormModal
        field="delete-township"
        title="Delete township"
        onClose={handleCloseDeleteModal}
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <Typography>Are you sure want to delete</Typography>
          </Box>
          <Box display="flex" flexDirection="row" gap={1}>
            <MuiButton variant="contained" color="error" onClick={() => onDelete(deleteId)}>Delete</MuiButton>
            <MuiButton variant="outlined" onClick={() => dispatch({ type: "CLOSE_ALL_MODAL_FORM" })}>Cancel</MuiButton>
          </Box>
        </Box>
      </FormModal>
      : null}
    </Card>
  )
}
