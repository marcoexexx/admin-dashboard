import { Box, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useTheme } from "@mui/material";
import { FormModal } from "./forms";
import { MuiButton } from "./ui";
import { BulkActions, EnhancedTableActions, LoadingTablePlaceholder } from ".";
import { OperationAction, Resource, User } from "@/services/types";
import { ModalFormField } from "@/context/store";
import { usePermission, useStore } from "@/hooks";
import { useMemo, useReducer } from "react";
import { convertToExcel, exportToExcel } from "@/libs/exportToExcel";
import { useNavigate } from "react-router-dom";

import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AppError, { AppErrorKind } from "@/libs/exceptions";


const excelUploadRowKeys: Record<Resource, ModalFormField> = {
  [Resource.Role]: "excel-roles",
  [Resource.Permission]: "excel-cart",
  [Resource.Cart]: "excel-cart",
  [Resource.OrderItem]: "excel-order-items",

  [Resource.AccessLog]: "excel-access-logs",
  [Resource.AuditLog]: "excel-audit-logs",
  [Resource.User]: "excel-users",
  [Resource.PickupAddress]: "excel-pickup-addresses",
  [Resource.Brand]: "excel-brands",
  [Resource.Category]: "excel-categories",
  [Resource.Coupon]: "excel-coupons",
  [Resource.Exchange]: "excel-exchanges",
  [Resource.Order]: "excel-orders",
  [Resource.PotentialOrder]: "excel-potential-orders",
  [Resource.Product]: "excel-products",
  [Resource.Region]: "excel-regions",
  [Resource.SalesCategory]: "excel-sales-categories",
  [Resource.Township]: "excel-townships",
  [Resource.UserAddress]: "excel-addresses",
  [Resource.Shopowner]: "excel-shopowners",
}

const deleteSingleRowKeys: Record<Resource, ModalFormField> = {
  [Resource.Role]: "*",
  [Resource.Permission]: "*",
  [Resource.Cart]: "*",
  [Resource.OrderItem]: "*",

  [Resource.AccessLog]: "*",
  [Resource.AuditLog]: "*",
  [Resource.User]: "*",
  [Resource.PickupAddress]: "*",
  [Resource.Brand]: "delete-brand",
  [Resource.Category]: "delete-category",
  [Resource.Coupon]: "delete-coupon",
  [Resource.Exchange]: "delete-exchange",
  [Resource.Order]: "delete-order",
  [Resource.PotentialOrder]: "delete-potential-order",
  [Resource.Product]: "delete-product",
  [Resource.Region]: "delete-region",
  [Resource.SalesCategory]: "delete-sales-category",
  [Resource.Township]: "delete-township",
  [Resource.UserAddress]: "delete-addresse",
  [Resource.Shopowner]: "delete-shopowner",
}

const deleteMultiRowKeys: Record<Resource, ModalFormField> = {
  [Resource.Role]: "*",
  [Resource.Permission]: "*",
  [Resource.Cart]: "*",
  [Resource.OrderItem]: "*",

  [Resource.AccessLog]: "*",
  [Resource.AuditLog]: "*",
  [Resource.User]: "*",
  [Resource.PickupAddress]: "*",
  [Resource.Brand]: "delete-brands-multi",
  [Resource.Category]: "delete-categories-multi",
  [Resource.Coupon]: "delete-coupons-multi",
  [Resource.Exchange]: "delete-exchanges-multi",
  [Resource.Order]: "delete-orders-multi",
  [Resource.PotentialOrder]: "delete-potential-orders-multi",
  [Resource.Product]: "delete-products-multi",
  [Resource.Region]: "delete-regions-multi",
  [Resource.SalesCategory]: "delete-sales-categories-multi",
  [Resource.Township]: "delete-townships-multi",
  [Resource.UserAddress]: "delete-addresses-multi",
  [Resource.Shopowner]: "delete-shopowners-multi",
}


export type TypedColumn<T extends object> = {
  id: keyof T,
  name: string,
  align: "right" | "left" | "center",
  render: ({ value, me }: { value: T, me?: User }) => React.ReactElement | null
}

export type DynamicColumn<T extends object> = {
  id: string,
  name: string,
  align: "right" | "left" | "center"
  render: ({ value, me }: { value: T, me?: User }) => React.ReactElement | null
}


const initState = {
  selectedRows: [] as string[],
  singleDeleteRow: undefined as string | undefined,
  uploadData: undefined as any
}
type TableState = typeof initState

type TableAction =
  | { type: "SET_SELECTED_ROWS", payload: string[] }
  | { type: "SINGLE_SELECT", payload: string }
  | { type: "SINGLE_UNSELECT", payload: string }
  | { type: "SET_DELETE_ROW", payload: string }
  | { type: "SET_UPLOAD_DATA", payload: any }


const reducer = (state: typeof initState, action: TableAction): TableState => {
  switch (action.type) {
    case "SET_SELECTED_ROWS": {
      return { ...state, selectedRows: action.payload }
    }

    case "SINGLE_SELECT": {
      return { ...state, selectedRows: [...state.selectedRows, action.payload] }
    }

    case "SINGLE_UNSELECT": {
      return { ...state, selectedRows: state.selectedRows.filter(prev => prev !== action.payload) }
    }

    case "SET_DELETE_ROW": {
      return { ...state, singleDeleteRow: action.payload }
    }

    case "SET_UPLOAD_DATA": {
      return { ...state, uploadData: action.payload }
    }

    default: {
      const _unreachable: never = action
      console.error({ _unreachable })
      throw AppError.new(AppErrorKind.InvalidInputError, "Unhandled action type")
    }
  }
}


interface EnhancedTableProps<Row extends object> {
  isLoading?: boolean
  resource: Resource
  columns: DynamicColumn<Row>[]
  refreshKey: any
  rows: Row[]
  renderFilterForm?: React.ReactElement
  hideCheckbox?: boolean
  hideTopActions?: boolean
  onSingleDelete?: (id: string) => void
  onMultiDelete?: (ids: string[]) => void
  onMultiCreate?: (buf: ArrayBuffer) => void
}

export function EnhancedTable<Row extends { id: string }>(props: EnhancedTableProps<Row>) {
  const [state, tableStateDispatch] = useReducer(reducer, initState)

  const { state: { modalForm, user }, dispatch } = useStore()
  const { isLoading, resource, rows, columns: cols, onSingleDelete, onMultiDelete, onMultiCreate, renderFilterForm, refreshKey, hideCheckbox, hideTopActions } = props
  const { selectedRows, singleDeleteRow, uploadData } = state

  const isSelectedAllRows = rows.length === selectedRows.length
  const isSelectedSomeRows = selectedRows.length > 0 &&
    selectedRows.length < rows.length

  const navigate = useNavigate()
  const theme = useTheme()
  const columns = useMemo(() => cols.concat({
    id: "actions",
    name: "Actions",
    align: "right",
    render: () => null
  }), [])

  const unimplementedFeature = () => dispatch({
    type: "OPEN_TOAST", payload: {
      message: `Unimplemented feature: ${resource}`,
      severity: "warning"
    }
  })

  const isAllowedUpdate = usePermission({
    action: OperationAction.Update,
    resource
  }).is_ok()

  const isAllowedDelete = usePermission({
    action: OperationAction.Delete,
    resource
  }).is_ok()

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    tableStateDispatch({ type: "SET_SELECTED_ROWS", payload: checked ? rows.map(i => i.id) : [] })
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) tableStateDispatch({ type: "SINGLE_SELECT", payload: id })
    else tableStateDispatch({ type: "SINGLE_UNSELECT", payload: id })
  }

  const handleClickDeleteAction = (id: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    tableStateDispatch({ type: "SET_DELETE_ROW", payload: id })
    dispatch({ type: "OPEN_MODAL_FORM", payload: deleteSingleRowKeys[resource] })
  }

  const handleClickUpdateAction = (id: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/${refreshKey[0]}/update/${id}`)
  }

  const handleMultiDelete = (ids: string[]) => () => {
    if (!onMultiDelete) return unimplementedFeature()
    onMultiDelete(ids)
  }

  const handleSingleDelete = (id: string) => () => {
    if (!onSingleDelete) return unimplementedFeature()
    onSingleDelete(id)
  }

  const handleCloseModal = () => {
    dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
  }

  const handleOnExport = () => {
    exportToExcel(rows.filter(row => selectedRows.includes(row.id)), resource)
  }

  const handleOnImportAction = (data: Row[]) => {
    dispatch({ type: "OPEN_MODAL_FORM", payload: "excel-brands" })
    tableStateDispatch({ type: "SET_UPLOAD_DATA", payload: data })
  }

  const handleOnImport = () => {
    if (!onMultiCreate) return unimplementedFeature()

    dispatch({ type: "OPEN_BACKDROP" })

    convertToExcel(uploadData, resource)
      .then(excelBuffer => onMultiCreate(excelBuffer))
      .catch(err => dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Failed Excel upload: ${err.message}`,
          severity: "error"
        }
      }))
  }


  return <>
    {selectedRows.length > 0 && <Box flex={1} p={2}>
      <BulkActions
        field={deleteMultiRowKeys[resource]}
        isAllowedDelete={isAllowedDelete}
        onDelete={handleMultiDelete(selectedRows)}
      />
    </Box>}

    <Divider />

    {hideTopActions
      ? null
      : <CardContent>
        <EnhancedTableActions
          refreshKey={refreshKey}
          onImport={onMultiCreate ? handleOnImportAction : undefined}
          onExport={handleOnExport}
          renderFilterForm={renderFilterForm}
          resource={resource}
        />
      </CardContent>}

    <TableContainer>
      {isLoading
        ? <LoadingTablePlaceholder />
        : <Table>
          <TableHead>
            <TableRow>
              {hideCheckbox
                ? null
                : <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isSelectedAllRows}
                    indeterminate={isSelectedSomeRows}
                    onChange={handleSelectAll}
                  />
                </TableCell>}

              {columns.map(col => {
                const render = <TableCell key={col.id} align={col.align}>{col.name}</TableCell>
                return col.id !== "actions"
                  ? render
                  : isAllowedUpdate || isAllowedDelete
                    ? render
                    : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map(row => {
              const isSelected = selectedRows.includes(row.id)
              return <TableRow
                hover
                key={row.id}
                selected={isSelected}
              >
                {hideCheckbox
                  ? null
                  : <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={handleSelectOne(row.id)}
                      value={isSelected}
                    />
                  </TableCell>}

                {cols.map((col, idx) => {
                  return <TableCell key={idx} align={col.align}>
                    {col.render({ value: row, me: user })}
                  </TableCell>
                })}

                {isAllowedUpdate || isAllowedDelete
                  ? <TableCell align="right">
                    {isAllowedUpdate
                      ? <Tooltip title="Edit" arrow>
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

                    {isAllowedDelete
                      ? <Tooltip title="Delete" arrow>
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

    {modalForm.field === deleteSingleRowKeys[resource] && singleDeleteRow
      ? <FormModal
        field={deleteSingleRowKeys[resource]}
        title="Delete row"
      >
        <Box display="flex" flexDirection="column" gap={1}>
          <Box>
            <Typography>Are you sure want to delete</Typography>
          </Box>
          <Box display="flex" flexDirection="row" gap={1}>
            <MuiButton variant="contained" color="error" onClick={handleSingleDelete(singleDeleteRow)}>Delete</MuiButton>
            <MuiButton variant="outlined" onClick={handleCloseModal}>Cancel</MuiButton>
          </Box>
        </Box>
      </FormModal>
      : null}

    {modalForm.field === excelUploadRowKeys[resource]
      ? <FormModal
        field={excelUploadRowKeys[resource]}
        title="Excel upload"
      >
        <Box display="flex" flexDirection="column" gap={2} alignItems="end">
          <Box>
            <Typography>Are you sure want to upload, This may update or create rows</Typography>
          </Box>
          <Box display="flex" flexDirection="row" gap={1}>
            <MuiButton variant="contained" color="error" onClick={handleOnImport}>Upload</MuiButton>
            <MuiButton variant="outlined" onClick={handleCloseModal}>Cancel</MuiButton>
          </Box>
        </Box>
      </FormModal>
      : null}
  </>
}
