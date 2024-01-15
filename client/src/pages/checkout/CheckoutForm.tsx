import { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Step, StepConnector, StepIconProps, StepLabel, Stepper, stepConnectorClasses, styled } from "@mui/material"
import { MuiButton } from "@/components/ui";
import { OrderSummary } from "./OrderSummary";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { CreateOrderInput, createOrderSchema } from "@/components/content/orders/forms";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/components";
import { useLocalStorage, useStore } from "@/hooks";
import AddressInformationStep from "./AddressInformation";
import Check from '@mui/icons-material/Check'
import { FormModal } from "@/components/forms";
import { CreateUserAddressForm } from "@/components/content/user-addresses/forms";
import { OrderItem } from "@/services/types";
import dayjs from "dayjs";


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
  if (activeStepIdx === 1) return <h1>2</h1>
  if (activeStepIdx === 2) return <h1>3</h1>
  return <h1>Invalid step</h1>
}


export function CheckoutForm() {
  const { state: {modalForm}, dispatch } = useStore()

  const [activeStepIdx, setActiveStepIdx] = useState(0)

  const { set, get } = useLocalStorage()

  const {
    mutate: createOrder,
    isPending
  } = useMutation({
    mutationFn: async (value: CreateOrderInput) => new Promise(resolve => setTimeout(() => resolve(console.log({ saved: {value}})), 3000)),
    onSuccess: () => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: "Success created a new brand.",
        severity: "success"
      } })
      dispatch({ type: "CLOSE_ALL_MODAL_FORM" })
      queryClient.invalidateQueries({
        queryKey: ["orders"]
      })
    },
    onError: (err: any) => {
      dispatch({ type: "OPEN_TOAST", payload: {
        message: `failed: ${err.response.data.message}`,
        severity: "error"
      } })
    },
  })

  const methods = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema)
  })


  // Initialize values from localStorage
  useEffect(() => {
    const cartItems = get<OrderItem[]>("CARTS")
    const values = get<CreateOrderInput>("PICKUP_FORM")

    if (Array.isArray(cartItems) && cartItems.length) methods.setValue("orderItems", cartItems.filter((cart) => !!cart.productId))
    if (values) {
      methods.setValue("pickupAddress", { ...values.pickupAddress, date: dayjs(values.pickupAddress.date) })
      methods.setValue("deliveryAddressId", values.deliveryAddressId)
    }

    methods.setValue("addressType", values?.addressType || "delivery")
  }, [])


  // Save value to localStorage on form value change
  useEffect(() => {
    const values = methods.watch()
    let valuesUpdate = values
    const prevsValues = get<CreateOrderInput>("PICKUP_FORM")

    set("PICKUP_FORM", { ...prevsValues, ...valuesUpdate });
  }, [methods.watch()])


  const onSubmit: SubmitHandler<CreateOrderInput> = (value) => {
    createOrder(value)
  }

  const checkValidCurrentStepForm = (idx: number) => {
    const errors = methods.formState.errors
    const value = methods.watch()

    if (idx === 0) {
      if (methods.getValues("addressType") === "delivery" && !errors.deliveryAddressId && value.deliveryAddressId) return true
      if (methods.getValues("addressType") === "pickup" && !errors.pickupAddress && value.pickupAddress.username && value.pickupAddress.phone && value.pickupAddress.date) return true
    }

    if (idx === 1) {
      console.log(value)
    }

    return false
  }

  const handleNextStep = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (checkValidCurrentStepForm(activeStepIdx)) setActiveStepIdx(prev => prev + 1)
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
        ? isPending 
          ? <Box display="flex" alignItems="center" justifyContent="center" mt={10}>
              <CircularProgress />
            </Box>
          : <h1>Success</h1>
        : <FormProvider  {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
              <RenderStepper activeStepIdx={activeStepIdx} />

              <Box mt={2} display="flex" flexDirection="row" alignItems="center" justifyContent="flex-start" gap={1}>
                <MuiButton disabled={activeStepIdx === 0} onClick={handleBackStep} variant="outlined">
                  Back
                </MuiButton>
                {isLastStep 
                  ? <MuiButton onClick={handleNextStep} type="button">Submit</MuiButton> 
                  : <MuiButton onClick={handleNextStep} type="submit">Continue</MuiButton>}
              </Box>
            </Box>
          </FormProvider>}
      </Grid>

      <Grid item md={3} xs={12}>
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
