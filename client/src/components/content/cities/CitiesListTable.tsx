import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { BulkActions, LoadingTablePlaceholder } from "@/components";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { FormModal } from "@/components/forms";
import { convertToExcel, exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { MuiButton } from "@/components/ui";

import { useNavigate } from "react-router-dom";
import { getCityPermissionsFn } from "@/services/permissionsApi";
import { CityFees } from "@/services/types";
import { CitiesActions } from ".";
import { CreateCityInput } from "./forms";


const columnData: TableColumnHeader<CityFees>[] = [
  {
    id: "city",
    align: "left",
    name: "Name"
  },
  {
    id: "fees",
    align: "left",
    name: "Fees"
  },
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface CitisListTableProps {
  cities: CityFees[]
  isLoading?: boolean
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyCities: (buf: ArrayBuffer) => void
}

export function CitiesListTable(props: CitisListTableProps) {
  const { cities, count, isLoading, onCreateManyCities, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {cityFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? cities.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickDeleteAction = (cityId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(cityId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-city"
    })
  }

  const handleClickUpdateAction = (cityId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/cities/update/${cityId}`)
  }

  const handleOnExport = () => {
    exportToExcel(cities, "Cities")
  }

  const handleOnImport = (data: CreateCityInput[]) => {
    convertToExcel(data, "Cities")
      .then(excelBuffer => onCreateManyCities(excelBuffer))
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
      type: "SET_CITY_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_CITY_FILTER",
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

  const isAllowedDeleteCity = usePermission({
    key: "city-permissions",
    actions: "delete",
    queryFn: getCityPermissionsFn
  })

  const isAllowedUpdateCity = usePermission({
    key: "city-permissions",
    actions: "update",
    queryFn: getCityPermissionsFn
  })

  const isAllowedCreateCity = usePermission({
    key: "city-permissions",
    actions: "create",
    queryFn: getCityPermissionsFn
  })

  const selectedAllRows = selectedRows.length === cities.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < cities.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-city-multi"
          isAllowedDelete={isAllowedDeleteCity}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <CitiesActions 
          onExport={handleOnExport} 
          onImport={handleOnImport}  
          isAllowedImport={isAllowedCreateCity}
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
                  : isAllowedUpdateCity && isAllowedDeleteCity
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {cities.map(row => {
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
                    {col.id === "city" || col.id === "fees"
                      ? row[col.id]
                      : null}
                  </Typography>
                </TableCell>)}

                {isAllowedUpdateCity && isAllowedDeleteCity
                ? <TableCell align="right">
                    {isAllowedUpdateCity
                    ? <Tooltip title="Edit City" arrow>
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

                    {isAllowedDeleteCity
                    ? <Tooltip title="Delete Product" arrow>
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
          page={cityFilter?.page
            ? cityFilter.page - 1
            : 0}
          rowsPerPage={cityFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-city"
      ? <FormModal
        field="delete-city"
        title="Delete city"
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
