import { i18n, I18nOptions, TxPath } from "@/i18n";
import { styled } from "@mui/material";
import clsx from "clsx";
import { forwardRef } from "react";

const TextWrapper = styled("span")(({ theme }) => ({
  display: "inline-block",
  alignItems: "center",

  "&.flexItem": {
    display: "inline-flex",
  },

  "&.MuiText": {
    "&-black": {
      color: theme.palette.common.black,
    },

    "&-primary": {
      color: theme.palette.primary.main,
    },

    "&-secondary": {
      color: theme.palette.secondary.main,
    },

    "&-success": {
      color: theme.palette.success.main,
    },

    "&-warning": {
      color: theme.palette.warning.main,
    },

    "&-error": {
      color: theme.palette.error.main,
    },

    "&-info": {
      color: theme.palette.info.main,
    },
  },
}));

interface TextProps {
  className?: string;
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "info"
    | "black";
  flex?: boolean;
  tx?: TxPath;
  txOption?: I18nOptions;
  text?: string;
  children?: React.ReactNode;
}

export const Text = forwardRef<HTMLButtonElement, TextProps>((props, ref) => {
  const { className, color = "secondary", flex, tx, txOption, text, children, ...reset } = props;

  const content = tx ? i18n.t(tx, txOption) : text;

  return (
    <TextWrapper className={clsx("MuiText-" + color, { flexItem: flex })} {...reset} ref={ref}>
      {children || content}
    </TextWrapper>
  );
});
