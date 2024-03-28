import { i18n, I18nOptions, TxPath } from "@/i18n";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { styled } from "@mui/material";
import { forwardRef } from "react";

const MuiButtonWrapper = styled(LoadingButton)(() => ({}));

interface MuiButtonProps extends LoadingButtonProps {
  tx?: TxPath;
  txOption?: I18nOptions;
  text?: string;
}

export const MuiButton = forwardRef<HTMLButtonElement, MuiButtonProps>(
  (props, ref) => {
    const { children, tx, txOption, text, ...reset } = props;
    const content = tx ? i18n.t(tx, txOption) : text;

    return (
      <MuiButtonWrapper {...reset} ref={ref}>
        {children || content}
      </MuiButtonWrapper>
    );
  },
);
