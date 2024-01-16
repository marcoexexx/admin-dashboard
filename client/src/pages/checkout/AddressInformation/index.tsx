import { Box, Container, Radio, Typography, styled } from "@mui/material";
import { AddressInputField } from "@/components/input-fields";
import { CreateOrderInput, OrderAddressType } from "@/components/content/orders/forms";
import { PickupAddressForm } from "./PickupAddressForm";
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

  const addressType = getValues("addressType") || "delivery"


  useEffect(() => {
    setValue("addressType", addressType)
  }, [addressType])


  const handleChangeAddressType = (addressType: OrderAddressType) => (_: React.MouseEvent<HTMLDivElement>) => {
    setValue("addressType", addressType)
  }


  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography variant="h3">Address Information</Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography>Choose the option</Typography>
          <Box display="flex" flexDirection="row" gap={1}>
            <SelectionCardWrapper active={addressType === "delivery" ? "true" : "false"} onClick={handleChangeAddressType("delivery")}>
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
                checked={addressType === "delivery"}
                value="delivery"
                name="delivery"
                inputProps={{ "aria-label": "Delivery" }}
              />
            </SelectionCardWrapper>

            <SelectionCardWrapper active={addressType === "pickup" ? "true" : "false"} onClick={handleChangeAddressType("pickup")}>
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
                checked={addressType === "pickup"}
                value="pickup"
                name="pickup"
                inputProps={{ "aria-label": "Pickup" }}
              />
            </SelectionCardWrapper>
          </Box>
        </Box>

        {addressType === "delivery" ? <AddressInputField updateField fieldName="deliveryAddressId" /> : null}
        {addressType === "pickup" ? <PickupAddressForm /> : null}
      </Box>
    </Container>
  )
}
