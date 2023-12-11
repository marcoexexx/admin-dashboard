import { I18nOptions, TxPath, i18n } from "@/i18n";
import { Typography, TypographyProps } from "@mui/material";
import { forwardRef } from "react";

interface TextProps extends TypographyProps {
  tx?: TxPath
  txOption?: I18nOptions
  text?: string
  children?: React.ReactNode
}

export const Text = forwardRef<HTMLButtonElement, TextProps>((props, ref) => {
  const { tx, txOption, text, children, ...reset } = props

  const content = tx ? i18n.t(tx, txOption) : text

  return <Typography {...reset} ref={ref}>
    {children || content}
  </Typography>
})
