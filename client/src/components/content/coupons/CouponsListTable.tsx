import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { BulkActions } from "@/components";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { FormModal } from "@/components/forms";
import { usePermission, useStore } from "@/hooks";
import { MuiButton } from "@/components/ui";
import { convertToExcel, exportToExcel } from "@/libs/exportToExcel";
import { CouponsActions } from ".";
import { useNavigate } from "react-router-dom";
import { getCouponsPermissionsFn } from "@/services/permissionsApi";
import { RenderImageLabel, RenderProductLabel } from "@/components/table-labels";
import { CreateCouponInput } from "./forms";


const columnData: TableColumnHeader<Coupon>[] = [
  {
    id: "label",
    align: "left",
    name: "Label"
  },
  {
    id: "points",
    align: "left",
    name: "Points"
  },
  {
    id: "dolla",
    align: "left",
    name: "Dolla"
  },
  {
    id: "product",
    align: "left",
    name: "Product"
  },
  {
    id: "isUsed",
    align: "right",
    name: "Used"
  },
]

const columnHeader = columnData.concat([
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])

interface CouponsListTableProps {
  coupons: Coupon[]
  count: number
  onDelete: (id: string) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyCoupons: (buf: ArrayBuffer) => void
}

export function CouponsListTable(props: CouponsListTableProps) {
  const { coupons, count, onCreateManyCoupons, onDelete, onMultiDelete } = props

  const [deleteId, setDeleteId] = useState("")

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {couponFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? coupons.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleClickUpdateAction = (couponId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/coupons/update/${couponId}`)
  }

  const handleClickDeleteAction = (couponId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(couponId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-coupon"
    })
  }

  const handleOnExport = () => {
    exportToExcel(coupons, "Coupons")
  }

  const handleOnImport = (data: CreateCouponInput[]) => {
    convertToExcel(data, "Coupons")
      .then(excelBuffer => onCreateManyCoupons(excelBuffer))
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
      type: "SET_COUPON_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_COUPON_FILTER",
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

  const isAllowedUpdateCoupon = usePermission({
    key: "coupons-permissions",
    actions: "update",
    queryFn: getCouponsPermissionsFn
  })

  const isAllowedDeleteCoupon = usePermission({
    key: "coupons-permissions",
    actions: "delete",
    queryFn: getCouponsPermissionsFn
  })

  const isAllowedCreateCoupon = usePermission({
    key: "coupons-permissions",
    actions: "create",
    queryFn: getCouponsPermissionsFn
  })

  const selectedAllRows = selectedRows.length === coupons.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < coupons.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-coupon-multi"
          isAllowedDelete={isAllowedDeleteCoupon}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <CouponsActions 
          onExport={handleOnExport} 
          onImport={handleOnImport}  
          isAllowedImport={isAllowedCreateCoupon}
        />
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

              <TableCell align="left">Image</TableCell>

              {columnHeader.map(header => {
                const render = <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
                return header.id !== "actions"
                  ? render
                  : isAllowedUpdateCoupon && isAllowedDeleteCoupon
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {coupons.map(row => {
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

                <TableCell align="left">
                  <RenderImageLabel
                    src={row.image || "/default.jpg"}
                    alt={row.label} 
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
                      {key === "expiredDate"
                        ? (new Date(dataRow as string)).toLocaleString()
                        : key === "isUsed"
                        ? dataRow ? "Used" : "Un used"
                        : key === "product" && dataRow
                        ? <RenderProductLabel product={dataRow as IProduct} /> 
                        : dataRow as string}
                    </Typography>
                  </TableCell>
                  )
                })}

                {isAllowedUpdateCoupon && isAllowedDeleteCoupon
                ? <TableCell align="right">
                    {isAllowedUpdateCoupon
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
                    
                    {isAllowedDeleteCoupon
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
        </Table>
      </TableContainer>

      <Box p={2}>
        <TablePagination
          component="div"
          count={count}
          onPageChange={handleChangePagination}
          onRowsPerPageChange={handleChangeLimit}
          page={couponFilter?.page
            ? couponFilter.page - 1
            : 0}
          rowsPerPage={couponFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-coupon"
      ? <FormModal
        field="delete-coupon"
        title="Delete coupon"
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
