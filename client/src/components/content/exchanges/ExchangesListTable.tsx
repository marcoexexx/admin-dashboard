import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { PermissionKey } from "@/context/cacheKey";
import { Exchange } from "@/services/types";
import { BulkActions, LoadingTablePlaceholder } from "@/components";
import { FormModal } from "@/components/forms";
import { MuiButton } from "@/components/ui";
import { CreateExchangeInput } from "./forms";
import { ExchangesActions } from ".";
import { useState } from "react"
import { getExchangePermissionsFn } from "@/services/permissionsApi";
import { convertToExcel, exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


const columnData: TableColumnHeader<Exchange>[] = [
  {
    id: "to",
    align: "left",
    name: "To"
  },
  {
    id: "from",
    align: "left",
    name: "From"
  },
  {
    id: "rate",
    align: "left",
    name: "Rate"
  },
  {
    id: "date",
    align: "right",
    name: "Date"
  },
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface ExchangesListTableProps {
  exchanges: Exchange[]
  count: number
  onDelete: (id: string) => void
  isLoading?: boolean
  onMultiDelete: (ids: string[]) => void
  onCreateManyExchanges: (buf: ArrayBuffer) => void
}

export function ExchangesListTable(props: ExchangesListTableProps) {
  const { exchanges, count, isLoading, onCreateManyExchanges, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {exchangeFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? exchanges.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickUpdateAction = (exchangeId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/exchanges/update/${exchangeId}`)
  }

  const handleClickDeleteAction = (exchangeId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(exchangeId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-exchange"
    })
  }

  const handleOnExport = () => {
    exportToExcel(exchanges, "Exchanges")
  }

  const handleOnImport = (data: CreateExchangeInput[]) => {
    convertToExcel(data, "Exchanges")
      .then(excelBuffer => onCreateManyExchanges(excelBuffer))
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
      type: "SET_EXCHANGE_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_EXCHANGE_FILTER",
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

  const isAllowedUpdateExchange = usePermission({
    key: PermissionKey.Exchange,
    actions: "update",
    queryFn: getExchangePermissionsFn
  })

  const isAllowedDeleteExchange = usePermission({
    key: PermissionKey.Exchange,
    actions: "delete",
    queryFn: getExchangePermissionsFn
  })

  const isAllowedCreateExchange = usePermission({
    key: PermissionKey.Exchange,
    actions: "create",
    queryFn: getExchangePermissionsFn
  })

  const selectedAllRows = selectedRows.length === exchanges.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < exchanges.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-exchange-multi"
          isAllowedDelete={isAllowedDeleteExchange}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <ExchangesActions 
          onExport={handleOnExport} 
          onImport={handleOnImport}  
          isAllowedImport={isAllowedCreateExchange}
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
                  : isAllowedUpdateExchange && isAllowedDeleteExchange
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {exchanges.map(row => {
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

                {columnData.map(col => {
                  const key = col.id as keyof typeof row
                  const dataRow = row[key]

                  return (
                    <TableCell align={col.align} key={col.id}>
                    <Typography
                      variant="body1"
                      fontWeight="normal"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {key === "date"
                        ? (new Date(dataRow)).toLocaleString()
                        : dataRow as string}
                    </Typography>
                  </TableCell>
                  )
                })}

                {isAllowedUpdateExchange && isAllowedDeleteExchange
                ? <TableCell align="right">
                    {isAllowedUpdateExchange
                    ? <Tooltip title="Edit Product" arrow>
                        <IconButton
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          onClick={handleClickUpdateAction(row.id)}
                          color="inherit"
                          size="small"
                        >
                          <EditTwoToneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}
                    
                    {isAllowedDeleteExchange
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
          page={exchangeFilter?.page
            ? exchangeFilter.page - 1
            : 0}
          rowsPerPage={exchangeFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-exchange"
      ? <FormModal
        field="delete-exchange"
        title="Delete exchange"
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
