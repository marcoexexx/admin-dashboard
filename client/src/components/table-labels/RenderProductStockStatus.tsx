import { Product, ProductStockStatus } from "@/services/types";
import { Typography } from "@mui/material";

export const productStockStatusLabel: Record<ProductStockStatus, string> =
  {
    [ProductStockStatus.Available]: "Available",
    [ProductStockStatus.OutOfStock]: "Out of stock",
    [ProductStockStatus.AskForStock]: "Ask for stock",
    [ProductStockStatus.Discontinued]: "Discontinued",
  };

export function RenderProductStockStatus(
  { product }: { product: Product; },
) {
  // const label = _.snakeCase(product.instockStatus)

  return (
    <Typography>
      {productStockStatusLabel[product.instockStatus]}
    </Typography>
  );
}
