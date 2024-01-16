import dayjs from "dayjs";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/components";
import { useLocalStorage, useStore } from "@/hooks";
import { playSoundEffect } from "@/libs/playSound";
import { Box, Checkbox, Link, Grid, Step, StepConnector, StepIconProps, StepLabel, Stepper, Typography, stepConnectorClasses, styled, FormGroup, FormControlLabel, Alert } from "@mui/material"
import { MuiButton } from "@/components/ui";
import { Link as LinkRouter } from "react-router-dom";
import { OrderSummary } from "./OrderSummary";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { CreateOrderInput, createOrderSchema } from "@/components/content/orders/forms";
import { FormModal } from "@/components/forms";
import { CreateUserAddressForm } from "@/components/content/user-addresses/forms";
import { OrderItem } from "@/services/types";
import { PaymentMethodStep } from "./PaymentMethod";
import { CreatePotentialOrderInput } from "@/components/content/potential-orders/forms";
import { CheckoutOrderConfirmation } from "./CheckoutOrderConfirmation";

import AddressInformationStep from "./AddressInformation";
import Check from '@mui/icons-material/Check'
import { createPotentialOrderFn } from "@/services/potentialOrdersApi";


const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: theme.colors.primary.light,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: { borderColor: theme.colors.primary.light,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.colors.primary.lighter,
    display: 'flex',
    height: 22,
    alignItems: 'center',
    ...(ownerState.active && {
      color: theme.colors.primary.light,
    }),
    '& .QontoStepIcon-completedIcon': {
      color: theme.colors.primary.light,
      zIndex: 1,
      fontSize: 18,
    },
    '& .QontoStepIcon-circle': {
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: 'currentColor',
    },
  }),
)

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;


  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  )
}

const steps = [
  "Address information",
  "Payment method",
  "Order Confirmation"
]

function RenderStepper({activeStepIdx}: {activeStepIdx: number}) {
  if (activeStepIdx === 0) return <AddressInformationStep />
  if (activeStepIdx === 1) return <PaymentMethodStep />
  if (activeStepIdx === 2) return <CheckoutOrderConfirmation />
  return <h1>Invalid step</h1>
}


export function CheckoutForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const [activeStepIdx, setActiveStepIdx] = useState(0)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const { set, get } = useLocalStorage()

  const {
    mutate: createOrder,
    isPending: isPendingMutationOrder,
    isSuccess: isSuccessMutationOrder
  } = useMutation({
    mutationFn: async (value: CreateOrderInput) => new Promise(resolve => setTimeout(() => resolve(console.log({ saved: {value}})), 3000)),
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new Order.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["orders"]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
  })

  const {
    mutate: createPotentialOrder,
    isPending: isPendingMutationPotentialOrder,
  } = useMutation({
    mutationFn: createPotentialOrderFn,
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new Potential order.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["potential-orders"]
      })
      playSoundEffect("success")
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
      playSoundEffect("error")
    },
  })


  const methods = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    reValidateMode: "onChange",
  })

  const { getValues, handleSubmit, setValue, watch, formState: {errors} } = methods

  const errorMessage = `Invalid input: ${Object.keys(errors)} errors found!`


  // Initialize values from localStorage
  useEffect(() => {
    const cartItems = get<OrderItem[]>("CARTS")
    const values = get<CreateOrderInput>("PICKUP_FORM")

    if (Array.isArray(cartItems) && cartItems.length) setValue("orderItems", cartItems.filter((cart) => !!cart.productId))
    if (values) {
      if (values.pickupAddress) setValue("pickupAddress", { ...values.pickupAddress, date: dayjs(values.pickupAddress.date) })
      if (values.deliveryAddressId) setValue("deliveryAddressId", values.deliveryAddressId)
      if (values.billingAddressId) setValue("billingAddressId", values.billingAddressId)
      if (values.paymentMethodProvider) setValue("paymentMethodProvider", values.paymentMethodProvider)
    }

    setValue("addressType", values?.addressType || "delivery")
  }, [])


  // Save value to localStorage on form value change
  useEffect(() => {
    const values = watch()
    let valuesUpdate = values
    const prevsValues = get<CreateOrderInput>("PICKUP_FORM")

    set("PICKUP_FORM", { ...prevsValues, ...valuesUpdate });
  }, [watch()])


  useEffect(() => {
    if (isConfirmed && isSuccessMutationOrder) setActiveStepIdx(prev => prev += 1)
  }, [isConfirmed, isSuccessMutationOrder])


  const onSubmit: SubmitHandler<CreateOrderInput> = (value) => {
    createOrder(value)
  }

  const checkValidCurrentStepForm = (idx: number) => {
    const { addressType, deliveryAddressId, pickupAddress, billingAddressId, paymentMethodProvider } = getValues()

    if (idx === 0) {
      if (addressType === "delivery" && !errors.deliveryAddressId && deliveryAddressId) return true
      if (addressType === "pickup" && pickupAddress && !errors.pickupAddress && pickupAddress.username && pickupAddress.phone && pickupAddress.date) return true
    }

    if (idx === 1) {
      if (!errors.paymentMethodProvider
        && billingAddressId
        && paymentMethodProvider) return true
    }

    if (idx == 2) return false

    return false
  }

  const handleNextStep = (_: React.MouseEvent<HTMLButtonElement>) => {
    // Create potential order
    if (activeStepIdx === 1) {
      const value = getValues()

      let payload: CreatePotentialOrderInput = {
        orderItems: value.orderItems,
        billingAddressId: value.billingAddressId,
        paymentMethodProvider: value.paymentMethodProvider,
        status: "Processing"
      }

      createPotentialOrder(payload)
    }

    if (checkValidCurrentStepForm(activeStepIdx)) setActiveStepIdx(prev => prev + 1)
  }

  const handleConfirmOrder = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = evt

    setIsConfirmed(target.checked)
  }

  const handleBackStep = (_: React.MouseEvent<HTMLButtonElement>) => setActiveStepIdx(prev => prev - 1)

  const isLastStep = activeStepIdx == steps.length - 1

  const handleOnCloseModalForm = () => dispatch({ type: "CLOSE_ALL_MODAL_FORM" })


  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <Stepper alternativeLabel activeStep={activeStepIdx} connector={<QontoConnector />}>
          {steps.map(label => {
            return <Step key={label}>
              <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
            </Step>
          })}
        </Stepper>
      </Grid>

      <Grid item md={7} xs={12}>
        {activeStepIdx === steps.length
        ? <h1>Success</h1>
        : <FormProvider  {...methods}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <RenderStepper activeStepIdx={activeStepIdx} />

              {isLastStep 
                ? <FormGroup sx={{ p: 1 }}>
                  <FormControlLabel 
                    control={<Checkbox value={isConfirmed} onChange={handleConfirmOrder} />}
                    label={<Typography>I have read and agreed to the website <Link component={LinkRouter} to="#temas">teams and conditions</Link>.</Typography>} />
                </FormGroup>
                : null}

              {Object.keys(errors).length
              ? <Alert severity="error">{errorMessage}</Alert>
              : null}

              <Box mt={2} display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={1}>
                <MuiButton disabled={activeStepIdx === 0} onClick={handleBackStep} variant="text">
                  Back
                </MuiButton>
                {isLastStep 
                  ? <MuiButton onClick={handleNextStep} loading={isPendingMutationOrder} disabled={!isConfirmed} type="submit" variant="contained">Submit</MuiButton> 
                  : <MuiButton onClick={handleNextStep} type={"button"} loading={isPendingMutationPotentialOrder} variant="outlined">Continue</MuiButton>}
              </Box>
            </Box>
          </FormProvider>}
      </Grid>

      <Grid item md={4.8} xs={12}>
        <OrderSummary />
      </Grid>


      {modalForm.field === "addresses"
      ? <FormModal field='addresses' title='Create new address' onClose={handleOnCloseModalForm}>
        <CreateUserAddressForm />
      </FormModal>
      : null}
    </Grid>
  )
}
