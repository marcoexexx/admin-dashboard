import { styled } from "@mui/material";

const LabelWrapper = styled("span")(({ theme }) => ({
  backgroundColor: theme.colors.alpha.black[5],
  padding: theme.spacing(0.5, 1),
  fontSize: theme.typography.pxToRem(13),
  borderRadius: theme.colors.layout.general.borderRadius,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  maxHeight: theme.spacing(3),

  "&.MuiLabel": {
    "&-primary": {
      backgroundColor: theme.colors.primary.lighter,
      colors: theme.palette.primary.main,
    },

    "&-black": {
      backgroundColor: theme.colors.alpha.black[100],
      colors: theme.colors.alpha.white[100],
    },

    "&-secondary": {
      backgroundColor: theme.colors.secondary.lighter,
      colors: theme.palette.secondary.main,
    },

    "&-success": {
      backgroundColor: theme.colors.success.lighter,
      colors: theme.palette.success.main,
    },

    "&-warning": {
      backgroundColor: theme.colors.warning.lighter,
      colors: theme.palette.warning.main,
    },

    "&-error": {
      backgroundColor: theme.colors.error.lighter,
      colors: theme.palette.error.main,
    },

    "&-info": {
      backgroundColor: theme.colors.info.lighter,
      colors: theme.palette.info.main,
    },
  },
}));

interface MuiLabelProps {
  children?: React.ReactNode;
  color?:
    | "primary"
    | "black"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "info";
  className?: string;
}

export function MuiLabel(props: MuiLabelProps) {
  const { className, color = "secondary", children, ...reset } = props;

  return (
    <LabelWrapper className={"MuiLabel-" + color} {...reset}>
      {children}
    </LabelWrapper>
  );
}
