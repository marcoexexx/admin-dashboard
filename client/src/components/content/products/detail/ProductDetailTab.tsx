import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween"

import { Box, Card, CardActions, CardMedia, Divider, IconButton, Tooltip, Typography, styled } from "@mui/material"
import { MuiButton, Text } from '@/components/ui'
import { OrderItem, Product } from "@/services/types";
import { Resource } from "@/context/cacheKey";
import { memoize } from "lodash";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage, useStore } from "@/hooks";
import { queryClient } from "@/components";
import { likeProductByUserFn, unLikeProductByUserFn } from "@/services/productsApi";
import { playSoundEffect } from "@/libs/playSound";

import ProductRelationshipTable from "./ProductRelationshipTable";
import ProductSpecificationTable from "./ProductSpecificationTable"
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUp';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RefreshIcon from "@mui/icons-material/Refresh";


dayjs.extend(isBetween)


export const calculateProductDiscount = memoize((product: Product | undefined) => {
  if (!product) return { saving: 0, productDiscountAmount: 0 }

  const originalProductDiscount = product.discount
  const activeSaleDiscount = product.salesCategory?.find(sale => sale.salesCategory.isActive && dayjs().isBetween(sale.salesCategory.startDate, sale.salesCategory.endDate) && sale.salesCategory.isActive)?.discount

  const productDiscountPercent = activeSaleDiscount ?? originalProductDiscount  // may be 0 due to the active sale discount
  const productDiscountAmount = product.price - (product.price * productDiscountPercent) / 100

  return { productDiscountAmount, productDiscountPercent }
})


const CardActionsWrapper = styled(CardActions)(({theme}) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(3)
}))


interface ProductDetailTabProps {
  product: Product
}

export default function ProductDetailTab(props: ProductDetailTabProps) {
  const { product } = props

  const { state, dispatch } = useStore()

  const { set, get } = useLocalStorage()

  const { mutate: likeProduct, isPending: likeIsPending } = useMutation({
    mutationFn: likeProductByUserFn,
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Success Like product ${product.title}`,
          severity: "success"
        }
      })
      queryClient.invalidateQueries({
        queryKey: [Resource.Product]
      })
      playSoundEffect("success")
    },
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Failed like product ${product.title}: ${err.data.response.message}`,
          severity: "success"
        }
      })
      playSoundEffect("error")
    }
  })

  const { mutate: unLikeProduct, isPending: unLikeIsPending } = useMutation({
    mutationFn: unLikeProductByUserFn,
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Unlike product ${product.title}`,
          severity: "success"
        }
      })
      queryClient.invalidateQueries({
        queryKey: [Resource.Product]
      })
      playSoundEffect("success")
    },
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Failed unlike product ${product.title}: ${err.data.response.message}`,
          severity: "success"
        }
      })
      playSoundEffect("error")
    }
  })

  const handleAddToCart = () => {
    const initialQuality = 1

    const { productDiscountAmount } = calculateProductDiscount(product)

    const originalTotalPrice = initialQuality * product.price
    const totalPrice = initialQuality * productDiscountAmount

    const newPayload: Omit<OrderItem, "createdAt" | "updatedAt"> = {
      id: crypto.randomUUID(),  // For unique item, not necessary for api
      product,
      productId: product.id,
      price: product.price,
      quantity: initialQuality,
      originalTotalPrice,
      totalPrice,
      saving: originalTotalPrice - totalPrice,
    }

    const payload = get<OrderItem[]>("CARTS") || []

    set("CARTS", [...payload, newPayload])

    dispatch({
      type: "OPEN_MODAL_FORM",
      payload: "cart"
    })
  }

  const likedTotal = product._count.likedUsers
  const reviewsTotal = product._count.reviews

  const isPending = likeIsPending || unLikeIsPending

  const handleOnLikeProduct = () => {
    if (state.user) likeProduct({ productId: product.id, userId: state.user.id })
  }

  const handleOnUnLikeProduct = () => {
    if (state.user) unLikeProduct({ productId: product.id, userId: state.user.id })
  }

  const isLiked = (product as Product & {likedUsers: { productId: string, userId: string }[]} ).likedUsers.find(fav => fav.userId === state.user?.id) 
    ? true 
    : false

  const handleRefreshList = () => {
    queryClient.invalidateQueries({
      queryKey: [Resource.Product, { id: product.id }]
    })
  }


  return (
    <Card>
      <CardMedia 
        sx={{ minHeight: 800 }}
        image={product.images[0] || "/pubic/default.jpg"}
        title={product.title}
      />

      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h2" sx={{ p: 3 }}>{product.title}</Typography>
        <Box alignSelf="center">
          <Tooltip title="Refresh products" arrow sx={{ mr: 2 }}>
            <IconButton aria-label="refresh button" onClick={handleRefreshList}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider />

      <Box p={3}>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />

        {product.specification
        ? <ProductSpecificationTable specs={product.specification} />
        : "There is no specifications"}

        <ProductRelationshipTable
          brand={product.brand}
          categories={product.categories}
          salesCategories={product.salesCategory}
        />
      </Box>

      <Box p={3}>
        <Typography variant="h2">Discount and Sales</Typography>
        <Typography>Original discount: {product.discount}%</Typography>

        <Typography>Sales discounts</Typography>
        {product.salesCategory?.map(sale => (
          <Typography key={sale.id}>{sale.salesCategory.name} {"->"} {sale.discount}% :: {sale.salesCategory.isActive ? "Active" : "Unactive"}</Typography>
        ))}
      </Box>

      <Divider />

      <CardActionsWrapper
        sx={{
          display: {
            sx: "block",
            md: "flex"
          },
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems="start" gap={1}>
          <MuiButton 
            fullWidth
            startIcon={isLiked
              ? <ThumbUpTwoToneIcon />
              : <ThumbUpAltTwoToneIcon />} 
            variant="contained"
            onClick={isLiked
              ? handleOnUnLikeProduct
              : handleOnLikeProduct}
            loading={isPending}
          >
            {isLiked
            ? "Unlike"
            : "Like"}
          </MuiButton>
          {/* TODO: review product */}
          <MuiButton
            fullWidth
            startIcon={<CommentTwoToneIcon />}
            variant="outlined"
          >
            Review
          </MuiButton>
          <MuiButton
            fullWidth
            startIcon={<ShoppingCartIcon />}
            variant="outlined"
            onClick={handleAddToCart}
          >
            Add 
          </MuiButton>
        </Box>

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems="start" justifyContent="start" gap={1}>
          <Typography variant="subtitle2" component="span">
            <Text color="black"><b>{likedTotal}</b></Text> reactions •{' '}
          </Typography>
          <Typography variant="subtitle2" component="span">
            <Text color="black"><b>{reviewsTotal}</b></Text> reviews •{' '}
          </Typography>
        </Box>
      </CardActionsWrapper>
    </Card>
  )
}
