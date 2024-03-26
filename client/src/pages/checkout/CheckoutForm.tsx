import {
  CreateOrderInput,
  createOrderSchema,
} from "@/components/content/orders/forms";
import { CreatePickupAddressForm } from "@/components/content/pickupAddressHistory/forms";
import { CreatePotentialOrderInput } from "@/components/content/potential-orders/forms";
import { CreateRegionForm } from "@/components/content/regions/forms";
import { CreateTownshipForm } from "@/components/content/townships/forms";
import { CreateUserAddressForm } from "@/components/content/user-addresses/forms";
import { FormModal } from "@/components/forms";
import { MuiButton } from "@/components/ui";
import { useBeforeUnloadPage, useLocalStorage, useStore } from "@/hooks";
import { useDeleteCart, useGetCart } from "@/hooks/cart";
import { useCreateOrder } from "@/hooks/order";
import {
  useCreatePotentialOrder,
  useDeletePotentialOrder,
} from "@/hooks/potentialOrder";
import { useGetUserAddress } from "@/hooks/userAddress";
import { AddressType, PotentialOrderStatus } from "@/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Hidden,
  Link,
  Step,
  StepConnector,
  stepConnectorClasses,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import { CheckoutOrderConfirmation } from "./CheckoutOrderConfirmation";
import { OrderSummary } from "./OrderSummary";
import { PaymentMethodStep } from "./PaymentMethod";

import ErrorBoundary from "@/components/ErrorBoundary";
import Check from "@mui/icons-material/Check";
import AddressInformationStep from "./AddressInformation";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.colors.primary.light,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.colors.primary.light,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")<
  { ownerState: { active?: boolean; }; }
>(
  ({ theme, ownerState }) => ({
    color: theme.colors.primary.lighter,
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: theme.colors.primary.light,
    }),
    "& .QontoStepIcon-completedIcon": {
      color: theme.colors.primary.light,
      zIndex: 1,
      fontSize: 18,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  }),
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed
        ? <Check className="QontoStepIcon-completedIcon" />
        : <div className="QontoStepIcon-circle" />}
    </QontoStepIconRoot>
  );
}

const steps = [
  "Address information",
  "Payment method",
  "Order Confirmation",
];

function RenderStepper({ activeStepIdx }: { activeStepIdx: number; }) {
  if (activeStepIdx === 0) return <AddressInformationStep />;
  if (activeStepIdx === 1) return <PaymentMethodStep />;
  if (activeStepIdx === 2) return <CheckoutOrderConfirmation />;
  return <h1>Invalid step</h1>;
}

/**
 * totalAmount is total price of in all order items     := orderItems.reduce((total, item) => total + item.totalPrice, 0)
 * totalPrice is total price of order                   := totalAmount + deliveryFee
 */
export function CheckoutForm() {
  const { state: { modalForm, user: me } } = useStore();

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { set, get, remove } = useLocalStorage();

  const navigate = useNavigate();

  const { try_data } = useGetCart();

  const cartItems = try_data.ok_or_throw()?.orderItems || [];
  const values = get<CreateOrderInput>("PICKUP_FORM");

  const methods = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    reValidateMode: "onChange",
  });

  useBeforeUnloadPage();

  const {
    getValues,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  // Queries
  const deliveryFeeQuery = useGetUserAddress({
    id: getValues("deliveryAddressId"),
    include: {
      township: true,
    },
  });

  // Mutations
  const deletePotentialOrderMutation = useDeletePotentialOrder();
  const deleteCartMutation = useDeleteCart();
  const createOrderMutation = useCreateOrder();
  const createPotentialOrderMutation = useCreatePotentialOrder();

  // Extraction
  const errorMessage = `Invalid input: ${
    Object.keys(errors)
  } errors found!`;
  const deliveryFee = deliveryFeeQuery.try_data.ok_or_throw()?.userAddress;

  // After creating the order
  useEffect(() => {
    if (createOrderMutation.isSuccess) {
      set("CHECKOUT_FORM_ACTIVE_STEP", activeStepIdx + 1);
      // Remove potential order
      const createdPotentialOrderId = getValues("createdPotentialOrderId");
      if (createdPotentialOrderId) {
        deletePotentialOrderMutation.mutate(createdPotentialOrderId);
      }
      // Remove cart
      if (me?.cart?.id) deleteCartMutation.mutate(me.cart.id);
    }
  }, [createOrderMutation.isSuccess]);

  // After creating the potential order
  useEffect(() => {
    const createdPotentialOrder = createPotentialOrderMutation.try_data
      .ok_or_throw();

    if (createPotentialOrderMutation.isSuccess && createdPotentialOrder) {
      setValue(
        "createdPotentialOrderId",
        createdPotentialOrder.potentialOrder.id,
      );
      setValue(
        "pickupAddressId",
        createdPotentialOrder.potentialOrder.pickupAddressId || undefined,
      );
      setActiveStepIdx(2);
      set("CHECKOUT_FORM_ACTIVE_STEP", 2);
    }
  }, [createPotentialOrderMutation.isSuccess]);

  const totalAmount = useMemo(() => {
    // // Checked re-calculate, fixed ✅
    // console.log("re-calculate")
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }, [JSON.stringify(cartItems), getValues("addressType")]);

  // Initialize values from localStorage
  useEffect(() => {
    // Set form step
    const activeStepIdxFromLocalStorage =
      get<number>("CHECKOUT_FORM_ACTIVE_STEP") || 0;
    setActiveStepIdx(activeStepIdxFromLocalStorage);

    if (Array.isArray(cartItems) && cartItems.length) {
      setValue(
        "orderItems",
        cartItems.filter(item => !!item.productId).map(item => item.id),
      );
    }
    if (values) {
      if (values.pickupAddressId) {
        setValue("pickupAddressId", values.pickupAddressId);
      }
      if (values.deliveryAddressId) {
        setValue("deliveryAddressId", values.deliveryAddressId);
      }
      if (values.billingAddressId) {
        setValue("billingAddressId", values.billingAddressId);
      }
      if (values.paymentMethodProvider) {
        setValue("paymentMethodProvider", values.paymentMethodProvider);
      }
      if (values.createdPotentialOrderId) {
        setValue(
          "createdPotentialOrderId",
          values.createdPotentialOrderId,
        );
      }
    }

    setValue("addressType", values?.addressType || "Delivery");
  }, []);

  // Save value to localStorage on form value change
  useEffect(() => {
    const values = watch();
    let valuesUpdate = values;
    const prevsValues = get<CreateOrderInput>("PICKUP_FORM") || {};

    set("PICKUP_FORM", { ...prevsValues, ...valuesUpdate });
  }, [watch()]);

  // Get totalPrice of order
  useEffect(() => {
    const fees = deliveryFee?.township?.fees || 0;
    const totalPrice = fees + totalAmount;

    setValue("totalPrice", totalPrice);
  }, [deliveryFeeQuery.isSuccess, deliveryFee, totalAmount]);

  // Go final step
  useEffect(() => {
    if (
      isConfirmed && createOrderMutation.isSuccess
      && deletePotentialOrderMutation.isSuccess
    ) {
      setActiveStepIdx(prev => prev += 1);
    }
  }, [
    isConfirmed,
    createOrderMutation.isSuccess,
    deletePotentialOrderMutation.isSuccess,
  ]);

  const onSubmit: SubmitHandler<CreateOrderInput> = (value) => {
    createOrderMutation.mutate(value);
  };

  const checkValidCurrentStepForm = (idx: number) => {
    const {
      addressType,
      deliveryAddressId,
      pickupAddressId,
      billingAddressId,
      paymentMethodProvider,
    } = getValues();

    if (idx === 0) {
      if (
        addressType === "Delivery" && !errors.deliveryAddressId
        && deliveryAddressId
      ) return true;
      if (
        addressType === "Pickup" && pickupAddressId
        && !errors.pickupAddressId
      ) return true;
    }

    if (idx === 1) {
      if (
        !errors.paymentMethodProvider
        && billingAddressId
        && paymentMethodProvider
      ) return true;
    }

    if (idx == 2) return false;

    return false;
  };

  const handleNextStep = (_: React.MouseEvent<HTMLButtonElement>) => {
    const value = getValues();

    // Create potential order if it's not created
    if (activeStepIdx === 1) {
      // Check deliveryFee and create
      let payload: CreatePotentialOrderInput = {
        id: value.createdPotentialOrderId
          || generateUuid(24),
        orderItems: value.orderItems,
        billingAddressId: value.billingAddressId,
        paymentMethodProvider: value.paymentMethodProvider,
        status: PotentialOrderStatus.Processing,
        totalPrice: totalAmount,
        addressType: value.addressType,
      };

      if (deliveryFee && deliveryFee.township) {
        payload.totalPrice = deliveryFee.township.fees + totalAmount;
      }

      // check address type and add their address data
      if (value.addressType === AddressType.Delivery) {
        payload.deliveryAddressId = value.deliveryAddressId;
      } else if (value.addressType === AddressType.Pickup) {
        payload.pickupAddressId = value.pickupAddressId;
      }

      createPotentialOrderMutation.mutate(payload);
    }

    if (checkValidCurrentStepForm(activeStepIdx) && activeStepIdx !== 1) {
      set("CHECKOUT_FORM_ACTIVE_STEP", activeStepIdx + 1);
      setActiveStepIdx(prev => prev + 1);
    }
  };

  const handleConfirmOrder = (
    evt: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { target } = evt;

    setIsConfirmed(target.checked);
  };

  const handleBackStep = (_: React.MouseEvent<HTMLButtonElement>) => {
    setActiveStepIdx(prev => prev - 1);
    set("CHECKOUT_FORM_ACTIVE_STEP", activeStepIdx - 1);
  };

  const isLastStep = activeStepIdx == steps.length - 1;

  const handleGoHome = () => {
    remove("PICKUP_FORM");
    remove("CHECKOUT_FORM_ACTIVE_STEP");

    navigate("/home");
  };

  return (
    <Grid container gap={2}>
      {/* DEBUG: print current form values */}
      {/* <button onClick={() => console.log(getValues())}>Print values</button> */}

      <Grid item xs={12}>
        <Stepper
          alternativeLabel
          activeStep={activeStepIdx}
          connector={<QontoConnector />}
        >
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>

      <Hidden lgUp>
        <Grid item xs={12}>
          <ErrorBoundary>
            <OrderSummary
              deliveryFee={deliveryFee?.township?.fees}
              orderItems={cartItems}
            />
          </ErrorBoundary>
        </Grid>

        <Grid item xs={12}>
          <Divider flexItem orientation="horizontal" sx={{ my: 1 }} />
        </Grid>
      </Hidden>

      <Grid item md={12} lg={7}>
        {activeStepIdx === steps.length
          ? <MuiButton onClick={handleGoHome}>Home</MuiButton>
          : (
            <ErrorBoundary>
              <FormProvider {...methods}>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <RenderStepper activeStepIdx={activeStepIdx} />

                  {isLastStep
                    ? (
                      <FormGroup sx={{ p: 1 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={isConfirmed}
                              onChange={handleConfirmOrder}
                            />
                          }
                          label={
                            <Typography>
                              I have read and agreed to the website{" "}
                              <Link component={LinkRouter} to="#temas">
                                teams and conditions
                              </Link>.
                            </Typography>
                          }
                        />
                      </FormGroup>
                    )
                    : null}

                  {Object.keys(errors).length
                    ? <Alert severity="error">{errorMessage}</Alert>
                    : null}

                  <Box
                    mt={2}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="flex-start"
                    gap={1}
                  >
                    <MuiButton
                      disabled={activeStepIdx === 0}
                      onClick={handleBackStep}
                      variant="text"
                    >
                      Back
                    </MuiButton>
                    {isLastStep
                      ? (
                        <MuiButton
                          onClick={handleNextStep}
                          loading={createOrderMutation.isPending
                            || deletePotentialOrderMutation.isPending}
                          disabled={!isConfirmed}
                          type="submit"
                          variant="contained"
                        >
                          Submit
                        </MuiButton>
                      )
                      : (
                        <MuiButton
                          onClick={handleNextStep}
                          type={"button"}
                          loading={createPotentialOrderMutation.isPending}
                          variant="outlined"
                        >
                          Continue
                        </MuiButton>
                      )}
                  </Box>
                </Box>
              </FormProvider>
            </ErrorBoundary>
          )}
      </Grid>

      <Hidden lgDown>
        <Grid item lg={4.7}>
          <ErrorBoundary>
            <OrderSummary
              deliveryFee={deliveryFee?.township?.fees}
              orderItems={cartItems}
            />
          </ErrorBoundary>
        </Grid>
      </Hidden>

      {modalForm.field === "create-addresse"
        ? (
          <FormModal field="create-addresse" title="Create new address">
            <CreateUserAddressForm />
          </FormModal>
        )
        : null}

      {modalForm.field === "create-pickup-addresse"
        ? (
          <FormModal
            field="create-pickup-addresse"
            title="Create new address"
          >
            <CreatePickupAddressForm />
          </FormModal>
        )
        : null}

      {modalForm.field === "create-region"
        ? (
          <FormModal field="create-region" title="Create new region">
            <CreateRegionForm />
          </FormModal>
        )
        : null}

      {modalForm.field === "create-township"
        ? (
          <FormModal field="create-township" title="Create new township">
            <CreateTownshipForm />
          </FormModal>
        )
        : null}
    </Grid>
  );
}
