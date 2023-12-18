import { Box, Card, CardContent, Checkbox, Divider, IconButton, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography, useTheme, Theme } from "@mui/material"
import { useState } from "react"
import { MuiButton } from "@/components/ui";
import { BulkActions } from "@/components";
import { ProductsActions } from ".";
import { CreateProductInput } from "./forms";
import { useStore, usePermission, useOnlyAdmin } from "@/hooks";
import { exportToExcel } from "@/libs/exportToExcel";
import { FormModal } from "@/components/forms";
import { getProductPermissionsFn } from "@/services/permissionsApi";
import { RenderBrandLabel, RenderImageLabel, RenderProductLabel, RenderSalesCategoryLabel } from "@/components/table-labels";
import { RenderCategoryLabel } from "@/components/table-labels/RenderCategoryLabel";
import { useNavigate } from "react-router-dom";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';


const productStatus: {
  label: ProductStatus,
  color: (theme: Theme) => string,
  schema: "error" | "warning" | "success"
}[] = [
  {
    label: "Draft" as const,
    color: (theme) => theme.colors.error.main,
    schema: "error" as const,
  },
  {
    label: "Pending" as const,
    color: (theme) => theme.colors.warning.main,
    schema: "warning" as const,
  }, 
  {
    label: "Published" as const,
    color: (theme) => theme.colors.success.main,
    schema: "success" as const,
  }
]


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
  onStatusChange: (product: IProduct, status: ProductStatus) => void
  onMultiDelete: (ids: string[]) => void
  onCreateManyProducts: (data: CreateProductInput[]) => void
}

export function ProductsListTable(props: ProductsListTableProps) {
  const { products, count, onDelete, onMultiDelete, onCreateManyProducts, onStatusChange } = props

  const navigate = useNavigate()

  const theme = useTheme()
  const { state: {productFilter, modalForm}, dispatch } = useStore()

  const [selectedRows, setSellectedRows] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState("")

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

  const handleUpdateAction = (productId: IProduct["id"]) => (_: React.MouseEvent<HTMLButtonElement>) => {
    navigate(`/products/update/${productId}`)
  }

  const handleClickDeleteAction = (exchangeId: string) => (_: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteId(exchangeId)
    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "delete-product"
    })
  }

  const handleOnExport = () => {
    const prepare = products.map(product => ({
      ...product,
      brandName: product.brand.name,
      images: product.images.join("\n"),
      categories: product.categories.map(category => category.category.name).join("\n"),
      salesCategory: product.salesCategory.map(sale => sale.salesCategory.name).join("\n"),
      specification: product.specification.map(spec => `${spec.name}: ${spec.value}`).join("\n")
    }))

    exportToExcel(prepare, "Products")
  }

  // TODO: create multi product
  const handleOnImport = (data: any[]) => {
    onCreateManyProducts(data.map(product => ({
      ...product,
      colors: product.colors?.split("\n") || [],
      images: product.images?.split("\n") || [],
      overview: product.overview || "-",
      type: product.type || undefined,
      salesCategory: product.salesCategory || ""
    })))
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

  const handleCloseModal = () => {
    dispatch({
      type: "CLOSE_ALL_MODAL_FORM"
    })
  }

  const handleChangeProductStatus = (product: IProduct) => (evt: SelectChangeEvent) => {
    const { value } = evt.target
    onStatusChange(product, value as ProductStatus)
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

  const isAllowedCreateProduct = usePermission({
    key: "product-permissions",
    actions: "create",
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
          isAllowedImport={isAllowedCreateProduct}
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
                    if (key === "title") return <RenderProductLabel product={row} />
                    if (key === "specification") return "Coming soon"
                    return row[key] as string
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
                  <Select
                    labelId="product-state"
                    value={row.status}
                    onChange={handleChangeProductStatus(row)}
                    size="small"
                    color={row.status === "Draft" 
                      ? productStatus[0].schema
                      : row.status === "Pending" 
                      ? productStatus[1].schema
                      : row.status === "Published" 
                      ? productStatus[2].schema 
                      : "primary"}
                  >
                    {productStatus.map(status => {
                      return <MenuItem 
                        disabled={status.label === "Published" && !onlyAdminAccess} 
                        key={status.label} 
                        value={status.label}
                      >
                        <Typography color={status.color(theme)}>{status.label}</Typography>
                      </MenuItem>
                    })}
                  </Select>
                </TableCell>

                {onlyAdminAccess && isAllowedUpdateProduct && isAllowedDeleteProduct
                ? <TableCell align="right">
                  <Box
                    display="flex"
                    flexDirection="row"
                  >
                    {isAllowedUpdateProduct
                    ? <Tooltip title="Edit Product" arrow>
                        <IconButton
                          onClick={handleUpdateAction(row.id)}
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
    </Card>
  )
}
