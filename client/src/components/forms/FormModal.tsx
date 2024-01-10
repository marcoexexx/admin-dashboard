import { Store } from "@/context/store";
import { useStore } from "@/hooks";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface FormModalProps {
  field: Store["modalForm"]["field"]
  title: string
  description?: string
  onClose: () => void
  children: React.ReactNode
}

export function FormModal(props: FormModalProps) {
  const { title, field, description, onClose, children } = props
  const { state } = useStore()

  return (
    <Dialog open={state.modalForm.state && state.modalForm.field === field} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description ? <DialogContentText>{description}</DialogContentText> : null}
        {children}
      </DialogContent>
    </Dialog>
  )
}
