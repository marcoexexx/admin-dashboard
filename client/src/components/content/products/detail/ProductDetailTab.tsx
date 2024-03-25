import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { CreateCartOrderItemInput } from "@/components/cart/CartsTable";
import { MuiButton, Text } from "@/components/ui";
import { useStore } from "@/hooks";
import { useAddToCart, useGetCart } from "@/hooks/cart";
import { useLikeProduct, useUnLikeProduct } from "@/hooks/product";
import { Product } from "@/services/types";
import { Box, Divider, styled, Typography } from "@mui/material";
import { memoize } from "lodash";
import { ProductImages } from "./ProductImages";

import CommentTwoToneIcon from "@mui/icons-material/CommentTwoTone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ThumbUpTwoToneIcon from "@mui/icons-material/ThumbUp";
import ThumbUpAltTwoToneIcon from "@mui/icons-material/ThumbUpOffAlt";
import ProductRelationshipTable from "./ProductRelationshipTable";
import ProductSpecificationTable from "./ProductSpecificationTable";

dayjs.extend(isBetween);

export const calculateProductDiscount = memoize(
  (product: Product | undefined) => {
    if (!product) return { saving: 0, productDiscountAmount: 0 };

    const originalProductDiscount = product.discount;
    const activeSaleDiscount = product.salesCategory?.find(sale =>
      sale.salesCategory.isActive
      && dayjs().isBetween(
        sale.salesCategory.startDate,
        sale.salesCategory.endDate,
      )
      && sale.salesCategory.isActive
    )?.discount;

    const productDiscountPercent = activeSaleDiscount
      ?? originalProductDiscount; // saleDiscount may be 0 due to the active sale discount
    const productDiscountAmount = product.price
      - (product.price * productDiscountPercent) / 100;

    return { productDiscountAmount, productDiscountPercent };
  },
);

const ActionsWrapper = styled(Box)(({ theme }) => ({
  background: theme.colors.alpha.black[5],
  padding: theme.spacing(3),
}));

interface ProductDetailTabProps {
  product: Product;
}

export default function ProductDetailTab(props: ProductDetailTabProps) {
  const { product } = props;

  const { state, dispatch } = useStore();

  const { try_data } = useGetCart();

  const { mutate: addToCart, isPending: cartIsPending } = useAddToCart();
  const { mutate: likeProduct, isPending: likeIsPending } =
    useLikeProduct();
  const { mutate: unLikeProduct, isPending: unLikeIsPending } =
    useUnLikeProduct();

  const itemsInCart = try_data.ok_or_throw()?.orderItems || [];

  const handleAddToCart = () => {
    const { productDiscountAmount } = calculateProductDiscount(product);
    const initialQuality = 1;
    const totalPrice = initialQuality * productDiscountAmount;

    const item: CreateCartOrderItemInput = {
      productId: product.id,
      quantity: initialQuality,
      price: product.price,
      totalPrice,
    };

    // INFO: check quantity if beyound the limit, just open modal
    const itemInCartIdx = itemsInCart.findIndex(item =>
      item.productId === product.id && product.quantity <= item.quantity
    );
    if (itemInCartIdx !== -1) {
      return dispatch({ type: "OPEN_MODAL_FORM", payload: "cart" });
    }

    // TODO: add useLocalStorage for guest user
    addToCart(item);
    return;
  };

  const likedTotal = product._count.likedUsers;
  const reviewsTotal = product._count.reviews;

  const isPending = likeIsPending || unLikeIsPending;

  const handleOnLikeProduct = () => {
    if (state.user) {
      likeProduct({ productId: product.id, userId: state.user.id });
    }
  };

  const handleOnUnLikeProduct = () => {
    if (state.user) {
      unLikeProduct({ productId: product.id, userId: state.user.id });
    }
  };

  const isLiked = (product as Product & {
      likedUsers: { productId: string; userId: string; }[];
    }).likedUsers
      .find(fav => fav.userId === state.user?.id)
    ? true
    : false;

  return (
    <>
      <Box
        p={3}
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="start"
        justifyContent="space-between"
        gap={10}
      >
        <ProductImages images={product.images} />

        <Box
          display="flex"
          flexDirection="column"
          alignItems="start"
          justifyContent="start"
          width="70%"
          gap={2}
        >
          <Typography variant="h3" sx={{ py: 3 }}>
            {product.title}
          </Typography>

          <Box>
            <Typography variant="h4" sx={{ py: 1 }}>
              Description
            </Typography>
            <div
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </Box>

          <Box>
            <Typography variant="h4" sx={{ py: 1 }}>Overview</Typography>
            <div dangerouslySetInnerHTML={{ __html: product.overview }} />
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box p={3}>
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
        <Typography variant="h3">Discount and Sales</Typography>
        <Typography>Original discount: {product.discount}%</Typography>

        <Typography>Sales discounts</Typography>
        {product.salesCategory?.map(sale => (
          <Typography key={sale.id}>
            {sale.salesCategory.name} {"->"} {sale.discount}% ::{" "}
            {sale.salesCategory.isActive ? "Active" : "Unactive"}
          </Typography>
        ))}
      </Box>

      <Divider />

      <ActionsWrapper
        sx={{
          display: {
            sx: "block",
            md: "flex",
          },
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="start"
          gap={1}
        >
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
            loading={cartIsPending}
          >
            Add
          </MuiButton>
        </Box>

        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="start"
          justifyContent="start"
          gap={1}
        >
          <Typography variant="subtitle2" component="span">
            <Text color="black">
              <b>{likedTotal}</b>
            </Text>{" "}
            reactions •{" "}
          </Typography>
          <Typography variant="subtitle2" component="span">
            <Text color="black">
              <b>{reviewsTotal}</b>
            </Text>{" "}
            reviews •{" "}
          </Typography>
        </Box>
      </ActionsWrapper>
    </>
  );
}
