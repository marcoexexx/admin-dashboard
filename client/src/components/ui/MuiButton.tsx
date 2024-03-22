import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { styled } from "@mui/material";
import { forwardRef } from "react";

const MuiButtonWrapper = styled(LoadingButton)(() => ({}));

interface MuiButtonProps extends LoadingButtonProps {}

export const MuiButton = forwardRef<HTMLButtonElement, MuiButtonProps>(
  (props, ref) => {
    const { children, ...reset } = props;

    return (
      <MuiButtonWrapper {...reset} ref={ref}>
        {children}
      </MuiButtonWrapper>
    );
  },
);
