import { SuspenseLoader } from "@/components";
import { getProductFn } from "@/services/productsApi";
import { Card } from "@mui/material";
import { useQuery } from "@tanstack/react-query";


interface ViewProductProps {
  productId: string | undefined
}

export function ProductDetail(props: ViewProductProps) {
  const { productId } = props

  const {
    data: product,
    isError: isProductError,
    isLoading: isProductLoading,
    error: productError
  } = useQuery({
    enabled: !!productId,
    queryKey: ["products", { id: productId }],
    queryFn: args => getProductFn(args, { productId }),
    select: data => data?.product
  })


  if (isProductError && productError) return <h1>ERROR: {JSON.stringify(productError)}</h1>
  if (!product || isProductLoading) return <SuspenseLoader />

  return (
    <Card>
      <h1>Title: {product.title}</h1>
      <h3>Price: {product.price}</h3>
      <h3>Quantity: {product.quantity}</h3>
    </Card>
  )
}
