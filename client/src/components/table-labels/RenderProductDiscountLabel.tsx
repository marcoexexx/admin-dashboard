import { Product } from "@/services/types"
import { Box, Typography } from "@mui/material"
import { calculateProductDiscount } from "../content/products/detail/ProductDetailTab"

export function RenderProductDiscountLabel({ product }: { product: Product }) {
  const { productDiscountAmount, productDiscountPercent } = calculateProductDiscount(product)

  return <Box display="flex" alignItems="center" flexDirection="column">
    <Typography>{productDiscountPercent} %</Typography>
    <Typography>{productDiscountAmount}</Typography>
  </Box>
}
