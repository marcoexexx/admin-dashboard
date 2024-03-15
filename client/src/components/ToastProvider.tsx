import { useStore } from "@/hooks";
import { Alert, Snackbar } from "@mui/material";

export function ToastProvider() {
  const { state, dispatch } = useStore();
  const { toast } = state;

  const onCloseHandler = () => {
    dispatch({ type: "CLOSE_TOAST" });
  };

  return (
    <Snackbar
      open={toast.status}
      autoHideDuration={1000 * 5}
      onClose={onCloseHandler}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Alert onClose={onCloseHandler} severity={toast.severity} sx={{ width: "100%" }}>
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
