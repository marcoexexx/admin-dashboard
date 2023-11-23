import { Box, Card, CardHeader, Checkbox, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { BulkActions } from "."
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { MuiLabel } from "./ui"
import { useStore } from "@/hooks";
import { capitalize } from "lodash";


const statusOptions = [
  {
    id: "all",
    name: "All",
  },
  {
    id: "draft",
    name: "Draft",
  },
  {
    id: "pending",
    name: "Pending",
  },
  {
    id: "published",
    name: "Published",
  },
]

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
    name: "Status"
  }
])


interface ProductsListTableProps {
  products: IProduct[]
}

export function ProductsListTable(props: ProductsListTableProps) {
  const { products } = props

  const theme = useTheme()
  const { dispatch } = useStore()
  const [filter, setFilter] = useState({
    page: 0,
    limit: 5,
    status: "all" as Status
  })

  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleStatusChange = (evt: SelectChangeEvent): void => {
    const { value } = evt.target
    let status: Status = "all"
    if (evt.target.value !== "all") status = value as Status

    setFilter(prev => ({ ...prev, status }))

    if (status === "all") dispatch({ type: "SET_PRODUCT_FILTER", payload: {} })

    if (status !== "all") dispatch({ type: "SET_PRODUCT_FILTER", payload: {
      status: {
        equals: capitalize(status)
      }
    } })
  }

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

  const selectedAllRows = selectedRows.length === products.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < products.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions />
      </Box>}

      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter.status || "all"}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map(statusOption => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="Products Table"
        />
      )}

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
                    src={row.images[0] || "/public/samsung.jpg"} 
                    alt={row.title} 
                    height={100}
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
                    {row[col.id as keyof typeof row]}
                  </Typography>
                </TableCell>)}
                <TableCell align="right">
                  {getStatusLabel(row.status.toLowerCase())}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Order" arrow>
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
