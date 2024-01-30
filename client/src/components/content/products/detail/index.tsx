import { SuspenseLoader } from "@/components";
import { Grid, Tab, Tabs, styled } from "@mui/material";
import { useState } from "react";
import ProductDetailTab from "./ProductDetailTab";
import ProductSalesTab from "./ProductSalesTab";
import { useGetProduct } from "@/hooks/product";


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

  // Quries
  const productQuery = useGetProduct({ id: productId, include: {
    specification: true,
    likedUsers: true,
    brand: true,
    categories: {
      include: {
        category: true
      }
    },
    salesCategory: {
      include: {
        salesCategory: true
      }
    },

    _count: true
  }})

  // Extraction
  const product = productQuery.try_data.ok_or_throw()


  const hgandleTabChange = (_: React.ChangeEvent<{}>, value: ProductTabs) => {
    setCurrentTab(value as ProductTabs)
  }


  if (!product || productQuery.isLoading) return <SuspenseLoader />


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
        {currentTab === "sales" && productId && <ProductSalesTab productId={productId} />}
      </Grid>
    </Grid>
  )
}

