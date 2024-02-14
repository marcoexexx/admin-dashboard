import { Box, Card, CardContent, Container, Radio, Typography, styled } from "@mui/material";
import { AddressInputField, PickupAddressInputField } from "@/components/input-fields";
import { CreateOrderInput, OrderAddressType } from "@/components/content/orders/forms";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";


const SelectionCardWrapper = styled(Box)<{ active: "true" | "false" }>(({ theme, active }) => ({
  cursor: "pointer",
  border: active === "true" ? `2px solid ${theme.colors.primary.dark}` : undefined,
  borderRadius: 10,
  height: 170,
  width: "100%",
  backgroundColor: theme.colors.alpha.white[70],
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between"
}))


export default function AddressInformationStep() {
  const { getValues, setValue } = useFormContext<CreateOrderInput>()

  const addressType: CreateOrderInput["addressType"] = getValues("addressType") || "Delivery"


  useEffect(() => {
    setValue("addressType", addressType)
  }, [addressType])


  const handleChangeAddressType = (addressType: OrderAddressType) => (_: React.MouseEvent<HTMLDivElement>) => {
    if (addressType === "Delivery") setValue("pickupAddressId", undefined)
    if (addressType === "Pickup") setValue("deliveryAddressId", undefined)
    setValue("addressType", addressType)
  }


  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography variant="h3">Address Information</Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography>Choose the option</Typography>
          <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={1}>
            <SelectionCardWrapper active={addressType === "Delivery" ? "true" : "false"} onClick={handleChangeAddressType("Delivery")}>
              <Box 
                ml={2}
                component="img"
                sx={{
                  height: 133,
                }}
                alt="deliveryAddress image"
                src="/static/motorcycle-delivery.svg"
              >
              </Box>
              <Typography variant="h3">Delivery</Typography>
              <Radio 
                sx={{ alignSelf: "start" }}
                checked={addressType === "Delivery"}
                value="delivery"
                name="delivery"
                inputProps={{ "aria-label": "Delivery" }}
              />
            </SelectionCardWrapper>

            <SelectionCardWrapper active={addressType === "Pickup" ? "true" : "false"} onClick={handleChangeAddressType("Pickup")}>
              <Box 
                ml={2}
                component="img"
                sx={{
                  height: 133,
                }}
                alt="deliveryAddress image"
                src="/static/box.svg"
              >
              </Box>
              <Typography variant="h3">Pickup</Typography>
              <Radio 
                sx={{ alignSelf: "start" }}
                checked={addressType === "Pickup"}
                value="pickup"
                name="pickup"
                inputProps={{ "aria-label": "Pickup" }}
              />
            </SelectionCardWrapper>
          </Box>
        </Box>

        <Card>
          <CardContent>
            {addressType === "Delivery" ? <AddressInputField updateField fieldName="deliveryAddressId" /> : null}
            {addressType === "Pickup" ? <PickupAddressInputField /> : null}
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
