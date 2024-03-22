import {
  CreateOrderInput,
  OrderAddressType,
} from "@/components/content/orders/forms";
import {
  AddressInputField,
  PickupAddressInputField,
} from "@/components/input-fields";
import {
  Box,
  Card,
  CardContent,
  Container,
  Radio,
  styled,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const SelectionCardWrapper = styled(Box)<{ active: "true" | "false"; }>((
  { theme, active },
) => ({
  cursor: "pointer",
  border: active === "true"
    ? `2px solid ${theme.colors.primary.dark}`
    : undefined,
  borderRadius: 10,
  height: 170,
  width: "100%",
  backgroundColor: theme.colors.alpha.white[70],
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
}));

export default function AddressInformationStep() {
  const { getValues, setValue } = useFormContext<CreateOrderInput>();

  const addressType: CreateOrderInput["addressType"] =
    getValues("addressType")
    || OrderAddressType.Delivery;

  useEffect(() => {
    setValue("addressType", addressType);
  }, [addressType]);

  const handleChangeAddressType =
    (addressType: OrderAddressType) =>
    (_: React.MouseEvent<HTMLDivElement>) => {
      if (addressType === OrderAddressType.Delivery) {
        setValue("pickupAddressId", undefined);
      }
      if (addressType === OrderAddressType.Pickup) {
        setValue("deliveryAddressId", undefined);
      }
      setValue("addressType", addressType);
    };

  return (
    <Container maxWidth="lg">
      <Box display="flex" flexDirection="column" gap={3}>
        <Typography variant="h3">Address Information</Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <Typography>Choose the option</Typography>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={1}
          >
            <SelectionCardWrapper
              active={addressType === "Delivery" ? "true" : "false"}
              onClick={handleChangeAddressType(OrderAddressType.Delivery)}
            >
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

            <SelectionCardWrapper
              active={addressType === "Pickup" ? "true" : "false"}
              onClick={handleChangeAddressType(OrderAddressType.Pickup)}
            >
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
            {addressType === "Delivery"
              ? (
                <AddressInputField
                  updateField
                  fieldName="deliveryAddressId"
                />
              )
              : null}
            {addressType === "Pickup" ? <PickupAddressInputField /> : null}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
