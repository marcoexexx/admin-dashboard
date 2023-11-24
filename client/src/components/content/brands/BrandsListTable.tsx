import { Box, Card, CardContent, Checkbox, Divider, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useTheme } from "@mui/material"
import { useState } from "react"
import { BulkActions } from "@/components";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

import { BrandsActions } from ".";


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


interface ProductsListTableProps {
  brands: IBrand[]
}

export function BrandsListTable(props: ProductsListTableProps) {
  const { brands } = props

  const theme = useTheme()
  const [selectedRows, setSellectedRows] = useState<string[]>([])

  const selectedBulkActions = selectedRows.length > 0

  const handleSelectAll = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = evt.target
    setSellectedRows(checked
      ? brands.map(e => e.id)
      : []
    )
  }

  const handleSelectOne = (id: string) => (_: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedRows.includes(id)) setSellectedRows(prev => ([ ...prev, id ]))
    else setSellectedRows(prev => prev.filter(prevId => prevId !== id))
  }

  const selectedAllRows = selectedRows.length === brands.length
  const selectedSomeRows = selectedRows.length > 0 && 
    selectedRows.length < brands.length

  return (
    <Card>
      {selectedBulkActions && <Box flex={1} p={2}>
        <BulkActions />
      </Box>}

      <Divider />

      <CardContent>
        <BrandsActions />
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
            {brands.map(row => {
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
