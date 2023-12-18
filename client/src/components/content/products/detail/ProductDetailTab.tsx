import { Box, Card, CardActions, CardMedia, Divider, Typography, styled } from "@mui/material"
import { MuiButton, Text } from '@/components/ui'

import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUp';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';
import ProductRelationshipTable from "./ProductRelationshipTable";

import ProductSpecificationTable from "./ProductSpecificationTable"
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { queryClient } from "@/components";
import { likeProductByUserFn, unLikeProductByUserFn } from "@/services/productsApi";


const CardActionsWrapper = styled(CardActions)(({theme}) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(3)
}))


interface ProductDetailTabProps {
  product: IProduct
}

export default function ProductDetailTab(props: ProductDetailTabProps) {
  const { product } = props

  const { state, dispatch } = useStore()

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
        queryKey: ["products"]
      })
    },
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Failed like product ${product.title}: ${err.data.response.message}`,
          severity: "success"
        }
      })
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
        queryKey: ["products"]
      })
    },
    onError(err: any) {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Failed unlike product ${product.title}: ${err.data.response.message}`,
          severity: "success"
        }
      })
    }
  })

  const likedTotal = product._count.likedUsers
  const reviewsTotal = product._count.reviews

  const isPending = likeIsPending || unLikeIsPending

  const handleOnLikeProduct = () => {
    if (state.user) likeProduct({ productId: product.id, userId: state.user.id })
  }

  const handleOnUnLikeProduct = () => {
    if (state.user) unLikeProduct({ productId: product.id, userId: state.user.id })
  }

  const isLiked = (product as IProduct & {likedUsers: { productId: string, userId: string }[]} ).likedUsers.find(fav => fav.userId === state.user?.id) 
    ? true 
    : false


  return (
    <Card>
      <CardMedia 
        sx={{ minHeight: 800 }}
        image={product.images[0] || "/pubic/default.jpg"}
        title={product.title}
      />

      <Typography variant="h2" sx={{ p: 3 }}>{product.title}</Typography>

      <Divider />

      <Box p={3}>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
        <div dangerouslySetInnerHTML={{ __html: product.features }} />
        <ProductSpecificationTable specs={product.specification} />
        <ProductRelationshipTable
          brand={product.brand}
          categories={product.categories}
          salesCategories={product.salesCategory}
        />
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
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} alignItems="start" justifyContent="start" gap={1}>
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
