import { ProductSpecification } from "@/services/types"
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"


const columnHeader: {
  id: string,
  align: "left" | "right"
  name: string
}[] = [
  {
    id: "name",
    align: "left",
    name: "Label"
  },
  {
    id: "value",
    align: "left",
    name: "Value"
  }
]


interface ProductSpecificationTableProps {
  specs: ProductSpecification[]
}

export default function ProductSpecificationTable(props: ProductSpecificationTableProps) {
  const {specs} = props

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Typography variant="h2" fontWeight={700}>Specification</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="product specification">
          <TableHead>
            <TableRow>
              {columnHeader.map(col => {
                return <TableCell key={col.id} align={col.align}>{col.name}</TableCell>
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {specs.map(spec => {
              return <TableRow key={spec.id}>
                {columnHeader.map((col, idx) => {
                  return <TableCell key={idx} align={col.align}>{spec[col.id as keyof typeof spec] as string}</TableCell>
                })}
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
