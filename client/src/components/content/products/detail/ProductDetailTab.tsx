import { Box, Card, CardActions, CardMedia, Divider, Typography, styled } from "@mui/material"
import { MuiButton, Text } from '@/components/ui'

import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
// import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import CommentTwoToneIcon from '@mui/icons-material/CommentTwoTone';

import ProductSpecificationTable from "./ProductSpecificationTable"
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@/hooks";
import { queryClient } from "@/components";


const CardActionsWrapper = styled(CardActions)(({theme}) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(3)
}))


interface ProductDetailTabProps {
  product: IProduct
}

export default function ProductDetailTab(props: ProductDetailTabProps) {
  const { product } = props

  const { dispatch } = useStore()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => new Promise(resolve => setTimeout(resolve, 2000)),
    onSuccess() {
      dispatch({
        type: "OPEN_TOAST",
        payload: {
          message: `Like product ${product.title}`,
          severity: "success"
        }
      })
      queryClient.invalidateQueries({
        queryKey: ["products"]
      })
    },
    onError() {}
  })

  const likedTotal = product._count.likedUsers
  const reviewsTotal = product._count.reviews

  const handleOnLikeProduct = () => {
    mutate()
  }


  return (
    <Card>
      <CardMedia 
        sx={{ minHeight: 400 }}
        // image={product.images[0] || "/pubic/default.jpg"}
        image="https://martking.ng/wp-content/uploads/2022/07/whole-sliced-green-apples-martking.ng-lagos-online-grocery-store-e1658945818417.jpeg"
        title={product.title}
      />

      <Typography variant="h2" sx={{ p: 3 }}>{product.title}</Typography>

      <Divider />

      <Box p={3}>
        <div dangerouslySetInnerHTML={{ __html: product.description }} />
        <div dangerouslySetInnerHTML={{ __html: product.features }} />
        <ProductSpecificationTable specs={product.specification} />
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
          {/* TODO: liked product */}
          <MuiButton 
            fullWidth
            startIcon={<ThumbUpAltTwoToneIcon />} 
            variant="contained"
            onClick={handleOnLikeProduct}
            loading={isPending}
          >
            Like
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
