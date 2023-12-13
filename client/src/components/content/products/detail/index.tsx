import { SuspenseLoader } from "@/components";
import { getProductFn } from "@/services/productsApi";
import { Grid, Tab, Tabs, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ProductDetailTab from "./ProductDetailTab";
import ProductSalesTab from "./ProductSalesTab";


const TabWrapper = styled(Tabs)(() => ({
  ".MuiTabs-scrollableX": {
    overflowX: "auto !important"
  }
}))


type ProductTabs = 
  | "detail"
  | "sales"

const tabs: { 
  value: ProductTabs, 
  label: string 
}[] = [
  { value: "detail", label: "Detail" },
  { value: "sales", label: "Sales" },
]


interface ViewProductProps {
  productId: string | undefined
}

export function ProductDetail(props: ViewProductProps) {
  const { productId } = props

  const [currentTab, setCurrentTab] = useState<ProductTabs>("detail")

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

  const hgandleTabChange = (_: React.ChangeEvent<{}>, value: ProductTabs) => {
    setCurrentTab(value as ProductTabs)
  }


  if (isProductError && productError) return <h1>ERROR: {productError.message}</h1>
  if (!product || isProductLoading) return <SuspenseLoader />

  return (
    <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
      <Grid item xs={12}>
        <TabWrapper
          onChange={hgandleTabChange}
          value={currentTab}
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
        >
          {tabs.map(tab => {
            return <Tab key={tab.value} label={tab.label} value={tab.value} />
          })}
        </TabWrapper>
      </Grid>

      <Grid item xs={12}>
        {currentTab === "detail" && <ProductDetailTab product={product} />}
        {currentTab === "sales" && <ProductSalesTab />}
      </Grid>
    </Grid>
  )
}

