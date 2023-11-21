import { Button, ButtonProps, styled } from "@mui/material"
import { forwardRef } from "react"

const MuiButtonWrapper = styled(Button)(() => ({
}))


interface MuiButtonProps extends ButtonProps {}

export const MuiButton = forwardRef<HTMLButtonElement, MuiButtonProps>((props, ref) => {
  const { children, ...reset } = props

  return <MuiButtonWrapper {...reset} ref={ref}>
    {children}
  </MuiButtonWrapper>
})
