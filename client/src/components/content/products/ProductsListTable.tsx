import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { MuiLabel } from "@/components/ui";
import { BulkActions } from "@/components";
import { ProductsActions } from ".";


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
}

export function ProductsListTable(props: ProductsListTableProps) {
  const { products } = props

  const theme = useTheme()
  const [selectedRows, setSellectedRows] = useState<string[]>([])

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

  const selectedAllRows = selectedRows.length === products.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < products.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions
          selectedRows={selectedRows}
        />
      </Box>}

      <CardContent>
        <ProductsActions />
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

              {columnHeader.map(header => (
                <TableCell key={header.id} align={header.align}>{header.name}</TableCell>
              ))}
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
                  <img 
                    src={row.images[0] || "/public/default.jpg"} 
                    alt={row.title} 
                    height={100}
                  />
                </TableCell>

                {columnData.map(col => {
                  const key = col.id as keyof typeof row

                  const getRow = (key: keyof typeof row) => {
                    if (key === "categories") return row.categories.map(i => i.category.name).join(", ")
                    if (key === "salesCategory") return row.salesCategory.map(i => i.salesCategory.name).join(", ")
                    if (key === "brand") return row.brand.name || "empty"
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
                <TableCell align="right">
                  <Tooltip title="Edit Order" arrow>
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
                  <Tooltip title="Edit Order" arrow>
                    <IconButton
                      sx={{
                        '&:hover': {
                          background: theme.colors.error.lighter
                        },
                        color: theme.palette.error.main
                      }}
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
    </Card>
  )
}
