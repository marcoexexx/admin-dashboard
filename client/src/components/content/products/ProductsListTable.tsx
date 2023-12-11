import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { MuiButton, MuiLabel } from "@/components/ui";
import { BulkActions } from "@/components";
import { ProductsActions } from ".";
import { CreateProductInput } from "./forms";
import { useStore, usePermission, useOnlyAdmin } from "@/hooks";
import { exportToExcel } from "@/libs/exportToExcel";
import { FormModal } from "@/components/forms";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { getProductPermissionsFn } from "@/services/permissionsApi";
import { RenderBrandLabel, RenderImageLabel, RenderSalesCategoryLabel } from "@/components/table-labels";
import { RenderCategoryLabel } from "@/components/table-labels/RenderCategoryLabel";


const getStatusLabel = (status: Omit<Status, "all">): JSX.Element => {
  const map = {
    draft: {
      label: "Drift",
      color: "error" as const
    },
    pending: {
      label: "Pending",
      color: "warning" as const
    }, 
    published: {
      label: "Published",
      color: "success" as const
    },
  }
  const { label, color } = map[status as keyof typeof map]
  return <MuiLabel color={color}>{label}</MuiLabel>
}


const columnData: TableColumnHeader<IProduct>[] = [
  {
    id: "title",
    align: "left",
    name: "Title"
  },
  {
    id: "price",
    align: "right",
    name: "Price"
  },
  {
    id: "brand",
    align: "right",
    name: "Brand"
  },
  {
    id: "categories",
    align: "right",
    name: "Categories"
  },
  {
    id: "salesCategory",
    align: "right",
    name: "Sales Categories"
  },
  {
    id: "instockStatus",
    align: "right",
    name: "InstockStatus"
  },
  {
    id: "priceUnit",
    align: "right",
    name: "PriceUnit"
  },
]

const columnHeader = columnData.concat([
  {
    id: "status",
    align: "right",
    name: "Status"
  },
  {
    id: "actions",
    align: "right",
    name: "Actions"
  }
])


interface ProductsListTableProps {
  products: IProduct[]
  count: number,
  onDelete: (id: string) => void
  onPublished: (product: IProduct) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyProducts: (data: CreateProductInput[]) => void
}

export function ProductsListTable(props: ProductsListTableProps) {
  const { products, count, onDelete, onMultiDelete, onCreateManyProducts, onPublished } = props

  const theme = useTheme()
  const { state: {productFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState("")
  const [updateProduct, setUpdateProduct] = useState<IProduct|null>(null)

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? products.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const handleUpdateProduct = (product: IProduct) => (_: React.MouseEvent<HTMLButtonElement>) => {
    console.log(product)
  }

  const handleClickDeleteAction = (exchangeId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(exchangeId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-product"
    })
  }

  const handleOnExport = () => {
    exportToExcel(products, "Products")
  }

  const handleOnImport = (data: CreateProductInput[]) => {
    onCreateManyProducts(data)
  }

  const handleChangePagination = (_: any, page: number) => {
    dispatch({
      type: "SET_PRODUCT_FILTER",
      payload: {
        page: page += 1
      }
    })
  }

  const handleChangeLimit = (evt: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_PRODUCT_FILTER",
      payload: {
        limit: parseInt(evt.target.value, 10)
      }
    })
  }

  const handlePublishedProduct = (product: IProduct) => (_: React.MouseEvent<HTMLButtonElement>) => {
    if (product.status === "Pending") {
      setUpdateProduct(product)
      dispatch({
        type: "OPEN_MODAL_FORM",
        payload: "update-product"
      })
    } else if (product.status === "Published") {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Already published",
          severity: "info"
        }
      })
    } else {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: "Cannot published for `Draft` state",
          severity: "error"
        }
      })
    }
  }

  const handleCloseModal = () => {
    dispatch({
      type: "CLOSE_ALL_MODAL_FORM"
    })
  }

  const selectedAllRows = selectedRows.length === products.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < products.length


  const onlyAdminAccess = useOnlyAdmin()

  const isAllowedUpdateProduct = usePermission({
    key: "product-permissions",
    actions: "update",
    queryFn: getProductPermissionsFn,
  })

  const isAllowedDeleteProduct = usePermission({
    key: "product-permissions",
    actions: "update",
    queryFn: getProductPermissionsFn,
  })

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          field="delete-product-multi"
          isAllowedDelete={isAllowedDeleteProduct}
          onDelete={() => onMultiDelete(selectedRows)}
        />
      </Box>}

      <Divider />

      <CardContent>
        <ProductsActions 
          onExport={handleOnExport}
          onImport={handleOnImport}
        />
      </CardContent>

      <Divider />

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
                  : onlyAdminAccess && isAllowedUpdateProduct && isAllowedDeleteProduct
                  ? render
                  : null
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map(row => {
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
                    src={row.images[0] || "/public/default.jpg"}
                    alt={row.title} 
                  />
                </TableCell>

                {columnData.map(col => {
                  const key = col.id as keyof typeof row

                  const getRow = (key: keyof typeof row) => {
                    if (key === "categories") return row.categories.map(({category}, idx) => <RenderCategoryLabel key={idx} category={category} />)
                    if (key === "salesCategory") return row.salesCategory.map(({salesCategory}, idx) => <RenderSalesCategoryLabel key={idx} salesCategory={salesCategory} />)
                    if (key === "brand") return <RenderBrandLabel brand={row.brand} />
                    return row[key]
                  }

                  return (
                    <TableCell align={col.align} key={col.id}>
                      <Typography
                        variant="body1"
                        fontWeight="normal"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {getRow(key)}
                      </Typography>
                    </TableCell>
                  )
                })}

                <TableCell align="right">
                  {getStatusLabel(row.status.toLowerCase())}
                </TableCell>

                {onlyAdminAccess && isAllowedUpdateProduct && isAllowedDeleteProduct
                ? <TableCell align="right">
                  <Box
                    display="flex"
                    flexDirection="row"
                  >
                    {onlyAdminAccess
                    ? <Tooltip title="Published product" arrow>
                        <IconButton
                          onClick={handlePublishedProduct(row)}
                          sx={{
                            '&:hover': {
                              background: theme.colors.primary.lighter
                            },
                            color: theme.palette.primary.main
                          }}
                          color="inherit"
                          size="small"
                        >
                          <PublishedWithChangesIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    : null}
                    {isAllowedUpdateProduct
                    ? <Tooltip title="Edit Product" arrow>
                        <IconButton
                          onClick={handleUpdateProduct(row)}
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
                    : null}
                    {isAllowedDeleteProduct
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
                  </Box>
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
          page={productFilter?.page
            ? productFilter.page - 1
            : 0}
          rowsPerPage={productFilter?.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>

      {modalForm.field === "delete-product"
      ? <FormModal
          field="delete-product"
          title="Delete product"
          onClose={handleCloseModal}
        >
          <Box display="flex" flexDirection="column" gap={1}>
            <Box>
              <Typography>Are you sure want to delete</Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap={1}>
              <MuiButton
                variant="contained"
                color="error"
                onClick={() => onDelete(deleteId)}
              >
                Delete
              </MuiButton>
              
              <MuiButton
                variant="outlined"
                onClick={() => dispatch({ type: "CLOSE_ALL_MODAL_FORM" })}
              >
                Cancel
              </MuiButton>
            </Box>
          </Box>
        </FormModal>
      : null}

      {modalForm.field === "update-product"
      ? <FormModal
          field="update-product"
          title="Update product"
          onClose={handleCloseModal}
        >
          <Box display="flex" flexDirection="column" gap={1}>
            <Box>
              <Typography>Are you sure want to update</Typography>
            </Box>
            <Box display="flex" flexDirection="row" gap={1}>
              <MuiButton
                variant="contained"
                color="error"
                onClick={() => updateProduct ? onPublished(updateProduct) : null}
              >
                Save
              </MuiButton>
              
              <MuiButton
                variant="outlined"
                onClick={() => dispatch({ type: "CLOSE_ALL_MODAL_FORM" })}
              >
                Cancel
              </MuiButton>
            </Box>
          </Box>
        </FormModal>
      : null}
    </Card>
  )
}
