import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { BulkActions } from "@/components";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { FormModal } from "@/components/forms";
import { useStore } from "@/hooks";
import { MuiButton } from "@/components/ui";
import { CreateExchangeInput } from "./forms";
import { exportToExcel } from "@/libs/exportToExcel";
import { ExchangesActions } from ".";



const columnData: TableColumnHeader<IExchange>[] = [
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
    align: "left",
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
  exchanges: IExchange[]
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyExchanges: (data: CreateExchangeInput[]) => void
}

export function ExchangesListTable(props: ExchangesListTableProps) {
  const { exchanges, count, onCreateManyExchanges, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

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
    onCreateManyExchanges(data)
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

  const selectedAllRows = selectedRows.length === exchanges.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < exchanges.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-exchange-multi"
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <ExchangesActions onExport={handleOnExport} onImport={handleOnImport}  />
      </CardContent>

      <TableContainer>
        <Table>
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
              {columnHeader.map(header => (
                <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
              ))}
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

                <TableCell align="right">
                  <Tooltip title="Edit Product" arrow>
                    <IconButton
                      sx={{
                        '&:hover': {
                          background: theme.colors.primary.lighter
                        },
                        color: theme.palette.primary.main
                      }}
                      color="inherit"
                      size="small"
                    >
                      <EditTwoToneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Product" arrow>
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
                </TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
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
