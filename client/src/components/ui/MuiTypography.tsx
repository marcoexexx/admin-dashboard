import { i18n, I18nOptions, TxPath } from "@/i18n";
import { styled, Typography, TypographyProps } from "@mui/material";
import { forwardRef } from "react";

const TypographyWrapper = styled(Typography)(({}) => ({}));

interface MuiTypographyProps extends TypographyProps {
  tx?: TxPath;
  txOption?: I18nOptions;
  text?: string;
}

export const MuiTypography = forwardRef<
  HTMLDivElement,
  MuiTypographyProps
>(
  (props, ref) => {
    const { children, tx, txOption, text, ...reset } = props;
    const content = tx ? i18n.t(tx, txOption) : text;

    return (
      <TypographyWrapper {...reset} ref={ref}>
        {children || content}
      </TypographyWrapper>
    );
  },
);
