import { Product, ProductStockStatus } from "@/services/types"
import { Typography } from "@mui/material"


const labels: Record<ProductStockStatus, string> = {
  [ProductStockStatus.Available]: "Available",
  [ProductStockStatus.OutOfStock]: "Outn of stock",
  [ProductStockStatus.AskForStock]: "Ask for stock",
  [ProductStockStatus.Discontinued]: "Discontinued"
}


export function RenderProductStockStatus({ product }: { product: Product }) {
  // const label = _.snakeCase(product.instockStatus)

  return <Typography>{labels[product.instockStatus]}</Typography>
}
