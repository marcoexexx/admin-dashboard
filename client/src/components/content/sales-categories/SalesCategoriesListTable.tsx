import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { BulkActions } from "@/components";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { FormModal } from "@/components/forms";
import { exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { MuiButton } from "@/components/ui";

import { useNavigate } from "react-router-dom";
import { CreateSalesCategoryInput } from "./forms";
import { getSalesCategoryPermissionsFn } from "@/services/permissionsApi";
import { SalesCategoriesActions } from "./SalesCategoriesActions";


const columnData: TableColumnHeader<IBrand>[] = [
  {
    id: "name",
    align: "left",
    name: "Name"
  },
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface SalesCategoriesListTableProps {
  salesCategoiries: ISalesCategory[]
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManySalesCategories: (data: CreateSalesCategoryInput[]) => void
}

export function SalesCategoriesListTable(props: SalesCategoriesListTableProps) {
  const { salesCategoiries, count, onCreateManySalesCategories, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {salesCategoryFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? salesCategoiries.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickDeleteAction = (salesCategoryId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(salesCategoryId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-sales-category"
    })
  }

  const handleClickUpdateAction = (salesCategoryId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/sales-categories/update/${salesCategoryId}`)
  }

  const handleOnExport = () => {
    exportToExcel(salesCategoiries, "SalesCategories")
  }

  const handleOnImport = (data: CreateSalesCategoryInput[]) => {
    onCreateManySalesCategories(data)
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_SALES_CATEGORY_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_SALES_CATEGORY_FILTER",
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

  const isAllowedDeleteSalesCategory = usePermission({
    key: "sales-categor-permissions",
    actions: "delete",
    queryFn: getSalesCategoryPermissionsFn
  })

  const isAllowedUpdateSalesCategory = usePermission({
    key: "sales-categor-permissions",
    actions: "update",
    queryFn: getSalesCategoryPermissionsFn
  })

  const selectedAllRows = selectedRows.length === salesCategoiries.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < salesCategoiries.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-sales-category-multi"
          isAllowedDelete={isAllowedDeleteSalesCategory}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <SalesCategoriesActions onExport={handleOnExport} onImport={handleOnImport}  />
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
            {salesCategoiries.map(row => {
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
                    {row.name}
                  </Typography>
                </TableCell>)}

                <TableCell align="right">
                  {isAllowedUpdateSalesCategory
                  ?  <Tooltip title="Edit Sales category" arrow>
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

                  {isAllowedDeleteSalesCategory
                  ? <Tooltip title="Delete Sales category" arrow>
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
          page={salesCategoryFilter?.page
            ? salesCategoryFilter.page - 1
            : 0}
          rowsPerPage={salesCategoryFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-sales-category"
      ? <FormModal
        field="delete-sales-category"
        title="Delete sales category"
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