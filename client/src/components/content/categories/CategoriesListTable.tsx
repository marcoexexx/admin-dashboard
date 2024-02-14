import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { PermissionKey } from "@/context/cacheKey";
import { Category } from "@/services/types";
import { BulkActions, LoadingTablePlaceholder } from "@/components";
import { MuiButton } from "@/components/ui";
import { FormModal } from "@/components/forms";
import { CategoriesActions } from ".";
import { CreateCategoryInput } from "./forms";
import { useState } from "react"
import { convertToExcel, exportToExcel } from "@/libs/exportToExcel";
import { usePermission, useStore } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { getCategoryPermissionsFn } from "@/services/permissionsApi";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


const columnData: TableColumnHeader<Category>[] = [
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

interface CategoriesListTableProps {
  categories: Category[]
  count: number
  isLoading?: boolean
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyCategories: (buf: ArrayBuffer) => void
}

export function CategoriesListTable(props: CategoriesListTableProps) {
  const { categories, count, isLoading, onCreateManyCategories, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {categoryFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? categories.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickDeleteAction = (categoryId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(categoryId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-category"
    })
  }

  const handleClickUpdateAction = (categoryId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/categories/update/${categoryId}`)
  }

  const handleOnExport = () => {
    exportToExcel(categories, "Categories")
  }

  const handleOnImport = (data: CreateCategoryInput[]) => {
    convertToExcel(data, "Categories")
      .then(excelBuffer => onCreateManyCategories(excelBuffer))
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
      type: "SET_CATEGORY_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_CATEGORY_FILTER",
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

  const isAllowedDeleteCategory = usePermission({
    key: PermissionKey.Category,
    actions: "delete",
    queryFn: getCategoryPermissionsFn
  })

  const isAllowedUpdateCategory = usePermission({
    key: PermissionKey.Category,
    actions: "update",
    queryFn: getCategoryPermissionsFn
  })

  const isAllowedCreateCategory = usePermission({
    key: PermissionKey.Category,
    actions: "create",
    queryFn: getCategoryPermissionsFn
  })

  const selectedAllRows = selectedRows.length === categories.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < categories.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-category-multi"
          isAllowedDelete={isAllowedDeleteCategory}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <CategoriesActions 
          onExport={handleOnExport} 
          onImport={handleOnImport}  
          isAllowedImport={isAllowedCreateCategory}
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
                  : isAllowedUpdateCategory && isAllowedDeleteCategory
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map(row => {
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

                {isAllowedUpdateCategory && isAllowedDeleteCategory
                ? <TableCell align="right">
                    {isAllowedUpdateCategory
                    ?  <Tooltip title="Edit Product" arrow>
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

                    {isAllowedDeleteCategory
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
          page={categoryFilter?.page
            ? categoryFilter.page - 1
            : 0}
          rowsPerPage={categoryFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-category"
      ? <FormModal
        field="delete-category"
        title="Delete category"
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
